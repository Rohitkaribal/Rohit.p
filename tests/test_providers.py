"""Tests for providers (mock + registry)."""

import os

from omega_omni.providers.mock import MockProvider
from omega_omni.providers.registry import (
    build_registry, default_provider_specs, BUILT_IN_PROVIDER_COUNT,
)


def test_mock_provider_returns_structured_stage1():
    p = MockProvider(name="m", variant="confident", structured=True)
    # stage1 system prompt contains "STAGE 1"
    sys1 = "STAGE 1 — INDEPENDENT EXPLORATION\nRespond with JSON..."
    resp = p.complete(sys1, "the task")
    assert '"claims"' in resp.text
    import json
    obj = json.loads(resp.text)
    assert isinstance(obj["claims"], list)
    assert len(obj["claims"]) >= 1


def test_mock_provider_stage_variants_differ():
    a = MockProvider(name="a", variant="confident").complete("STAGE 4", "t")
    b = MockProvider(name="b", variant="skeptic").complete("STAGE 4", "t")
    assert a.text != b.text


def test_default_specs_have_at_least_twelve():
    specs = default_provider_specs()
    assert len(specs) >= 12
    names = {s.name for s in specs}
    # spot-check the marquee names from the spec
    for expected in ["openai", "claude", "grok", "gemini", "perplexity",
                     "deepseek", "kimi", "qwen", "mistral", "meta"]:
        assert expected in names, f"missing {expected}"
    assert BUILT_IN_PROVIDER_COUNT >= 12


def test_registry_skips_missing_keys(monkeypatch):
    # clear all keys
    for k in list(os.environ):
        if k.endswith("API_KEY") or k == "OLLAMA_HOST":
            monkeypatch.delenv(k, raising=False)
    provs = build_registry(include_mock=False)
    assert provs == []


def test_registry_includes_mocks():
    provs = build_registry(include_mock=True, mock_count=4)
    assert len(provs) == 4
    assert all(p.available for p in provs)


def test_registry_only_filter():
    provs = build_registry(include_mock=True, mock_count=6, only=["mock-0", "mock-2"])
    assert len(provs) == 2
    assert {p.name for p in provs} == {"mock-0", "mock-2"}


def test_registry_explicit_keys_override():
    specs = default_provider_specs()[:1]  # just openai
    provs = build_registry(specs, keys={"openai": "sk-test"})
    assert len(provs) == 1
    assert provs[0].available
    assert provs[0].api_key == "sk-test"
