"""Stage 4 — Synthesis.

The strongest available model(s) produce a refined candidate + confidence +
unresolved questions + provenance. The unresolved questions drive the next
recursive round (fed back to Stage 1).
"""

from __future__ import annotations

from typing import Any

from omega_omni.core.blackboard import (
    Blackboard, CandidateAnswer, Claim, JudgeScore, Provenance, RoundResult,
)
from omega_omni.core.prompts import (
    STAGE4_SYSTEM, STAGE4_USER, _extract_json, parse_stage4,
)
from omega_omni.stages.base import StageRunner


def _rebuttals_block(board: Blackboard, limit: int = 12) -> str:
    if not board.rebuttals:
        return "(none)"
    lines = []
    for rb in board.rebuttals[-limit:]:
        lines.append(
            f"- [{rb.target_claim_id}] {rb.position} ({rb.confidence:.2f}) "
            f"by {rb.by.short()}: {rb.argument[:140]}"
        )
    return "\n".join(lines)


def _scores_block(scores: list[JudgeScore], limit: int = 12) -> str:
    if not scores:
        return "(none)"
    lines = []
    for s in scores[-limit:]:
        d = " [DESTROYED]" if s.destroyed else ""
        lines.append(
            f"- {s.judge.short()}: composite={s.composite:.2f}{d} — {s.notes[:100]}"
        )
    return "\n".join(lines)


class Stage4Synthesis(StageRunner):
    name = "stage4"

    def run(self, board: Blackboard, rnd: int, rr: RoundResult) -> None:
        providers = self.select_providers()
        if not providers:
            self.log.warning("no providers selected for stage4")
            # fall back to a deterministic draft so the loop can still gate
            rr.stage4_candidate = self._fallback_candidate(board, rnd)
            return

        live = board.merged_claims()
        # average composite from this round's judge scores
        scores = rr.stage3_scores
        avg = (sum(s.composite for s in scores) / len(scores)) if scores else 0.0

        user = STAGE4_USER.format(
            task=board.task,
            claims=_claims_block_static(live),
            rebuttals=_rebuttals_block(board),
            scores=_scores_block(scores),
            avg_score=avg,
        )
        results = self.fanout(providers, STAGE4_SYSTEM, user_for=user)

        best: CandidateAnswer | None = None
        for provider, resp in results:
            prov = self.provenance(provider, rnd)
            data = _extract_json(resp.text)
            cand = parse_stage4(data, prov)
            if cand is None:
                self.log.info("r%d %s: unparseable synthesis", rnd, provider.name)
                continue
            self.log.info(
                "r%d %s: candidate conf=%.2f, %d open q",
                rnd, provider.name, cand.confidence, len(cand.unresolved_questions),
            )
            if best is None or cand.confidence > best.confidence:
                best = cand

        rr.stage4_candidate = best or self._fallback_candidate(board, rnd)

    @staticmethod
    def _claims_block(claims: list[Claim], limit: int = 16) -> str:
        return _claims_block_static(claims, limit)

    def _fallback_candidate(self, board: Blackboard, rnd: int) -> CandidateAnswer:
        live = board.merged_claims()
        if not live:
            return CandidateAnswer(
                answer="(no claims could be synthesised)",
                confidence=0.0,
                unresolved_questions=["provider availability / parsing failures"],
                provenance=Provenance(provider="fallback", stage="stage4", round=rnd),
            )
        top = live[:5]
        answer = "Synthesised from top claims:\n" + "\n".join(
            f"- {c.statement} (conf={c.confidence:.2f}, via {c.provenance.short()})"
            for c in top
        )
        conf = sum(c.confidence for c in top) / len(top) if top else 0.0
        return CandidateAnswer(
            answer=answer,
            confidence=conf,
            unresolved_questions=[],
            claimed_claim_ids=[c.id for c in top],
            provenance=Provenance(provider="fallback", stage="stage4", round=rnd),
        )


def _claims_block_static(claims: list[Claim], limit: int = 16) -> str:
    if not claims:
        return "(none)"
    lines = []
    for c in claims[:limit]:
        lines.append(f"- [{c.id}] (conf={c.confidence:.2f}) {c.statement[:150]}")
    if len(claims) > limit:
        lines.append(f"... ({len(claims)-limit} more)")
    return "\n".join(lines)
