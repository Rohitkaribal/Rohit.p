"""Tests for JSON parsing helpers in prompts."""

from omega_omni.core.blackboard import Provenance
from omega_omni.core.prompts import (
    _extract_json, parse_stage1, parse_stage2, parse_stage3, parse_stage4,
)


def test_extract_json_plain():
    assert _extract_json('{"a": 1}') == {"a": 1}


def test_extract_json_with_fences():
    text = '```json\n{"a": 2}\n```'
    assert _extract_json(text) == {"a": 2}


def test_extract_json_with_prose_around():
    text = 'Here you go:\n{"a": 3}\nThat is all.'
    assert _extract_json(text) == {"a": 3}


def test_extract_json_garbage_returns_none():
    assert _extract_json("not json at all") is None


def test_parse_stage1_builds_claims():
    prov = Provenance(provider="p", stage="stage1", round=1)
    data = {
        "claims": [
            {"statement": "x is true", "evidence": [
                {"kind": "fact", "content": "ref", "confidence": 0.8}],
             "confidence": 0.7, "tags": ["t"]},
            {"statement": "", "evidence": []},  # skipped (empty)
        ],
        "summary": "s", "open_questions": ["q1"],
    }
    claims, summary, oq = parse_stage1(data, prov)
    assert len(claims) == 1
    assert claims[0].statement == "x is true"
    assert claims[0].confidence == 0.7
    assert summary == "s"
    assert oq == ["q1"]


def test_parse_stage3_normalises():
    data = {"correctness": 0.9, "destroyed": True, "destroy_argument": "boom"}
    s = parse_stage3(data)
    assert s["correctness"] == 0.9
    assert s["destroyed"] is True
    assert s["destroy_argument"] == "boom"
    assert parse_stage3(None) is None


def test_parse_stage4_builds_candidate():
    prov = Provenance(provider="p", stage="stage4", round=2)
    data = {"answer": "the answer", "confidence": 0.8,
            "unresolved_questions": ["q"], "claimed_claim_ids": ["c1"]}
    cand = parse_stage4(data, prov)
    assert cand is not None
    assert cand.answer == "the answer"
    assert cand.confidence == 0.8
    assert cand.unresolved_questions == ["q"]
