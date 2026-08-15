"""Stage 2 — Deliberation (collective).

Fresh or overlapping agents see the collective evidence + prior answers, then
debate, challenge, merge, reject, and investigate disagreements. Disagreement
amplification: extra compute is spent exactly where answers conflict.
"""

from __future__ import annotations

import json
from typing import Any

from omega_omni.core.blackboard import (
    Blackboard, Claim, Evidence, Provenance, Rebuttal, RoundResult,
)
from omega_omni.core.prompts import (
    STAGE2_SYSTEM, STAGE2_USER, _extract_json, parse_stage2,
)
from omega_omni.stages.base import StageRunner


def _claims_digest(claims: list[Claim], limit: int = 16) -> str:
    if not claims:
        return "(none yet)"
    lines: list[str] = []
    for c in claims[:limit]:
        ev = "; ".join(e.content[:80] for e in c.evidence[:2]) or "(no evidence)"
        lines.append(f"- [{c.id}] (conf={c.confidence:.2f}, tags={c.tags}) "
                     f"{c.statement[:160]}\n    evidence: {ev}")
    if len(claims) > limit:
        lines.append(f"... ({len(claims)-limit} more claims omitted)")
    return "\n".join(lines)


def _disagreements_text(clusters: list[list[str]], board: Blackboard) -> str:
    if not clusters:
        return "(no detected disagreements; debate any tensions you notice)"
    lines: list[str] = []
    for i, cluster in enumerate(clusters):
        items = [board.claims[cid] for cid in cluster if cid in board.claims]
        if not items:
            continue
        lines.append(f"Cluster {i+1}:")
        for c in items:
            lines.append(f"  - [{c.id}] (conf={c.confidence:.2f}) {c.statement[:140]}")
    return "\n".join(lines) if lines else "(no detected disagreements)"


class Stage2Deliberation(StageRunner):
    name = "stage2"

    def run(self, board: Blackboard, rnd: int, rr: RoundResult) -> None:
        providers = self.select_providers()
        if not providers:
            self.log.warning("no providers selected for stage2")
            return

        live = board.merged_claims()
        disagreements = board.find_disagreements()
        rr.disagreement_clusters = disagreements

        user = STAGE2_USER.format(
            task=board.task,
            digest=_claims_digest(live),
            disagreements=_disagreements_text(disagreements, board),
        )
        results = self.fanout(providers, STAGE2_SYSTEM, user_for=user)

        for provider, resp in results:
            prov = self.provenance(provider, rnd)
            data = _extract_json(resp.text)
            parsed = parse_stage2(data)
            self._apply(parsed, board, rr, prov)
            self.log.info(
                "r%d %s: %d rebuttals, %d new claims, %d merges",
                rnd, provider.name,
                len(parsed["rebuttals"]), len(parsed["new_claims"]),
                len(parsed["merge_proposals"]),
            )

    def _apply(self, parsed: dict[str, Any], board: Blackboard,
               rr: RoundResult, prov: Provenance) -> None:
        # rebuttals
        for r in parsed["rebuttals"]:
            if not isinstance(r, dict):
                continue
            tid = str(r.get("target_claim_id", "")).strip()
            if not tid:
                continue
            board.rebuttals.append(Rebuttal(
                target_claim_id=tid,
                by=prov,
                position=str(r.get("position", "disagree")),
                argument=str(r.get("argument", "")),
                proposed_refinement=r.get("proposed_refinement"),
                confidence=float(r.get("confidence", 0.5)),
            ))
            rr.stage2_rebuttals.append(board.rebuttals[-1])
            # if a rebuttal supersedes/disagrees strongly, mark rejection cue
            if r.get("position") == "supersede" and tid in board.claims:
                board.claims[tid].rejected = True
                board.claims[tid].rejection_reason = f"superseded by {prov.short()}"

        # new claims from deliberation (with stage2 provenance)
        for i, nc in enumerate(parsed["new_claims"]):
            if not isinstance(nc, dict):
                continue
            stmt = str(nc.get("statement", "")).strip()
            if not stmt:
                continue
            evid = [
                Evidence(
                    kind=e.get("kind", "reasoning"),
                    content=str(e.get("content", "")),
                    confidence=float(e.get("confidence", 0.5)),
                    source=e.get("source"),
                )
                for e in (nc.get("evidence") or [])
                if isinstance(e, dict)
            ]
            cid = f"r{prov.round}-{prov.provider}-s2-{i}"
            if cid not in board.claims:
                c = Claim(
                    id=cid, statement=stmt, evidence=evid,
                    confidence=float(nc.get("confidence", 0.5)),
                    tags=list(nc.get("tags") or []) + ["deliberation"],
                    provenance=prov,
                )
                board.claims[cid] = c
                rr.stage1_claims.append(c)
