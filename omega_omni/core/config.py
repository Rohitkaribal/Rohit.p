"""Configuration objects for the orchestrator.

Pydantic v2 models. All values have sensible defaults so the engine runs
out-of-the-box with mock providers; every field is overridable via the CLI or
a YAML/JSON config file.
"""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field

from omega_omni.providers.registry import ProviderSpec, default_provider_specs


class StageConfig(BaseModel):
    """Per-stage tuning. Groups may share providers or be disjoint."""

    enabled: bool = True
    #: 'shared' reuses the same provider pool; 'disjoint' partitions them.
    group_mode: str = "shared"
    #: number of agents in this stage (>=12 recommended for diversity/synth)
    group_size: int = 12
    #: if True, allow an agent to fail without aborting the stage
    tolerate_failures: bool = True
    #: max concurrent provider calls in this stage
    max_concurrency: int = 8
    #: temperature override for this stage
    temperature: float = 0.7
    extra: dict[str, Any] = Field(default_factory=dict)


class OmegaConfig(BaseModel):
    """Top-level orchestrator configuration."""

    #: provider specs (default = the 16 built-in providers)
    provider_specs: list[ProviderSpec] = Field(default_factory=default_provider_specs)
    #: explicit name -> api_key overrides (do not put secrets in code normally)
    keys: dict[str, str] = Field(default_factory=dict)
    #: restrict to these provider names (None = all available)
    only: Optional[list[str]] = None
    #: inject mock providers so the pipeline always runs (demo/test)
    include_mock: bool = True
    mock_count: int = 6

    # --- stages ---
    stage1: StageConfig = Field(default_factory=lambda: StageConfig(
        group_mode="shared", group_size=12, temperature=0.8,
        max_concurrency=8,
    ))
    stage2: StageConfig = Field(default_factory=lambda: StageConfig(
        group_mode="shared", group_size=12, temperature=0.6,
        max_concurrency=8,
    ))
    stage3: StageConfig = Field(default_factory=lambda: StageConfig(
        group_mode="shared", group_size=12, temperature=0.3,
        max_concurrency=8,
    ))
    stage4: StageConfig = Field(default_factory=lambda: StageConfig(
        group_mode="shared", group_size=3, temperature=0.4,
        max_concurrency=4,
    ))

    # --- recursion + quality gate ---
    min_rounds: int = 2
    max_rounds: int = 3
    quality_threshold: float = 0.75
    #: disagreement amplification: extra compute budget multiplier on conflicts
    disagreement_amplification: float = 1.5
    #: run adversarial red-team destroy round in stage 3
    adversarial_round: bool = True

    # --- misc ---
    request_timeout: float = 60.0
    log_level: str = "INFO"

    def providers_for_stage(self, stage: str, all_providers: list) -> list:
        """Select the provider subset for a stage based on group_mode."""
        cfg = getattr(self, stage)
        n = cfg.group_size
        if cfg.group_mode == "disjoint":
            # naive round-robin partition so stages get disjoint subsets when
            # possible; falls back to wrapping if pool smaller than group_size.
            idx = {"stage1": 0, "stage2": 1, "stage3": 2, "stage4": 3}[stage]
            if all_providers:
                return [all_providers[(i + idx) % len(all_providers)]
                        for i in range(min(n, len(all_providers)))]
            return []
        # shared: just take up to group_size (cycling if pool is smaller)
        if not all_providers:
            return []
        return [all_providers[i % len(all_providers)] for i in range(n)]
