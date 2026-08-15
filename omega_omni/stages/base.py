"""Base class for stage runners."""

from __future__ import annotations

from typing import Any, Callable, Optional

from omega_omni.core.blackboard import Blackboard, Provenance, RoundResult
from omega_omni.core.config import OmegaConfig, StageConfig
from omega_omni.providers.base import Provider, ProviderError, ProviderResponse
from omega_omni.utils import get_logger, parallel_map


class StageRunner:
    """Common machinery: pick providers, call them in parallel, parse JSON.

    Subclasses implement :meth:`run` which receives the board, the current
    round index, and the :class:`RoundResult` to populate.
    """

    name: str = "stage"

    def __init__(self, config: OmegaConfig, providers: list[Provider]) -> None:
        self.config = config
        self.all_providers = providers
        self.log = get_logger(f"omega_omni.{self.name}")

    def stage_config(self) -> StageConfig:
        return getattr(self.config, self.name)

    def select_providers(self) -> list[Provider]:
        return self.config.providers_for_stage(self.name, self.all_providers)

    def call_provider(
        self, provider: Provider, system: str, user: str,
        **kw: Any,
    ) -> Optional[ProviderResponse]:
        try:
            return provider.complete(system, user, **kw)
        except ProviderError as exc:
            self.log.warning("[%s] %s failed: %s", self.name, provider.name, exc)
            return None
        except Exception as exc:  # noqa: BLE001
            self.log.warning("[%s] %s unexpected error: %s", self.name, provider.name, exc)
            return None

    def fanout(
        self,
        providers: list[Provider],
        system: str,
        *,
        build_user: Optional[Callable[[Provider], str]] = None,
        user_for: Optional[str] = None,
    ) -> list[tuple[Provider, ProviderResponse]]:
        """Call providers in parallel. ``build_user(provider)`` if dynamic."""
        cfg = self.stage_config()
        temperature = cfg.temperature

        def _do(p: Provider):
            sys = system
            usr = build_user(p) if build_user is not None else user_for
            r = self.call_provider(p, sys, usr, temperature=temperature)
            return (p, r) if r is not None else None

        out = parallel_map(
            _do, providers,
            max_workers=cfg.max_concurrency,
            tolerate_failures=cfg.tolerate_failures,
            logger=self.log,
            label=self.name,
        )
        return [t for t in out if t is not None]

    def provenance(self, provider: Provider, rnd: int) -> Provenance:
        return Provenance(
            provider=provider.name, stage=self.name, round=rnd,
            model=getattr(provider, "model", None),
        )

    def run(self, board: Blackboard, rnd: int, rr: RoundResult) -> None:
        raise NotImplementedError
