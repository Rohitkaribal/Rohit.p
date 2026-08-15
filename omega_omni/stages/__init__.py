"""Stage runners for the four-stage pipeline."""

from omega_omni.stages.base import StageRunner
from omega_omni.stages.stage1_diversity import Stage1Diversity
from omega_omni.stages.stage2_deliberation import Stage2Deliberation
from omega_omni.stages.stage3_evaluation import Stage3Evaluation
from omega_omni.stages.stage4_synthesis import Stage4Synthesis

__all__ = [
    "StageRunner",
    "Stage1Diversity",
    "Stage2Deliberation",
    "Stage3Evaluation",
    "Stage4Synthesis",
]
