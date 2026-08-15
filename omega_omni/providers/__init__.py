"""Provider abstraction layer.

A :class:`Provider` is anything that can answer a prompt with text. The base
class defines the contract; concrete providers live in :mod:`omega_omni.providers`.

Design notes
-----------
* Every provider is *optional*. If its env var / api key is missing it is marked
  ``available=False`` and skipped silently by the orchestrator. This lets the
  system run with 1 provider or 20.
* Many providers expose an OpenAI-compatible ``/chat/completions`` endpoint
  (DeepSeek, Kimi/Moonshot, Qwen/DashScope, Groq, Together, OpenRouter,
  Mistral, xAI/Grok, Z.ai, Venice, local Ollama). They all share one
  implementation, :class:`OpenAICompatProvider`, parameterised by base_url +
  model.
* Anthropic (Claude) and Google (Gemini) have native SDK shapes; they use thin
  adapters over plain httpx so we avoid heavy SDK deps.
* A :class:`MockProvider` exists for offline testing and the demo.
"""

from omega_omni.providers.base import Provider, ProviderResponse, ProviderError
from omega_omni.providers.openai_compat import OpenAICompatProvider
from omega_omni.providers.anthropic import AnthropicProvider
from omega_omni.providers.google import GeminiProvider
from omega_omni.providers.perplexity import PerplexityProvider
from omega_omni.providers.mock import MockProvider
from omega_omni.providers.registry import (
    build_registry,
    default_provider_specs,
    BUILT_IN_PROVIDER_COUNT,
)

__all__ = [
    "Provider",
    "ProviderResponse",
    "ProviderError",
    "OpenAICompatProvider",
    "AnthropicProvider",
    "GeminiProvider",
    "PerplexityProvider",
    "MockProvider",
    "build_registry",
    "default_provider_specs",
    "BUILT_IN_PROVIDER_COUNT",
]
