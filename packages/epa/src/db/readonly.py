"""Read-only models for TypeORM-managed tables.

These models allow the EPA service to READ data from the existing
FTC-Stats database tables without ever writing to them. The table
names and column names match the SnakeNamingStrategy used by TypeORM.
"""

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import declarative_base

ReadBase = declarative_base()


class Team(ReadBase):
    """Read-only: team table (managed by TypeORM)."""

    __tablename__ = "team"

    number = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
    school_name = Column(String, nullable=True)
    country = Column(String, nullable=True)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    rookie_year = Column(Integer, nullable=True)


class Event(ReadBase):
    """Read-only: event table (managed by TypeORM)."""

    __tablename__ = "event"

    season = Column(Integer, primary_key=True)
    code = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    type = Column(String, nullable=True)
    region_code = Column(String, nullable=True)
    start = Column(String, nullable=True)
    end = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    remote = Column(Boolean, default=False)


class Match(ReadBase):
    """Read-only: match table (managed by TypeORM)."""

    __tablename__ = "match"

    season = Column("event_season", Integer, primary_key=True)
    event_code = Column(String, primary_key=True)
    id = Column(Integer, primary_key=True)
    tournament_level = Column(String, nullable=True)
    series = Column(Integer, nullable=True)
    has_been_played = Column(Boolean, default=False)
    scheduled_start_time = Column(DateTime, nullable=True)
    actual_start_time = Column(DateTime, nullable=True)

    @property
    def match_num(self) -> int:
        return self.id % 1000


class TeamMatchParticipation(ReadBase):
    """Read-only: team_match_participation table."""

    __tablename__ = "team_match_participation"

    season = Column(Integer, primary_key=True)
    event_code = Column(String, primary_key=True)
    match_id = Column(String, primary_key=True)
    team_number = Column(Integer, primary_key=True)
    alliance = Column(String, nullable=True)  # "Red" or "Blue"
    station = Column(String, nullable=True)
    surrogate = Column(Boolean, default=False)
    dq = Column(Boolean, default=False)
    on_field = Column(Boolean, default=True)
    no_show = Column(Boolean, default=False)
