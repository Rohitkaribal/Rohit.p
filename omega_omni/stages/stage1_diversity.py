"""Stage 1 — Diversity (independent exploration).

Each agent receives the SAME task with ZERO visibility into other agents and
produces structured claims + evidence. All claims land on the blackboard.
"""

from __future__ import annotations

from omega_omni.core.blackboard import Blackboard, RoundResult
from omega_omni.core.prompts import (
    STAGE1_SYSTEM, STAGE1_USER, _extract_json, parse_stage1,
)
from omega_omni.stages.base import StageRunner


class Stage1Diversity(StageRunner):
    name = "stage1"

    def run(self, board: Blackboard, rnd: int, rr: RoundResult) -> None:
        providers = self.select_providers()
        if not providers:
            self.log.warning("no providers selected for stage1")
            return
        user = STAGE1_USER.format(task=board.task)
        results = self.fanout(providers, STAGE1_SYSTEM, user_for=user)

        for provider, resp in results:
            prov = self.provenance(provider, rnd)
            data = _extract_json(resp.text)
            claims, summary, oq = parse_stage1(data, prov)
            for c in claims:
                if c.id not in board.claims:
                    board.claims[c.id] = c
                    rr.stage1_claims.append(c)
            self.log.info(
                "r%d %s: %d claims (%s)",
                rnd, provider.name, len(claims),
                f"summary={summary[:50]!r}" if summary else "no summary",
            )
