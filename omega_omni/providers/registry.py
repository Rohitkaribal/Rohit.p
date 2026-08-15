"""Provider registry: catalogue + factory.

``default_provider_specs`` defines the built-in roster of 16 providers. The
factory resolves api keys from environment (and an optional override map),
skips any provider that is unavailable, and optionally includes mock providers
so the pipeline always has something to run.

Add your own provider by appending a :class:`ProviderSpec` and, if it needs a
custom adapter, extending :func:`build_registry`.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any, Optional

from omega_omni.providers.base import Provider
from omega_omni.providers.openai_compat import OpenAICompatProvider
from omega_omni.providers.anthropic import AnthropicProvider
from omega_omni.providers.google import GeminiProvider
from omega_omni.providers.perplexity import PerplexityProvider
from omega_omni.providers.mock import MockProvider


@dataclass
class ProviderSpec:
    """Declarative description of a provider used by the factory."""

    name: str
    label: str
    kind: str = "openai_compat"  # openai_compat|anthropic|google|perplexity|mock
    env_var: str = ""
    model: str = ""
    base_url: str = ""
    extras: dict[str, Any] = field(default_factory=dict)


def default_provider_specs() -> list[ProviderSpec]:
    """The built-in 16-provider roster.

    Covers: OpenAI, Claude, Grok, Gemini, Perplexity, DeepSeek, Kimi, Qwen,
    Mistral, Meta (via Together), Z.ai, Copilot/OpenRouter, Venice, Minimax,
    Groq, Ollama(local). Easily extended with more.
    """
    return [
        ProviderSpec("openai", "ChatGPT (OpenAI)", "openai_compat",
                     "OPENAI_API_KEY", "gpt-4o-mini", "https://api.openai.com/v1"),
        ProviderSpec("claude", "Claude (Anthropic)", "anthropic",
                     "ANTHROPIC_API_KEY", "claude-3-5-sonnet-20241022",
                     "https://api.anthropic.com/v1"),
        ProviderSpec("grok", "Grok (xAI)", "openai_compat",
                     "XAI_API_KEY", "grok-2-latest", "https://api.x.ai/v1"),
        ProviderSpec("gemini", "Gemini (Google)", "google",
                     "GOOGLE_API_KEY", "gemini-1.5-flash",
                     "https://generativelanguage.googleapis.com/v1beta"),
        ProviderSpec("perplexity", "Perplexity (Sonar)", "perplexity",
                     "PERPLEXITY_API_KEY", "sonar", "https://api.perplexity.ai"),
        ProviderSpec("deepseek", "DeepSeek", "openai_compat",
                     "DEEPSEEK_API_KEY", "deepseek-chat",
                     "https://api.deepseek.com/v1"),
        ProviderSpec("kimi", "Kimi (Moonshot)", "openai_compat",
                     "MOONSHOT_API_KEY", "moonshot-v1-8k",
                     "https://api.moonshot.cn/v1"),
        ProviderSpec("qwen", "Qwen (DashScope)", "openai_compat",
                     "DASHSCOPE_API_KEY", "qwen-plus",
                     "https://dashscope.aliyuncs.com/compatible-mode/v1"),
        ProviderSpec("mistral", "Mistral", "openai_compat",
                     "MISTRAL_API_KEY", "mistral-small-latest",
                     "https://api.mistral.ai/v1"),
        ProviderSpec("meta", "Meta Llama (Together)", "openai_compat",
                     "TOGETHER_API_KEY", "meta-llama/Llama-3-70b-chat-hf",
                     "https://api.together.xyz/v1"),
        ProviderSpec("zai", "Z.ai", "openai_compat",
                     "ZAI_API_KEY", "glm-4-plus",
                     "https://open.bigmodel.cn/api/paas/v4"),
        ProviderSpec("copilot", "Copilot (OpenRouter)", "openai_compat",
                     "OPENROUTER_API_KEY", "openai/gpt-4o-mini",
                     "https://openrouter.ai/api/v1"),
        ProviderSpec("venice", "Venice", "openai_compat",
                     "VENICE_API_KEY", "llama-3.1-405b",
                     "https://api.venice.ai/api/v1"),
        ProviderSpec("minimax", "Minimax", "openai_compat",
                     "MINIMAX_API_KEY", "abab6.5-chat",
                     "https://api.minimax.chat/v1"),
        ProviderSpec("groq", "Groq", "openai_compat",
                     "GROQ_API_KEY", "llama-3.1-70b-versatile",
                     "https://api.groq.com/openai/v1"),
        ProviderSpec("ollama", "Ollama (local)", "openai_compat",
                     "OLLAMA_HOST", "llama3", "http://localhost:11434/v1"),
    ]


#: How many distinct providers are defined out of the box.
BUILT_IN_PROVIDER_COUNT = len(default_provider_specs())


def _resolve_key(spec: ProviderSpec, overrides: dict[str, str]) -> Optional[str]:
    if spec.name in overrides and overrides[spec.name]:
        return overrides[spec.name]
    if spec.env_var and os.environ.get(spec.env_var):
        return os.environ[spec.env_var]
    return None


def build_registry(
    specs: Optional[list[ProviderSpec]] = None,
    *,
    keys: Optional[dict[str, str]] = None,
    only: Optional[list[str]] = None,
    include_mock: bool = False,
    mock_count: int = 0,
) -> list[Provider]:
    """Instantiate available providers from specs.

    Parameters
    ----------
    specs
        Provider specs. Defaults to :func:`default_provider_specs`.
    keys
        Explicit ``name -> api_key`` overrides (useful for config files).
    only
        If given, restrict to these provider names (after adding mocks).
    include_mock
        Always include a few mock providers (for offline demo / testing).
    mock_count
        Number of mock providers to inject. Ignored unless ``include_mock``.
    """
    specs = list(specs) if specs is not None else default_provider_specs()
    keys = keys or {}
    providers: list[Provider] = []

    for spec in specs:
        api_key = _resolve_key(spec, keys)
        # Ollama: treat host presence as "available" — no secret key needed.
        if spec.name == "ollama" and api_key:
            # OLLAMA_HOST may be just a host; we still need a base_url host.
            base_url = api_key if api_key.startswith("http") else spec.base_url
            providers.append(OpenAICompatProvider(
                name=spec.name, label=spec.label, api_key="ollama",
                model=spec.model, base_url=base_url, env_var=spec.env_var,
                extra=spec.extras,
            ))
            continue
        if not api_key:
            continue
        prov = _instantiate(spec, api_key)
        if prov is not None:
            providers.append(prov)

    if include_mock or mock_count:
        variants = ["confident", "skeptic", "hedger", "contrarian",
                    "evidence-first", "balanced"]
        n = mock_count or (len(variants) if include_mock else mock_count)
        for i in range(max(n, mock_count)):
            v = variants[i % len(variants)]
            providers.append(MockProvider(
                name=f"mock-{i}", label=f"Mock ({v})", variant=v,
            ))

    if only:
        wanted = set(only)
        providers = [p for p in providers if p.name in wanted]

    return providers


def _instantiate(spec: ProviderSpec, api_key: str) -> Optional[Provider]:
    common = dict(api_key=api_key, model=spec.model, base_url=spec.base_url,
                  env_var=spec.env_var, extra=spec.extras)
    if spec.kind == "anthropic":
        return AnthropicProvider(**common)
    if spec.kind == "google":
        return GeminiProvider(**common)
    if spec.kind == "perplexity":
        return PerplexityProvider(**common)
    if spec.kind == "openai_compat":
        return OpenAICompatProvider(
            name=spec.name, label=spec.label, **common
        )
    return None
