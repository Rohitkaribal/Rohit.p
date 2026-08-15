"""Base provider contract."""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Optional

import httpx


class ProviderError(RuntimeError):
    """Raised when a provider call fails permanently (after retries)."""


@dataclass
class ProviderResponse:
    """Normalised response from any provider."""

    provider: str
    text: str
    model: str
    elapsed_ms: int
    raw: Optional[dict[str, Any]] = field(default=None)
    usage: dict[str, int] = field(default_factory=dict)
    extra: dict[str, Any] = field(default_factory=dict)


class Provider:
    """Abstract provider. Subclasses implement :meth:`_complete`."""

    #: short id used in provenance ("openai", "claude", "grok", ...)
    name: str = "base"
    #: human label
    label: str = "Base Provider"

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: float = 60.0,
        max_retries: int = 2,
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.base_url = base_url
        self.timeout = timeout
        self.max_retries = max_retries
        self.extra = extra or {}

    @property
    def available(self) -> bool:
        """Whether this provider is configured and ready to call."""
        return True

    # -- public API ---------------------------------------------------------
    def complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        """Complete a (system, user) prompt with retries and timing."""
        last_err: Optional[Exception] = None
        for attempt in range(self.max_retries + 1):
            try:
                t0 = time.perf_counter()
                resp = self._complete(system, user, **kwargs)
                # provider implementations may return partial ProviderResponse
                # without elapsed; fill it.
                if resp.elapsed_ms == 0:
                    resp.elapsed_ms = int((time.perf_counter() - t0) * 1000)
                resp.provider = resp.provider or self.name
                resp.model = resp.model or self.model or self.name
                return resp
            except Exception as exc:  # noqa: BLE001 - surface after retries
                last_err = exc
                # exponential backoff, capped
                backoff = min(2**attempt, 8)
                time.sleep(backoff * 0.1)
        raise ProviderError(f"{self.name} failed after {self.max_retries+1} attempts: {last_err}") from last_err

    # -- to be overridden --------------------------------------------------
    def _complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        raise NotImplementedError

    # -- helpers ------------------------------------------------------------
    def _client(self) -> httpx.Client:
        return httpx.Client(timeout=self.timeout)

    def __repr__(self) -> str:
        return f"<Provider {self.name} model={self.model} available={self.available}>"
