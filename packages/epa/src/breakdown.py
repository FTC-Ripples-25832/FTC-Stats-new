"""FTC season-specific score breakdowns.

Defines how to extract component scores from match score tables.
Column names match the TypeORM SnakeNamingStrategy (snake_case).
"""

from dataclasses import dataclass
from typing import Any, Callable, Dict, Optional


@dataclass
class SeasonBreakdown:
    """Configuration for a single FTC season's scoring breakdown."""

    year: int
    name: str
    # Map: component_key -> (display_name, list of DB column names to sum)
    auto_columns: list[str]
    dc_columns: list[str]
    endgame_columns: list[str]
    total_column: str = "total_points"
    total_np_column: Optional[str] = "total_points_np"
    has_endgame: bool = True
    score_sd: float = 30.0
    score_mean: float = 100.0


BREAKDOWNS: Dict[int, SeasonBreakdown] = {
    2019: SeasonBreakdown(
        year=2019,
        name="Skystone",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=25.0,
        score_mean=70.0,
    ),
    2020: SeasonBreakdown(
        year=2020,
        name="Ultimate Goal",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=25.0,
        score_mean=80.0,
    ),
    2021: SeasonBreakdown(
        year=2021,
        name="Freight Frenzy",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=30.0,
        score_mean=100.0,
    ),
    2022: SeasonBreakdown(
        year=2022,
        name="Power Play",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=35.0,
        score_mean=110.0,
    ),
    2023: SeasonBreakdown(
        year=2023,
        name="CenterStage",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=40.0,
        score_mean=130.0,
    ),
    2024: SeasonBreakdown(
        year=2024,
        name="Into The Deep",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=35.0,
        score_mean=120.0,
    ),
    2025: SeasonBreakdown(
        year=2025,
        name="Decode",
        auto_columns=["auto_points"],
        dc_columns=["dc_points"],
        endgame_columns=["eg_points"],
        score_sd=35.0,
        score_mean=100.0,
    ),
}


def get_breakdown(season: int) -> SeasonBreakdown:
    if season not in BREAKDOWNS:
        raise ValueError(f"Season {season} not supported. Available: {list(BREAKDOWNS.keys())}")
    return BREAKDOWNS[season]
