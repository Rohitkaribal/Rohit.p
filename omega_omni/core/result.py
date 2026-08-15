"""Result object returned by the orchestrator."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from omega_omni.core.blackboard import Blackboard, RoundResult


class OmegaResult(BaseModel):
    """Final structured output of a run."""

    task: str
    final_answer: str
    confidence: float
    rounds_run: int
    quality_score: float
    passed_gate: bool
    unresolved_questions: list[str] = Field(default_factory=list)
    provenance_summary: list[str] = Field(default_factory=list)
    rounds: list[RoundResult] = Field(default_factory=list)

    @classmethod
    def from_board(cls, board: Blackboard, final: Optional[RoundResult]) -> "OmegaResult":
        last = final or (board.latest() if board.rounds else None)
        cand = last.stage4_candidate if last and last.stage4_candidate else None
        answer = cand.answer if cand else "(no candidate produced)"
        conf = cand.confidence if cand else 0.0
        oq = cand.unresolved_questions if cand else []
        provs: list[str] = []
        seen = set()
        for c in board.claims.values():
            key = c.provenance.short()
            if key not in seen:
                seen.add(key)
                provs.append(key)
        return cls(
            task=board.task,
            final_answer=answer,
            confidence=conf,
            rounds_run=board.current_round(),
            quality_score=last.quality_score if last else 0.0,
            passed_gate=bool(last and last.passed_gate),
            unresolved_questions=oq,
            provenance_summary=provs,
            rounds=board.rounds,
        )

    def summary(self) -> str:
        lines = [
            "=== OMEGA OMNI RESULT ===",
            f"task: {self.task[:120]}",
            f"rounds run: {self.rounds_run} | quality: {self.quality_score:.3f} "
            f"| passed gate: {self.passed_gate}",
            f"confidence: {self.confidence:.2f}",
            f"providers used ({len(self.provenance_summary)}): "
            f"{', '.join(self.provenance_summary)}",
            "",
            "FINAL ANSWER:",
            self.final_answer,
        ]
        if self.unresolved_questions:
            lines.append("")
            lines.append("UNRESOLVED QUESTIONS:")
            for q in self.unresolved_questions:
                lines.append(f"  - {q}")
        return "\n".join(lines)
