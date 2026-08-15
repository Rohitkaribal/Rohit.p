"""Perplexity (Sonar) adapter.

Perplexity's online models return citations and a search-grounded answer.
We surface citations through ``ProviderResponse.extra['citations']``.
"""

from __future__ import annotations

from typing import Any, Optional

from omega_omni.providers.base import ProviderError, ProviderResponse
from omega_omni.providers.openai_compat import OpenAICompatProvider


class PerplexityProvider(OpenAICompatProvider):
    name = "perplexity"
    label = "Perplexity (Sonar)"

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        model: str = "sonar",
        base_url: str = "https://api.perplexity.ai",
        env_var: str = "PERPLEXITY_API_KEY",
        timeout: float = 60.0,
        max_retries: int = 2,
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            name="perplexity", label="Perplexity (Sonar)",
            api_key=api_key, model=model, base_url=base_url, env_var=env_var,
            timeout=timeout, max_retries=max_retries, extra=extra,
        )

    def _complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        # Perplexity accepts the OpenAI shape but also returns `citations`.
        resp = super()._complete(system, user, **kwargs)
        if resp.raw and "citations" in resp.raw:
            resp.extra["citations"] = resp.raw["citations"]
        return resp
