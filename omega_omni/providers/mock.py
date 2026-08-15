"""Mock provider for offline demos and tests.

It produces deterministic, parameterised output so the full pipeline can run
end-to-end with no API keys. Two modes:

* ``structured=False`` (default for general use): prose replies.
* ``structured=True``: emits schema-valid JSON for the stage prompts so the
  blackboard parsers exercise every stage. Used by the demo / tests.
"""

from __future__ import annotations

import hashlib
import json
import time
from typing import Any, Optional

from omega_omni.providers.base import Provider, ProviderResponse


_VARIANTS = ("confident", "skeptic", "hedger", "contrarian", "evidence-first", "balanced")


class MockProvider(Provider):
    """A deterministic offline provider.

    ``variant`` controls the *style* of answer so multiple mocks behave like
    genuinely diverse agents (agreeing, disagreeing, hedging, etc.).
    """

    name = "mock"
    label = "Mock Provider"

    def __init__(
        self,
        *,
        name: str = "mock",
        label: Optional[str] = None,
        variant: str = "balanced",
        model: Optional[str] = None,
        latency_ms: int = 0,
        structured: bool = True,
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        super().__init__(model=model, extra=extra)
        self.name = name
        self.label = label or f"Mock ({variant})"
        self.variant = variant if variant in _VARIANTS else "balanced"
        self.latency_ms = latency_ms
        self.structured = structured

    @property
    def available(self) -> bool:
        return True

    def _complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        if self.latency_ms:
            time.sleep(self.latency_ms / 1000.0)
        seed = hashlib.sha256(f"{self.name}|{self.variant}|{user[:64]}".encode()).hexdigest()[:8]
        body = self._render(system, user, seed)
        return ProviderResponse(
            provider=self.name,
            text=body,
            model=self.model or f"mock-{self.variant}",
            elapsed_ms=self.latency_ms,
            usage={"prompt_tokens": len(user) // 4, "completion_tokens": len(body) // 4},
            extra={"variant": self.variant, "seed": seed},
        )

    # ------------------------------------------------------------------
    def _render(self, system: str, user: str, seed: str) -> str:
        if not self.structured:
            return self._prose(system, user, seed)
        # detect stage from system prompt content
        s = system
        if "STAGE 1" in s:
            return self._stage1(user, seed)
        if "STAGE 2" in s:
            return self._stage2(user, seed)
        if "STAGE 3" in s:
            return self._stage3(user, seed)
        if "STAGE 4" in s:
            return self._stage4(user, seed)
        return self._prose(system, user, seed)

    def _stance(self) -> str:
        return {
            "confident": "The correct and complete answer is well-established.",
            "skeptic": "Several assumptions need examination; treat confident answers with caution.",
            "hedger": "There are multiple valid framings; the answer depends on context.",
            "contrarian": "The mainstream view is likely incomplete or wrong; the opposite framing has merit.",
            "evidence-first": "Sourcing multiple references; the claim is supported by a reasoning chain.",
            "balanced": "A defensible answer with caveats; minor unresolved edge cases.",
        }[self.variant]

    def _tag(self, seed: str) -> str:
        # produce a pseudo topic tag for clustering
        return f"topic-{seed[:3]}"

    def _stage1(self, user: str, seed: str) -> str:
        tag = self._tag(seed)
        stance = self._stance()
        conf = {"confident": 0.85, "skeptic": 0.45, "hedger": 0.55,
                "contrarian": 0.4, "evidence-first": 0.7, "balanced": 0.6}[self.variant]
        obj = {
            "claims": [
                {
                    "statement": f"[{self.variant}] {stance} (re: {user[:60]})",
                    "evidence": [
                        {"kind": "reasoning", "content": f"Deduction chain {seed} -> conclusion.", "confidence": conf},
                        {"kind": "fact", "content": f"Established reference supporting this ({tag}).", "confidence": conf - 0.1},
                    ],
                    "confidence": conf,
                    "tags": [tag, self.variant],
                },
                {
                    "statement": f"[{self.variant}] Secondary consideration: edge cases around {user[:40]}",
                    "evidence": [
                        {"kind": "reasoning", "content": f"Counterexample analysis {seed}.", "confidence": conf - 0.15},
                    ],
                    "confidence": max(0.2, conf - 0.2),
                    "tags": [tag, "edge-case"],
                },
            ],
            "summary": f"{self.variant} view: {stance}",
            "open_questions": [f"What is the impact under extreme load for {tag}?"],
            "self_critique": "May over-index on style bias; cross-check with other agents.",
        }
        return json.dumps(obj)

    def _stage2(self, user: str, seed: str) -> str:
        # parse existing claim ids out of the digest text cheaply
        import re
        ids = re.findall(r"\[(r\d+-[^\]]+)\]", user)
        target = ids[0] if ids else "unknown"
        position = {"confident": "agree", "skeptic": "disagree", "hedger": "refine",
                     "contrarian": "disagree", "evidence-first": "refine",
                     "balanced": "refine"}[self.variant]
        obj = {
            "rebuttals": [
                {
                    "target_claim_id": target,
                    "position": position,
                    "argument": f"[{self.variant}] I {position} because {self._stance()}",
                    "proposed_refinement": (
                        f"Refined: integrate {self.variant} constraints." if position == "refine" else None
                    ),
                    "confidence": 0.6,
                }
            ] if ids else [],
            "new_claims": [
                {
                    "statement": f"[{self.variant}] Deliberation insight: synthesis requires balancing trade-offs.",
                    "evidence": [{"kind": "reasoning", "content": f"Cross-claim reconciliation {seed}.", "confidence": 0.6}],
                    "confidence": 0.65,
                    "tags": ["deliberation"],
                }
            ],
            "merge_proposals": [
                {"claim_ids": ids[:2], "merged_statement": f"Merged {self.variant} position."}
            ] if len(ids) >= 2 else [],
            "contradictions": [
                {"claim_ids": ids[:2], "description": f"Confidence divergence on {self._tag(seed)}."}
            ] if len(ids) >= 2 else [],
            "summary": f"{self.variant} deliberation complete.",
        }
        return json.dumps(obj)

    def _stage3(self, user: str, seed: str) -> str:
        conf = {"confident": 0.9, "skeptic": 0.4, "hedger": 0.6,
                "contrarian": 0.35, "evidence-first": 0.7, "balanced": 0.65}[self.variant]
        destroyed = self.variant == "contrarian"
        obj = {
            "correctness": conf,
            "evidence": max(0.3, conf - 0.1),
            "logic": conf,
            "completeness": max(0.3, conf - 0.05),
            "contradiction_penalty": 0.2 if self.variant in ("skeptic", "contrarian") else 0.05,
            "uncertainty_calibration": 0.7 if self.variant == "balanced" else conf,
            "notes": f"{self.variant} judge: {self._stance()}",
            "destroyed": destroyed,
            "destroy_argument": "Counterexample invalidates the strong form of the claim." if destroyed else None,
        }
        return json.dumps(obj)

    def _stage4(self, user: str, seed: str) -> str:
        conf = {"confident": 0.85, "skeptic": 0.5, "hedger": 0.6,
                "contrarian": 0.45, "evidence-first": 0.75, "balanced": 0.7}[self.variant]
        obj = {
            "answer": (
                f"[synthesis/{self.variant}] The collective evidence converges on a "
                f"balanced answer: {self._stance()} Provenance across multiple "
                f"independent agents supports this with calibrated uncertainty."
            ),
            "confidence": conf,
            "claimed_claim_ids": [],
            "unresolved_questions": [f"Validate edge behaviour for {self._tag(seed)}."] if self.variant != "confident" else [],
            "rationale": f"Synthesised from top-confidence claims; {self.variant} weighting.",
        }
        return json.dumps(obj)

    def _prose(self, system: str, user: str, seed: str) -> str:
        return (
            f"[{self.variant}/{seed}] {self._stance()} Regarding: {user[:60]}."
        )
