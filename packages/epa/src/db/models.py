"""EPA-specific database models.

These tables are OWNED by the EPA microservice. The EPA service also reads
from the TypeORM-managed tables (team, event, match, match_score_*, tep_*)
but never writes to them.
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, UniqueConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class EpaTeam(Base):
    """Career-level normalized EPA for a team."""

    __tablename__ = "epa_team"

    team_number = Column(Integer, primary_key=True)
    norm_epa_current = Column(Float, default=1500.0)
    norm_epa_recent = Column(Float, default=1500.0)
    norm_epa_mean = Column(Float, default=1500.0)
    norm_epa_max = Column(Float, default=1500.0)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    ties = Column(Integer, default=0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class EpaTeamSeason(Base):
    """EPA per team per season."""

    __tablename__ = "epa_team_season"
    __table_args__ = (
        UniqueConstraint("team_number", "season", name="uq_epa_team_season"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_number = Column(Integer, nullable=False, index=True)
    season = Column(Integer, nullable=False, index=True)

    # EPA values
    epa_total = Column(Float, default=0.0)
    epa_auto = Column(Float, default=0.0)
    epa_dc = Column(Float, default=0.0)
    epa_endgame = Column(Float, default=0.0)

    # EPA stats over season
    epa_start = Column(Float, default=0.0)
    epa_end = Column(Float, default=0.0)
    epa_max = Column(Float, default=0.0)
    epa_mean = Column(Float, default=0.0)

    # Normalized EPA
    norm_epa = Column(Float, default=1500.0)
    unitless_epa = Column(Float, default=0.0)

    # Confidence interval
    epa_conf_low = Column(Float, nullable=True)
    epa_conf_high = Column(Float, nullable=True)

    # Rankings
    total_epa_rank = Column(Integer, nullable=True)
    country_epa_rank = Column(Integer, nullable=True)
    state_epa_rank = Column(Integer, nullable=True)
    region_epa_rank = Column(Integer, nullable=True)

    # Record
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    ties = Column(Integer, default=0)
    matches_played = Column(Integer, default=0)

    # Team metadata (denormalized from TypeORM team table)
    name = Column(String(255), nullable=True)
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)

    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class EpaTeamMatch(Base):
    """Pre/post-match EPA per team per match."""

    __tablename__ = "epa_team_match"
    __table_args__ = (
        UniqueConstraint("team_number", "season", "event_code", "match_id", name="uq_epa_team_match"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_number = Column(Integer, nullable=False, index=True)
    season = Column(Integer, nullable=False, index=True)
    event_code = Column(String(50), nullable=False)
    match_id = Column(String(50), nullable=False)

    alliance = Column(String(10), nullable=False)  # "red" or "blue"
    epa_pre = Column(Float, nullable=True)
    epa_post = Column(Float, nullable=True)
    epa_change = Column(Float, nullable=True)
    won = Column(Boolean, nullable=True)

    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class EpaSeason(Base):
    """Season-level EPA statistics and percentiles."""

    __tablename__ = "epa_season"

    season = Column(Integer, primary_key=True)

    score_mean = Column(Float, default=100.0)
    score_sd = Column(Float, default=30.0)

    # EPA percentiles
    epa_p99 = Column(Float, nullable=True)
    epa_p95 = Column(Float, nullable=True)
    epa_p90 = Column(Float, nullable=True)
    epa_p75 = Column(Float, nullable=True)
    epa_p50 = Column(Float, nullable=True)
    epa_p25 = Column(Float, nullable=True)

    # Top EPA values
    epa_max = Column(Float, nullable=True)
    epa_top_10 = Column(Float, nullable=True)

    # Prediction accuracy
    win_prob_accuracy = Column(Float, nullable=True)
    score_pred_mae = Column(Float, nullable=True)
    score_pred_rmse = Column(Float, nullable=True)

    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
