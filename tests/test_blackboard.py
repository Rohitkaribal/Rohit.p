"""Tests for the blackboard data model and helpers."""

from omega_omni.core.blackboard import (
    Blackboard, Claim, Evidence, Provenance, RoundResult, JudgeScore,
)


def _claim(cid: str, conf: float, tags=None, rejected=False) -> Claim:
    return Claim(
        id=cid, statement=f"statement {cid}", confidence=conf,
        tags=tags or [], rejected=rejected,
        provenance=Provenance(provider="p", stage="stage1", round=1),
    )


def test_blackboard_add_round_and_latest():
    b = Blackboard(task="t")
    assert b.current_round() == 0
    rr = b.add_round()
    assert rr.round == 0
    assert b.current_round() == 1
    assert b.latest() is rr


def test_merged_claims_filters_rejected_and_sorts():
    b = Blackboard(task="t")
    b.claims["a"] = _claim("a", 0.4)
    b.claims["b"] = _claim("b", 0.9)
    b.claims["c"] = _claim("c", 0.7, rejected=True)
    merged = b.merged_claims()
    assert [c.id for c in merged] == ["b", "a"]


def test_find_disagreements_groups_by_tag():
    b = Blackboard(task="t")
    b.claims["a"] = _claim("a", 0.5, tags=["perf"])
    b.claims["b"] = _claim("b", 0.4, tags=["perf"])
    b.claims["c"] = _claim("c", 0.6, tags=["cost"])
    clusters = b.find_disagreements()
    assert clusters == [["a", "b"]]


def test_judge_score_composite_includes_penalty():
    s = JudgeScore(
        judge=Provenance(provider="p", stage="stage3", round=1),
        correctness=1.0, evidence=1.0, logic=1.0, completeness=1.0,
        uncertainty_calibration=1.0, contradiction_penalty=0.4,
    )
    assert 0.0 < s.composite < 1.0
    assert s.composite == 1.0 - 0.5 * 0.4


def test_provenance_short_format():
    p = Provenance(provider="openai", stage="stage1", round=2, model="gpt-4o-mini")
    assert p.short() == "openai/gpt-4o-mini@stage1#r2"
    p2 = Provenance(provider="x", stage="stage2", round=1)
    assert p2.short() == "x@stage2#r1"
