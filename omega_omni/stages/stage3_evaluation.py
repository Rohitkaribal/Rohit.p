"""Stage 3 — Evaluation / Red Team.

Independent judges score the Stage-4 candidate from the previous round (or a
draft formed from the top claims in the very first round). An optional
adversarial round tries to destroy the candidate. If destroyed, the quality
score is penalised and the gate will force another round.
"""

from __future__ import annotations

from typing import Optional

from omega_omni.core.blackboard import (
    Blackboard, CandidateAnswer, Claim, JudgeScore, Provenance, RoundResult,
)
from omega_omni.core.prompts import (
    STAGE3_SYSTEM, STAGE3_USER, _extract_json, parse_stage3,
)
from omega_omni.stages.base import StageRunner


def _draft_candidate(board: Blackboard) -> str:
    """If no Stage-4 candidate exists yet (first round), build a quick draft."""
    live = board.merged_claims()
    if not live:
        return "(no claims yet)"
    top = live[:5]
    parts = [f"- {c.statement} (conf={c.confidence:.2f})" for c in top]
    return "Draft from top claims:\n" + "\n".join(parts)


def _claims_block(claims: list[Claim], limit: int = 12) -> str:
    if not claims:
        return "(none)"
    lines = []
    for c in claims[:limit]:
        lines.append(f"- [{c.id}] {c.statement[:140]}")
    return "\n".join(lines)


class Stage3Evaluation(StageRunner):
    name = "stage3"

    def run(self, board: Blackboard, rnd: int, rr: RoundResult) -> None:
        providers = self.select_providers()
        if not providers:
            self.log.warning("no providers selected for stage3")
            return

        # candidate: prefer previous round's synthesis; else a draft
        prev = board.rounds[-2].stage4_candidate if len(board.rounds) >= 2 else None
        candidate_text: str
        if prev is not None:
            candidate_text = prev.answer
        else:
            candidate_text = _draft_candidate(board)

        live = board.merged_claims()
        user = STAGE3_USER.format(
            task=board.task,
            candidate=candidate_text,
            claims=_claims_block(live),
            adversarial=str(self.config.adversarial_round).lower(),
        )
        results = self.fanout(providers, STAGE3_SYSTEM, user_for=user)

        for provider, resp in results:
            prov = self.provenance(provider, rnd)
            data = _extract_json(resp.text)
            s = parse_stage3(data)
            if s is None:
                self.log.info("r%d %s: unparseable judge response", rnd, provider.name)
                continue
            score = JudgeScore(
                judge=prov,
                correctness=s["correctness"],
                evidence=s["evidence"],
                logic=s["logic"],
                completeness=s["completeness"],
                contradiction_penalty=s["contradiction_penalty"],
                uncertainty_calibration=s["uncertainty_calibration"],
                notes=s["notes"],
                destroyed=s["destroyed"],
                destroy_argument=s["destroy_argument"],
            )
            rr.stage3_scores.append(score)
            self.log.info(
                "r%d %s: composite=%.2f destroyed=%s",
                rnd, provider.name, score.composite, score.destroyed,
            )
