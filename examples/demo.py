#!/usr/bin/env python3
"""Offline demo of Omega Omni using mock providers (no API keys needed).

Run:
    python examples/demo.py
"""

from omega_omni import OmegaConfig, Orchestrator

TASK = (
    "Design an event-driven architecture for a real-time analytics pipeline "
    "that ingests 100k events/sec, deduplicates near-real-time, and serves "
    "sub-second queries. Justify component choices and trade-offs."
)


def main() -> None:
    cfg = OmegaConfig(
        include_mock=True,
        mock_count=6,
        min_rounds=2,
        max_rounds=3,
        quality_threshold=0.7,
        adversarial_round=True,
    )
    orch = Orchestrator(cfg)
    print(f"\nproviders in pool: {[p.name for p in orch.providers]}\n")
    result = orch.run(TASK)
    print()
    print(result.summary())
    print(f"\nrounds run: {result.rounds_run} | passed gate: {result.passed_gate}")


if __name__ == "__main__":
    main()
