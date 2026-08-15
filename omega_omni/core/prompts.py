"""Prompt templates for each stage.

The prompts are designed to elicit *structured JSON* so the blackboard can
parse claims/evidence/scores deterministically. They explicitly ask agents to
use full capacity — reason, criticise assumptions, generate, self-critique —
and they have no fixed role per the spec ("they don't have separate role").
"""

from __future__ import annotations

import json
from typing import Any

from omega_omni.core.blackboard import Claim, Evidence, Provenance


# ---------------------------------------------------------------------------
# Shared scaffolding
# ---------------------------------------------------------------------------

CAPACITY_PREAMBLE = (
    "You are operating at FULL CAPACITY: reason deeply, criticise your own "
    "assumptions, consider alternatives, generate concrete content, and "
    "self-evaluate. You have no fixed role; do everything needed — thinking, "
    "decision, critique, answer. Be honest about uncertainty."
)

JSON_GUARD = (
    "Respond with a SINGLE JSON object and NOTHING ELSE. No markdown fences, "
    "no prose before or after. The object must match the given schema exactly."
)


def _extract_json(text: str) -> dict[str, Any] | None:
    """Best-effort JSON extraction from an LLM response."""
    text = text.strip()
    # strip code fences if present
    if text.startswith("```"):
        # remove first line (fence) and trailing fence
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # try to find the first {...} block
    start = text.find("{")
    end = text.rfind("}")
    if 0 <= start < end:
        chunk = text[start : end + 1]
        try:
            return json.loads(chunk)
        except json.JSONDecodeError:
            pass
    return None


# ---------------------------------------------------------------------------
# Stage 1 — Diversity
# ---------------------------------------------------------------------------

STAGE1_SYSTEM = f"""{CAPACITY_PREAMBLE}

STAGE 1 — INDEPENDENT EXPLORATION
You are one of many independent agents working in isolation. You CANNOT see
other agents. Explore the task using your full capacity and produce structured
claims backed by evidence.

{JSON_GUARD}

Schema:
{{
  "claims": [
    {{
      "statement": "<atomic, attributable factual/analytical claim>",
      "evidence": [{{ "kind": "reasoning|fact|code|citation|calculation|counterexample", "content": "<...>", "confidence": 0.0-1.0, "source": "<optional>" }}],
      "confidence": 0.0-1.0,
      "tags": ["..."]
    }}
  ],
  "summary": "<2-3 sentence overall answer>",
  "open_questions": ["..."],
  "self_critique": "<what could be wrong with your own answer>"
}}"""


STAGE1_USER = """TASK:
{task}

Think independently. Generate at least 2 claims with evidence. Surface your
own open questions and self-critique."""


# ---------------------------------------------------------------------------
# Stage 2 — Deliberation
# ---------------------------------------------------------------------------

STAGE2_SYSTEM = f"""{CAPACITY_PREAMBLE}

STAGE 2 — COLLECTIVE DELIBERATION
You now see the collective claims + evidence from Stage 1 (and possibly prior
rounds). Debate, challenge, merge, and reject. Pay extra attention exactly
where claims CONFLICT (disagreement amplification): investigate those
disagreements deeply rather than averaging them away.

{JSON_GUARD}

Schema:
{{
  "rebuttals": [
    {{
      "target_claim_id": "<id of claim you are addressing>",
      "position": "agree|disagree|refine|supersede",
      "argument": "<your critique or support>",
      "proposed_refinement": "<optional improved statement>",
      "confidence": 0.0-1.0
    }}
  ],
  "new_claims": [
    {{ "statement": "...", "evidence": [...], "confidence": 0.0-1.0, "tags": [] }}
  ],
  "merge_proposals": [
    {{ "claim_ids": ["id1","id2"], "merged_statement": "..." }}
  ],
  "contradictions": [
    {{ "claim_ids": ["id1","id2"], "description": "<why they conflict>" }}
  ],
  "summary": "<collective synthesis so far>"
}}"""


STAGE2_USER = """TASK:
{task}

COLLECTIVE EVIDENCE (from prior stages):
{digest}

ADDRESS THESE DISAGREEMENTS FIRST (amplified):
{disagreements}

Debate the claims, propose rebuttals/refinements/merges, and surface
contradictions. You may add new claims if the collective is missing something."""


# ---------------------------------------------------------------------------
# Stage 3 — Evaluation / Red Team
# ---------------------------------------------------------------------------

STAGE3_SYSTEM = f"""{CAPACITY_PREAMBLE}

STAGE 3 — INDEPENDENT JUDGING / RED TEAM
You are an independent judge. Score the candidate answer rigorously. Then, if
the adversarial flag is set, TRY TO DESTROY the answer: find any flaw that
would make it wrong, unsafe, or misleading. If you succeed, mark destroyed=true
and explain.

{JSON_GUARD}

Schema:
{{
  "correctness": 0.0-1.0,
  "evidence": 0.0-1.0,
  "logic": 0.0-1.0,
  "completeness": 0.0-1.0,
  "contradiction_penalty": 0.0-1.0,
  "uncertainty_calibration": 0.0-1.0,
  "notes": "<rationale>",
  "destroyed": true|false,
  "destroy_argument": "<if destroyed, why>"
}}"""


STAGE3_USER = """TASK:
{task}

CANDIDATE ANSWER TO EVALUATE:
{candidate}

SUPPORTING CLAIMS:
{claims}

Score rigorously and (if {adversarial}) attempt to destroy it."""


# ---------------------------------------------------------------------------
# Stage 4 — Synthesis
# ---------------------------------------------------------------------------

STAGE4_SYSTEM = f"""{CAPACITY_PREAMBLE}

STAGE 4 — SYNTHESIS
Produce the best possible refined answer from the collective evidence, scores,
and rebuttals. Preserve provenance mentally. Assign a calibrated confidence.
List unresolved questions to drive the next round if needed.

{JSON_GUARD}

Schema:
{{
  "answer": "<the refined, complete answer>",
  "confidence": 0.0-1.0,
  "claimed_claim_ids": ["..."],
  "unresolved_questions": ["..."],
  "rationale": "<why this synthesis>"
}}"""


STAGE4_USER = """TASK:
{task}

LIVE CLAIMS (confidence-sorted):
{claims}

REBUTTALS / MERGES:
{rebuttals}

JUDGE SCORES (avg composite: {avg_score:.2f}):
{scores}

Synthesise the strongest answer."""


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def parse_stage1(data: dict[str, Any] | None, prov: Provenance) -> tuple[list[Claim], str, list[str]]:
    """Build Claim objects from a parsed Stage-1 response."""
    claims: list[Claim] = []
    if not data:
        return claims, "", []
    for i, c in enumerate(data.get("claims", [])):
        if not isinstance(c, dict):
            continue
        stmt = (c.get("statement") or "").strip()
        if not stmt:
            continue
        evid = [
            Evidence(
                kind=e.get("kind", "reasoning"),
                content=str(e.get("content", "")),
                confidence=float(e.get("confidence", 0.5)),
                source=e.get("source"),
            )
            for e in (c.get("evidence") or [])
            if isinstance(e, dict)
        ]
        cid = f"r{prov.round}-{prov.provider}-{i}"
        claims.append(Claim(
            id=cid, statement=stmt, evidence=evid,
            confidence=float(c.get("confidence", 0.5)),
            tags=list(c.get("tags") or []),
            provenance=prov,
        ))
    summary = str(data.get("summary", ""))
    oq = [str(q) for q in (data.get("open_questions") or [])]
    return claims, summary, oq


def parse_stage2(data: dict[str, Any] | None):
    """Return raw stage-2 dicts (rebuttals/new_claims/merges/contradictions)."""
    if not data:
        return {"rebuttals": [], "new_claims": [], "merge_proposals": [], "contradictions": []}
    return {
        "rebuttals": data.get("rebuttals", []) or [],
        "new_claims": data.get("new_claims", []) or [],
        "merge_proposals": data.get("merge_proposals", []) or [],
        "contradictions": data.get("contradictions", []) or [],
        "summary": str(data.get("summary", "")),
    }


def parse_stage3(data: dict[str, Any] | None):
    """Return a dict of judge scores (or None)."""
    if not data:
        return None
    return {
        "correctness": float(data.get("correctness", 0.5)),
        "evidence": float(data.get("evidence", 0.5)),
        "logic": float(data.get("logic", 0.5)),
        "completeness": float(data.get("completeness", 0.5)),
        "contradiction_penalty": float(data.get("contradiction_penalty", 0.0)),
        "uncertainty_calibration": float(data.get("uncertainty_calibration", 0.5)),
        "notes": str(data.get("notes", "")),
        "destroyed": bool(data.get("destroyed", False)),
        "destroy_argument": data.get("destroy_argument"),
    }


def parse_stage4(data: dict[str, Any] | None, prov: Provenance):
    from omega_omni.core.blackboard import CandidateAnswer
    if not data:
        return None
    return CandidateAnswer(
        answer=str(data.get("answer", "")),
        confidence=float(data.get("confidence", 0.5)),
        unresolved_questions=[str(q) for q in (data.get("unresolved_questions") or [])],
        claimed_claim_ids=[str(x) for x in (data.get("claimed_claim_ids") or [])],
        provenance=prov,
    )
