"""The Orchestrator: triage + recursive four-stage loop + quality gate.

Flow per the spec:

    USER TASK
       |
    ORCHESTRATOR / TRIAGE  (estimate difficulty -> allocate compute)
       |
    STAGE 1 — DIVERSITY    (independent, parallel, zero cross-visibility)
       |
    STAGE 2 — DELIBERATION (collective; debate, merge, reject, amplify disagreement)
       |
    STAGE 3 — EVALUATION / RED TEAM (independent judges + adversarial destroy)
       |
    STAGE 4 — SYNTHESIS    (refined candidate + confidence + open questions)
       |
    QUALITY GATE
       pass -> FINAL
       fail -> feed refined state + open questions back to STAGE 1 (recursive)
"""

from __future__ import annotations

from typing import Optional

from omega_omni.core.blackboard import Blackboard, RoundResult
from omega_omni.core.config import OmegaConfig
from omega_omni.providers.base import Provider
from omega_omni.providers.registry import build_registry
from omega_omni.stages import (
    Stage1Diversity, Stage2Deliberation, Stage3Evaluation, Stage4Synthesis,
)
from omega_omni.utils import get_logger


class Orchestrator:
    """Runs the recursive collective-reasoning pipeline."""

    def __init__(
        self,
        config: Optional[OmegaConfig] = None,
        providers: Optional[list[Provider]] = None,
    ) -> None:
        self.config = config or OmegaConfig()
        self.providers = providers if providers is not None else build_registry(
            self.config.provider_specs,
            keys=self.config.keys,
            only=self.config.only,
            include_mock=self.config.include_mock,
            mock_count=self.config.mock_count,
        )
        self.log = get_logger("omega_omni.orchestrator")
        self._validate_pool()

        self.stage1 = Stage1Diversity(self.config, self.providers)
        self.stage2 = Stage2Deliberation(self.config, self.providers)
        self.stage3 = Stage3Evaluation(self.config, self.providers)
        self.stage4 = Stage4Synthesis(self.config, self.providers)

    # ------------------------------------------------------------------
    # public API
    # ------------------------------------------------------------------
    def run(self, task: str) -> "OmegaResult":  # noqa: F821 (fwd ref)
        """Execute the full recursive pipeline and return a result object."""
        from omega_omni.core.result import OmegaResult

        board = Blackboard(task=task)
        board.difficulty_estimate = self._triage(task)
        self.log.info(
            "START task=%r difficulty=%.2f providers=%d",
            task[:80], board.difficulty_estimate, len(self.providers),
        )

        final_round: Optional[RoundResult] = None
        for rnd in range(1, self.config.max_rounds + 1):
            self.log.info("=== ROUND %d/%d ===", rnd, self.config.max_rounds)
            rr = board.add_round()

            self.stage1.run(board, rnd, rr)
            self.stage2.run(board, rnd, rr)
            self.stage3.run(board, rnd, rr)
            self.stage4.run(board, rnd, rr)

            rr.quality_score = self._quality_score(rr)
            rr.passed_gate = self._gate(rr, rnd, board)
            final_round = rr

            self.log.info(
                "round %d done: quality=%.3f passed=%s conf=%.2f",
                rnd, rr.quality_score, rr.passed_gate,
                rr.stage4_candidate.confidence if rr.stage4_candidate else 0.0,
            )

            if rr.passed_gate:
                self.log.info("QUALITY GATE PASSED at round %d", rnd)
                break
            if rnd < self.config.max_rounds:
                self._inject_open_questions(board, rr)

        from omega_omni.core.result import OmegaResult  # reimport for safety
        return OmegaResult.from_board(board, final_round)

    # ------------------------------------------------------------------
    # triage
    # ------------------------------------------------------------------
    def _triage(self, task: str) -> float:
        """Cheap heuristic difficulty estimate in [0,1].

        Longer tasks and tasks with quantifiers / multi-part phrasing are
        scored harder, which could allocate more rounds/agents (kept simple
        here: influences the gate tolerance via config).
        """
        words = len(task.split())
        base = min(1.0, words / 80.0)
        signals = [" and ", " versus ", " compare ", " trade-off", " tradeoff",
                   "why", "prove", "analyse", "design", "architecture"]
        for s in signals:
            if s in task.lower():
                base = min(1.0, base + 0.05)
        return round(base, 2)

    # ------------------------------------------------------------------
    # quality gate
    # ------------------------------------------------------------------
    def _quality_score(self, rr: RoundResult) -> float:
        """Aggregate judge composites + candidate confidence + destroy penalty."""
        if not rr.stage3_scores:
            return rr.stage4_candidate.confidence if rr.stage4_candidate else 0.0
        avg_judge = sum(s.composite for s in rr.stage3_scores) / len(rr.stage3_scores)
        cand_conf = rr.stage4_candidate.confidence if rr.stage4_candidate else 0.0
        destroyed = sum(1 for s in rr.stage3_scores if s.destroyed)
        destroy_penalty = 0.15 * destroyed / max(1, len(rr.stage3_scores))
        return max(0.0, min(1.0, 0.6 * avg_judge + 0.4 * cand_conf - destroy_penalty))

    def _gate(self, rr: RoundResult, rnd: int, board: Blackboard) -> bool:
        # Budget exhausted -> emit best effort (spec: max rounds reached -> FINAL).
        if rnd >= self.config.max_rounds:
            return True
        # Respect the minimum-rounds floor before allowing an early pass.
        if rnd < self.config.min_rounds:
            return False
        return rr.quality_score >= self.config.quality_threshold

    # ------------------------------------------------------------------
    # recursion: feed open questions back as context for stage 1
    # ------------------------------------------------------------------
    def _inject_open_questions(self, board: Blackboard, rr: RoundResult) -> None:
        if rr.stage4_candidate and rr.stage4_candidate.unresolved_questions:
            oq = rr.stage4_candidate.unresolved_questions
            self.log.info("feeding %d open questions back to next round", len(oq))
            # attach as a note on the task for the next round's stage1 prompt
            extra = "\n\nOPEN QUESTIONS FROM PRIOR ROUND (address these):\n- " + \
                    "\n- ".join(oq)
            board.task = board.task + extra

    # ------------------------------------------------------------------
    def _validate_pool(self) -> None:
        avail = [p for p in self.providers if p.available]
        if not avail:
            self.log.warning(
                "NO available providers! forcing mock providers so the pipeline "
                "can still run."
            )
            from omega_omni.providers.mock import MockProvider
            variants = ["confident", "skeptic", "hedger", "contrarian",
                        "evidence-first", "balanced"]
            self.providers = [
                MockProvider(name=f"mock-{i}", label=f"Mock ({v})", variant=v)
                for i, v in enumerate(variants)
            ]
        else:
            self.providers = avail
        self.log.info(
            "provider pool (%d): %s",
            len(self.providers),
            ", ".join(p.name for p in self.providers),
        )
