"""Mathematical utilities for EPA calculations."""

import math
from dataclasses import dataclass
from typing import Tuple

import numpy as np


def sigmoid(x: float) -> float:
    """Standard sigmoid function."""
    return 1 / (1 + math.exp(-x))


def inv_sigmoid(y: float) -> float:
    """Inverse sigmoid function."""
    if y <= 0:
        return -10
    if y >= 1:
        return 10
    return math.log(y / (1 - y))


def win_probability(red_epa: float, blue_epa: float, score_sd: float) -> float:
    """Calculate win probability using logistic function.

    Args:
        red_epa: Sum of red alliance team EPAs
        blue_epa: Sum of blue alliance team EPAs
        score_sd: Season's score standard deviation

    Returns:
        Probability that red alliance wins (0-1)
    """
    if score_sd <= 0:
        score_sd = 30.0
    norm_diff = (red_epa - blue_epa) / score_sd
    k = -5 / 8
    return 1 / (1 + 10 ** (k * norm_diff))


@dataclass
class SkewNormal:
    """Skew-normal distribution for tracking EPA uncertainty."""

    mean: float = 0.0
    variance: float = 1.0
    skewness: float = 0.0

    @property
    def sd(self) -> float:
        return math.sqrt(max(0.001, self.variance))

    def confidence_interval(self, confidence: float = 0.95) -> Tuple[float, float]:
        z = 1.96 if confidence >= 0.95 else 1.645 if confidence >= 0.90 else 1.0
        margin = z * self.sd
        return (self.mean - margin, self.mean + margin)

    def update_ewma(self, new_value: float, weight: float = 0.3) -> "SkewNormal":
        new_mean = (1 - weight) * self.mean + weight * new_value
        error_sq = (new_value - self.mean) ** 2
        new_variance = (1 - weight) * self.variance + weight * error_sq
        new_variance = max(1.0, min(10000.0, new_variance))
        return SkewNormal(mean=new_mean, variance=new_variance, skewness=self.skewness)


def normalize_epa(
    epa: float,
    season_mean: float,
    season_sd: float,
    norm_mean: float = 1500.0,
    norm_sd: float = 250.0,
) -> float:
    """Convert season-specific EPA to normalized (cross-year comparable) scale."""
    if season_sd <= 0:
        season_sd = 30.0
    z_score = (epa - season_mean) / season_sd
    return norm_mean + z_score * norm_sd


def denormalize_epa(
    norm_epa: float,
    season_mean: float,
    season_sd: float,
    norm_mean: float = 1500.0,
    norm_sd: float = 250.0,
) -> float:
    """Convert normalized EPA back to season-specific scale."""
    if norm_sd <= 0:
        norm_sd = 250.0
    z_score = (norm_epa - norm_mean) / norm_sd
    return season_mean + z_score * season_sd


def calculate_update_weight(matches_played: int, is_elim: bool = False) -> float:
    """Calculate EPA update weight based on matches played.

    Weight decreases as team plays more matches (more confidence in estimate).
    Elimination matches use reduced weight.
    """
    base_weight = max(0.3, 0.5 - 0.02 * matches_played)
    if is_elim:
        base_weight *= 1 / 3
    return base_weight
