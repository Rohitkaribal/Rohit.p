"""Omega Omni — a multi-stage, multi-model collective reasoning engine.

A recursive orchestrator that fans a task out across 12+ independent AI
providers (Stage 1: diversity), lets a second collective see the evidence and
debate it (Stage 2: deliberation), runs an independent red-team evaluation
(Stage 3), synthesises a refined candidate (Stage 4), and feeds unresolved
questions back to Stage 1 until a quality gate is satisfied or the recursion
budget is exhausted.

The public entry point is :class:`omega_omni.Orchestrator`.
"""

from omega_omni.core.blackboard import (
    Blackboard,
    Claim,
    Evidence,
    CandidateAnswer,
    RoundResult,
    JudgeScore,
    Provenance,
)
from omega_omni.core.config import OmegaConfig, ProviderSpec, StageConfig
from omega_omni.core.orchestrator import Orchestrator
from omega_omni.core.result import OmegaResult

__all__ = [
    "Blackboard",
    "Claim",
    "Evidence",
    "CandidateAnswer",
    "RoundResult",
    "JudgeScore",
    "Provenance",
    "OmegaConfig",
    "ProviderSpec",
    "StageConfig",
    "Orchestrator",
    "OmegaResult",
    "__version__",
]

__version__ = "0.1.0"
