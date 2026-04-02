"""Core EPA Model for FTC.

EPA (Expected Points Added) measures how many points a team contributes to
their alliance's score compared to an average team.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

from .math import SkewNormal, calculate_update_weight, normalize_epa, win_probability


@dataclass
class TeamEPA:
    """EPA state for a single team."""

    team_number: int
    season: int

    # Core EPA values (points)
    total: float = 0.0
    auto: float = 0.0
    dc: float = 0.0
    endgame: float = 0.0

    # Component EPAs (season-specific)
    components: Dict[str, float] = field(default_factory=dict)

    # Tracking
    matches_played: int = 0

    # Uncertainty tracking
    total_dist: SkewNormal = field(default_factory=SkewNormal)

    # Normalized EPA (cross-season comparable)
    norm_epa: float = 1500.0

    @property
    def confidence_interval(self) -> Tuple[float, float]:
        return self.total_dist.confidence_interval(0.95)


@dataclass
class MatchPrediction:
    """Prediction for a single match."""

    red_score: float
    blue_score: float
    red_win_prob: float

    red_auto: float = 0.0
    red_dc: float = 0.0
    red_endgame: float = 0.0
    blue_auto: float = 0.0
    blue_dc: float = 0.0
    blue_endgame: float = 0.0

    @property
    def blue_win_prob(self) -> float:
        return 1.0 - self.red_win_prob

    @property
    def predicted_winner(self) -> str:
        return "red" if self.red_win_prob > 0.5 else "blue"


class EPAModel:
    """EPA calculation model for FTC."""

    ALLIANCE_SIZE = 2
    NORM_MEAN = 1500.0
    NORM_SD = 250.0
    INIT_PENALTY = 0.2
    MEAN_REVERSION = 0.4

    def __init__(
        self,
        season: int,
        score_mean: float = 100.0,
        score_sd: float = 30.0,
    ):
        self.season = season
        self.score_mean = score_mean
        self.score_sd = score_sd
        self.team_epas: Dict[int, TeamEPA] = {}

    def get_team_epa(self, team_number: int) -> TeamEPA:
        if team_number not in self.team_epas:
            init_epa = self._calculate_init_epa(team_number)
            self.team_epas[team_number] = TeamEPA(
                team_number=team_number,
                season=self.season,
                total=init_epa,
                auto=init_epa * 0.3,
                dc=init_epa * 0.5,
                endgame=init_epa * 0.2,
                total_dist=SkewNormal(mean=init_epa, variance=100.0),
                norm_epa=self.NORM_MEAN - self.INIT_PENALTY * self.NORM_SD,
            )
        return self.team_epas[team_number]

    def _calculate_init_epa(
        self,
        team_number: int,
        prior_epa: Optional[float] = None,
    ) -> float:
        if prior_epa is not None:
            norm_epa = (1 - self.MEAN_REVERSION) * prior_epa + self.MEAN_REVERSION * self.NORM_MEAN
        else:
            norm_epa = self.NORM_MEAN - self.INIT_PENALTY * self.NORM_SD

        avg_team_contribution = self.score_mean / self.ALLIANCE_SIZE
        team_sd = self.score_sd / (self.ALLIANCE_SIZE**0.5)
        z_score = (norm_epa - self.NORM_MEAN) / self.NORM_SD
        return avg_team_contribution + z_score * team_sd

    def predict_match(
        self,
        red_teams: List[int],
        blue_teams: List[int],
    ) -> MatchPrediction:
        red_epas = [self.get_team_epa(t) for t in red_teams]
        blue_epas = [self.get_team_epa(t) for t in blue_teams]

        red_total = sum(e.total for e in red_epas)
        blue_total = sum(e.total for e in blue_epas)
        red_auto = sum(e.auto for e in red_epas)
        blue_auto = sum(e.auto for e in blue_epas)
        red_dc = sum(e.dc for e in red_epas)
        blue_dc = sum(e.dc for e in blue_epas)
        red_endgame = sum(e.endgame for e in red_epas)
        blue_endgame = sum(e.endgame for e in blue_epas)

        win_prob = win_probability(red_total, blue_total, self.score_sd)

        return MatchPrediction(
            red_score=red_total,
            blue_score=blue_total,
            red_win_prob=win_prob,
            red_auto=red_auto,
            red_dc=red_dc,
            red_endgame=red_endgame,
            blue_auto=blue_auto,
            blue_dc=blue_dc,
            blue_endgame=blue_endgame,
        )

    def update_from_match(
        self,
        red_teams: List[int],
        blue_teams: List[int],
        red_score: float,
        blue_score: float,
        red_breakdown: Optional[Dict[str, float]] = None,
        blue_breakdown: Optional[Dict[str, float]] = None,
        is_elim: bool = False,
    ) -> None:
        prediction = self.predict_match(red_teams, blue_teams)

        red_error = red_score - prediction.red_score
        blue_error = blue_score - prediction.blue_score

        red_attribution = red_error / len(red_teams)
        blue_attribution = blue_error / len(blue_teams)

        for team_num in red_teams:
            self._update_team(team_num, red_attribution, red_breakdown, is_elim)

        for team_num in blue_teams:
            self._update_team(team_num, blue_attribution, blue_breakdown, is_elim)

    def _update_team(
        self,
        team_number: int,
        total_attribution: float,
        breakdown: Optional[Dict[str, float]],
        is_elim: bool,
    ) -> None:
        epa = self.get_team_epa(team_number)
        weight = calculate_update_weight(epa.matches_played, is_elim)

        new_total = epa.total + weight * total_attribution
        new_dist = epa.total_dist.update_ewma(new_total, weight)

        if epa.total > 0:
            ratio = new_total / epa.total
        else:
            ratio = 1.0

        new_auto = epa.auto * ratio
        new_dc = epa.dc * ratio
        new_endgame = epa.endgame * ratio

        new_norm = normalize_epa(
            new_total,
            self.score_mean / self.ALLIANCE_SIZE,
            self.score_sd / (self.ALLIANCE_SIZE**0.5),
        )

        epa.total = new_total
        epa.auto = new_auto
        epa.dc = new_dc
        epa.endgame = new_endgame
        epa.total_dist = new_dist
        epa.norm_epa = new_norm
        epa.matches_played += 1

    def get_rankings(self, metric: str = "total") -> List[Tuple[int, float]]:
        rankings = []
        for team_num, epa in self.team_epas.items():
            if metric == "norm_epa":
                value = epa.norm_epa
            elif metric == "auto":
                value = epa.auto
            elif metric == "dc":
                value = epa.dc
            elif metric == "endgame":
                value = epa.endgame
            else:
                value = epa.total
            rankings.append((team_num, value))
        return sorted(rankings, key=lambda x: x[1], reverse=True)

    def calculate_percentiles(self) -> Dict[str, Dict[str, float]]:
        result = {}
        for metric in ["total", "auto", "dc", "endgame", "norm_epa"]:
            values = []
            for epa in self.team_epas.values():
                values.append(getattr(epa, metric) if metric != "norm_epa" else epa.norm_epa)

            if values:
                result[metric] = {
                    "p99": float(np.percentile(values, 99)),
                    "p95": float(np.percentile(values, 95)),
                    "p90": float(np.percentile(values, 90)),
                    "p75": float(np.percentile(values, 75)),
                    "p50": float(np.percentile(values, 50)),
                    "p25": float(np.percentile(values, 25)),
                    "mean": float(np.mean(values)),
                    "sd": float(np.std(values)),
                }
            else:
                result[metric] = {k: 0.0 for k in ["p99", "p95", "p90", "p75", "p50", "p25", "mean", "sd"]}
        return result
