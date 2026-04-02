"""FastAPI application for EPA microservice."""

from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .calculate import process_all_seasons, process_season_epa
from .config import CURRENT_SEASON, SEASONS
from .db import init_db
from .db.models import EpaSeason, EpaTeam, EpaTeamMatch, EpaTeamSeason
from .db.session import get_db
from .models.epa import EPAModel

app = FastAPI(title="FTCStats EPA Service", version="0.1.0")


@app.on_event("startup")
def startup():
    init_db()


# --- Response Models ---


class TeamEpaResponse(BaseModel):
    team_number: int
    norm_epa_current: Optional[float] = None
    norm_epa_recent: Optional[float] = None
    norm_epa_mean: Optional[float] = None
    norm_epa_max: Optional[float] = None

    class Config:
        from_attributes = True


class TeamSeasonEpaResponse(BaseModel):
    team_number: int
    season: int
    epa_total: Optional[float] = None
    epa_auto: Optional[float] = None
    epa_dc: Optional[float] = None
    epa_endgame: Optional[float] = None
    norm_epa: Optional[float] = None
    unitless_epa: Optional[float] = None
    epa_conf_low: Optional[float] = None
    epa_conf_high: Optional[float] = None
    total_epa_rank: Optional[int] = None
    country_epa_rank: Optional[int] = None
    state_epa_rank: Optional[int] = None
    matches_played: Optional[int] = None
    name: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None

    class Config:
        from_attributes = True


class TeamMatchEpaResponse(BaseModel):
    team_number: int
    season: int
    event_code: str
    match_id: str
    alliance: str
    epa_pre: Optional[float] = None
    epa_post: Optional[float] = None
    epa_change: Optional[float] = None
    won: Optional[bool] = None

    class Config:
        from_attributes = True


class SeasonEpaResponse(BaseModel):
    season: int
    score_mean: Optional[float] = None
    score_sd: Optional[float] = None
    epa_p99: Optional[float] = None
    epa_p95: Optional[float] = None
    epa_p90: Optional[float] = None
    epa_p75: Optional[float] = None
    epa_p50: Optional[float] = None
    epa_p25: Optional[float] = None
    epa_max: Optional[float] = None
    epa_top_10: Optional[float] = None
    win_prob_accuracy: Optional[float] = None
    score_pred_mae: Optional[float] = None
    score_pred_rmse: Optional[float] = None

    class Config:
        from_attributes = True


class PredictRequest(BaseModel):
    red_teams: List[int]
    blue_teams: List[int]
    season: int = CURRENT_SEASON


class PredictResponse(BaseModel):
    red_score: float
    blue_score: float
    red_win_prob: float
    blue_win_prob: float
    predicted_winner: str
    red_auto: float
    red_dc: float
    red_endgame: float
    blue_auto: float
    blue_dc: float
    blue_endgame: float


class CalculateResponse(BaseModel):
    matches_processed: int
    teams_updated: int
    prediction_accuracy: float


# --- Endpoints ---


@app.get("/epa/health")
def health():
    return {"status": "ok", "service": "epa"}


@app.get("/epa/team/{number}", response_model=TeamEpaResponse)
def get_team_epa(number: int, db: Session = Depends(get_db)):
    team = db.query(EpaTeam).filter(EpaTeam.team_number == number).first()
    if not team:
        raise HTTPException(404, f"No EPA data for team {number}")
    return team


@app.get("/epa/team/{number}/season/{season}", response_model=TeamSeasonEpaResponse)
def get_team_season_epa(number: int, season: int, db: Session = Depends(get_db)):
    ets = (
        db.query(EpaTeamSeason)
        .filter(EpaTeamSeason.team_number == number, EpaTeamSeason.season == season)
        .first()
    )
    if not ets:
        raise HTTPException(404, f"No EPA data for team {number} season {season}")
    return ets


@app.get("/epa/team/{number}/seasons", response_model=List[TeamSeasonEpaResponse])
def get_team_all_seasons(number: int, db: Session = Depends(get_db)):
    results = (
        db.query(EpaTeamSeason)
        .filter(EpaTeamSeason.team_number == number)
        .order_by(EpaTeamSeason.season.desc())
        .all()
    )
    return results


@app.get("/epa/team/{number}/matches/{season}", response_model=List[TeamMatchEpaResponse])
def get_team_match_epas(number: int, season: int, db: Session = Depends(get_db)):
    results = (
        db.query(EpaTeamMatch)
        .filter(EpaTeamMatch.team_number == number, EpaTeamMatch.season == season)
        .order_by(EpaTeamMatch.id)
        .all()
    )
    return results


@app.get("/epa/rankings/{season}", response_model=List[TeamSeasonEpaResponse])
def get_epa_rankings(
    season: int,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    country: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = (
        db.query(EpaTeamSeason)
        .filter(EpaTeamSeason.season == season, EpaTeamSeason.epa_total > 0)
    )
    if country:
        q = q.filter(EpaTeamSeason.country == country)
    if state:
        q = q.filter(EpaTeamSeason.state == state)

    results = q.order_by(EpaTeamSeason.epa_total.desc()).offset(offset).limit(limit).all()
    return results


@app.get("/epa/season/{year}", response_model=SeasonEpaResponse)
def get_season_epa(year: int, db: Session = Depends(get_db)):
    season = db.query(EpaSeason).filter(EpaSeason.season == year).first()
    if not season:
        raise HTTPException(404, f"No EPA data for season {year}")
    return season


@app.get("/epa/event/{season}/{code}")
def get_event_epa(season: int, code: str, db: Session = Depends(get_db)):
    """Get EPA data for all teams at an event."""
    results = (
        db.query(EpaTeamMatch)
        .filter(EpaTeamMatch.season == season, EpaTeamMatch.event_code == code)
        .all()
    )

    # Group by team, return latest EPA
    team_epas = {}
    for etm in results:
        if etm.team_number not in team_epas or (etm.epa_post or 0) > (team_epas[etm.team_number].get("epa_post") or 0):
            team_epas[etm.team_number] = {
                "team_number": etm.team_number,
                "epa_post": etm.epa_post,
                "matches": 0,
            }
        team_epas[etm.team_number]["matches"] = team_epas[etm.team_number].get("matches", 0) + 1

    return list(team_epas.values())


@app.post("/epa/predict", response_model=PredictResponse)
def predict_match(req: PredictRequest, db: Session = Depends(get_db)):
    """Predict match outcome based on current EPA."""
    season_data = db.query(EpaSeason).filter(EpaSeason.season == req.season).first()
    score_mean = season_data.score_mean if season_data else 100.0
    score_sd = season_data.score_sd if season_data else 30.0

    model = EPAModel(season=req.season, score_mean=score_mean, score_sd=score_sd)

    # Load team EPAs from DB
    for team_num in req.red_teams + req.blue_teams:
        ets = (
            db.query(EpaTeamSeason)
            .filter(EpaTeamSeason.team_number == team_num, EpaTeamSeason.season == req.season)
            .first()
        )
        if ets and ets.epa_total:
            epa = model.get_team_epa(team_num)
            epa.total = ets.epa_total
            epa.auto = ets.epa_auto or 0
            epa.dc = ets.epa_dc or 0
            epa.endgame = ets.epa_endgame or 0
            epa.norm_epa = ets.norm_epa or 1500

    pred = model.predict_match(req.red_teams, req.blue_teams)

    return PredictResponse(
        red_score=pred.red_score,
        blue_score=pred.blue_score,
        red_win_prob=pred.red_win_prob,
        blue_win_prob=pred.blue_win_prob,
        predicted_winner=pred.predicted_winner,
        red_auto=pred.red_auto,
        red_dc=pred.red_dc,
        red_endgame=pred.red_endgame,
        blue_auto=pred.blue_auto,
        blue_dc=pred.blue_dc,
        blue_endgame=pred.blue_endgame,
    )


@app.post("/epa/calculate/{season}", response_model=CalculateResponse)
def calculate_season(season: int, force: bool = False, db: Session = Depends(get_db)):
    """Trigger EPA calculation for a season."""
    if season not in SEASONS:
        raise HTTPException(400, f"Invalid season {season}")

    stats = process_season_epa(db, season, force=force)
    accuracy = stats["predictions_correct"] / max(1, stats["predictions_total"]) * 100

    return CalculateResponse(
        matches_processed=stats["matches_processed"],
        teams_updated=stats["teams_updated"],
        prediction_accuracy=accuracy,
    )


@app.post("/epa/calculate-all", response_model=dict)
def calculate_all(force: bool = False, db: Session = Depends(get_db)):
    """Recalculate EPA for all seasons."""
    process_all_seasons(db, force=force)
    return {"status": "complete"}
