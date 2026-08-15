"""Command-line interface for Omega Omni.

Examples
--------
Run offline with mock providers (no API keys needed)::

    omega-omni "Compare REST vs GraphQL for a mobile backend."
    omega-omni --mock --mock-count 6 "Explain quantum entanglement."

Run with real providers (export their API keys first)::

    export OPENAI_API_KEY=... ANTHROPIC_API_KEY=... DEEPSEEK_API_KEY=...
    omega-omni --no-mock --only openai,claude,deepseek "Design a rate limiter."

Tune the recursion::

    omega-omni --min-rounds 2 --max-rounds 4 --threshold 0.8 "..."
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Optional

from omega_omni import OmegaConfig, Orchestrator


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="omega-omni",
        description="Multi-stage, multi-model collective reasoning engine.",
    )
    p.add_argument("task", nargs="?", help="The task/question to reason about.")
    p.add_argument("--mock", dest="include_mock", action="store_true",
                   default=None, help="Include mock providers (default on if no keys).")
    p.add_argument("--no-mock", dest="include_mock", action="store_false",
                   help="Disable mock providers (use real providers only).")
    p.add_argument("--mock-count", type=int, default=6,
                   help="Number of mock providers to inject.")
    p.add_argument("--only", default=None,
                   help="Comma-separated provider names to restrict to.")
    p.add_argument("--min-rounds", type=int, default=2)
    p.add_argument("--max-rounds", type=int, default=3)
    p.add_argument("--threshold", type=float, default=0.75,
                   help="Quality-gate threshold in [0,1].")
    p.add_argument("--adversarial", dest="adversarial", action="store_true",
                   default=True, help="Enable red-team destroy round.")
    p.add_argument("--no-adversarial", dest="adversarial", action="store_false",
                   help="Disable red-team destroy round.")
    p.add_argument("--json", action="store_true",
                   help="Emit full result as JSON instead of a summary.")
    p.add_argument("--quiet", action="store_true", help="Reduce log noise.")
    p.add_argument("--config", default=None,
                   help="Path to a YAML/JSON config file (optional).")
    return p


def load_config_file(path: Optional[str]) -> dict:
    if not path:
        return {}
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()
    if path.endswith((".yaml", ".yml")):
        try:
            import yaml  # type: ignore
        except ImportError as exc:
            raise SystemExit("PyYAML is required for YAML config: pip install pyyaml") from exc
        return yaml.safe_load(text) or {}
    return json.loads(text)


def main(argv: Optional[list[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    if not args.task:
        print("error: a task is required (or pass --help)", file=sys.stderr)
        return 2

    if args.quiet:
        import logging
        logging.getLogger("omega_omni").setLevel(logging.WARNING)

    overrides = load_config_file(args.config)

    only = args.only.split(",") if args.only else overrides.get("only")
    cfg = OmegaConfig(
        include_mock=args.include_mock if args.include_mock is not None
        else overrides.get("include_mock", True),
        mock_count=args.mock_count,
        only=only,
        min_rounds=args.min_rounds,
        max_rounds=args.max_rounds,
        quality_threshold=args.threshold,
        adversarial_round=args.adversarial,
    )
    # apply optional key overrides from config file
    if "keys" in overrides:
        cfg.keys = dict(overrides["keys"])

    orch = Orchestrator(cfg)
    if not orch.providers:
        print("error: no providers available. Export API keys or run with --mock.",
              file=sys.stderr)
        return 3

    print(f"providers: {', '.join(p.name for p in orch.providers)}", file=sys.stderr)

    result = orch.run(args.task)

    if args.json:
        print(result.model_dump_json(indent=2))
    else:
        print(result.summary())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
