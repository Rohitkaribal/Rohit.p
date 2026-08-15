"""Pydantic v2 schemas for the shared blackboard.

These structures flow through every stage. A :class:`Blackboard` is the shared
memory a round mutates: Stage 1 writes claims/evidence, Stage 2 writes
rebuttals/merges, Stage 3 writes scores, Stage 4 writes the refined candidate.
Keeping them typed and serialisable is what makes recursion + provenance work.
"""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class Provenance(BaseModel):
    """Where a piece of reasoning came from."""

    provider: str
    stage: str
    round: int
    model: Optional[str] = None
    extras: dict[str, Any] = Field(default_factory=dict)

    def short(self) -> str:
        m = f"/{self.model}" if self.model else ""
        return f"{self.provider}{m}@{self.stage}#r{self.round}"


class Evidence(BaseModel):
    """A concrete piece of supporting material for a claim."""

    kind: str = "reasoning"  # reasoning|fact|code|citation|calculation|counterexample
    content: str
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    source: Optional[str] = None  # url / file / tool output reference


class Claim(BaseModel):
    """An atomic, attributable statement produced by an agent."""

    id: str
    statement: str
    evidence: list[Evidence] = Field(default_factory=list)
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    tags: list[str] = Field(default_factory=list)
    rejected: bool = False
    rejection_reason: Optional[str] = None
    provenance: Provenance
    critiques: list[str] = Field(default_factory=list)


class Rebuttal(BaseModel):
    """A challenge raised against a claim during deliberation."""

    target_claim_id: str
    by: Provenance
    position: str = "disagree"  # agree|disagree|refine|supersede
    argument: str
    proposed_refinement: Optional[str] = None
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)


class CandidateAnswer(BaseModel):
    """A synthesised answer produced at the end of a round."""

    answer: str
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    unresolved_questions: list[str] = Field(default_factory=list)
    claimed_claim_ids: list[str] = Field(default_factory=list)
    provenance: Provenance


class JudgeScore(BaseModel):
    """An independent judge's score on a candidate."""

    judge: Provenance
    correctness: float = Field(default=0.5, ge=0.0, le=1.0)
    evidence: float = Field(default=0.5, ge=0.0, le=1.0)
    logic: float = Field(default=0.5, ge=0.0, le=1.0)
    completeness: float = Field(default=0.5, ge=0.0, le=1.0)
    contradiction_penalty: float = Field(default=0.0, ge=0.0, le=1.0)
    uncertainty_calibration: float = Field(default=0.5, ge=0.0, le=1.0)
    notes: str = ""
    destroyed: bool = False  # set by adversarial round if it broke the answer
    destroy_argument: Optional[str] = None

    @property
    def composite(self) -> float:
        """Weighted aggregate score in [0, 1]."""
        base = (
            0.30 * self.correctness
            + 0.20 * self.evidence
            + 0.20 * self.logic
            + 0.15 * self.completeness
            + 0.15 * self.uncertainty_calibration
        )
        return max(0.0, base - 0.5 * self.contradiction_penalty)


class RoundResult(BaseModel):
    """Everything produced in one full pass through stages 1-4."""

    round: int
    stage1_claims: list[Claim] = Field(default_factory=list)
    stage2_rebuttals: list[Rebuttal] = Field(default_factory=list)
    stage3_scores: list[JudgeScore] = Field(default_factory=list)
    stage4_candidate: Optional[CandidateAnswer] = None
    disagreement_clusters: list[list[str]] = Field(default_factory=list)
    quality_score: float = 0.0
    passed_gate: bool = False


class Blackboard(BaseModel):
    """Shared memory mutated across stages and rounds."""

    task: str
    difficulty_estimate: float = 0.5
    rounds: list[RoundResult] = Field(default_factory=list)

    # Accumulated, deduplicated-by-id claim store across rounds.
    claims: dict[str, Claim] = Field(default_factory=dict)
    rebuttals: list[Rebuttal] = Field(default_factory=list)

    def current_round(self) -> int:
        return len(self.rounds)

    def add_round(self) -> RoundResult:
        rr = RoundResult(round=self.current_round())
        self.rounds.append(rr)
        return rr

    def latest(self) -> Optional[RoundResult]:
        return self.rounds[-1] if self.rounds else None

    def find_disagreements(self, top_k: int = 6) -> list[list[str]]:
        """Cluster claims that address the same sub-question but conflict.

        Uses a cheap heuristic: claims sharing a tag are grouped. Returns lists
        of claim ids that should get amplified scrutiny in Stage 2.
        """
        live = self.merged_claims()
        if len(live) < 2:
            return []
        by_tag: dict[str, list[str]] = {}
        for c in live:
            tags = c.tags or ["__untagged__"]
            for t in tags:
                by_tag.setdefault(t, []).append(c.id)
        clusters = [v for v in by_tag.values() if len(v) >= 2]
        return clusters[:top_k]

    def merged_claims(self) -> list[Claim]:
        """All non-rejected claims, highest confidence first."""
        live = [c for c in self.claims.values() if not c.rejected]
        return sorted(live, key=lambda c: c.confidence, reverse=True)

    def consensus_view(self) -> str:
        """A compact, human-readable digest of the board state."""
        lines: list[str] = [f"# Blackboard digest (round {self.current_round()})"]
        lines.append(f"task: {self.task}")
        live = self.merged_claims()
        lines.append(f"live claims: {len(live)}")
        if live:
            top = live[:5]
            lines.append("top claims:")
            for c in top:
                lines.append(f"  - [{c.confidence:.2f}] {c.statement[:160]}")
        if self.rebuttals:
            lines.append(f"rebuttals: {len(self.rebuttals)}")
        last = self.latest()
        if last and last.stage4_candidate is not None:
            cand = last.stage4_candidate
            lines.append(
                f"latest candidate [{cand.confidence:.2f}]: {cand.answer[:200]}"
            )
        return "\n".join(lines)
