"""EPA calculation pipeline.

Reads match data from TypeORM-managed tables (read-only) and writes
EPA results to EPA-specific tables.
"""

import math
from typing import Dict, Optional

import numpy as np
from sqlalchemy import text
from sqlalchemy.orm import Session

from .breakdown import get_breakdown
from .config import CURRENT_SEASON, SEASON_NAMES, SEASONS
from .db.models import EpaSeason, EpaTeam, EpaTeamMatch, EpaTeamSeason
from .db.readonly import Event, Match, Team, TeamMatchParticipation
from .models.epa import EPAModel


def get_score_stats(db: Session, season: int) -> tuple[float, float]:
    """Calculate mean and standard deviation of scores for a season.

    Reads from the dynamic match_score_YYYY tables managed by TypeORM.
    """
    table = f"match_score_{season}"

    try:
        result = db.execute(
            text(f"SELECT total_points FROM {table} WHERE total_points IS NOT NULL")
        )
        scores = [row[0] for row in result if row[0] is not None]
    except Exception:
        return 100.0, 30.0

    if not scores:
        breakdown = get_breakdown(season)
        return breakdown.score_mean, breakdown.score_sd

    return float(np.mean(scores)), max(1.0, float(np.std(scores)))


def _get_match_scores(db: Session, season: int, event_code: str, match_id: str) -> dict:
    """Fetch match scores from dynamic match_score_YYYY table."""
    table = f"match_score_{season}"
    try:
        result = db.execute(
            text(
                f"SELECT alliance, total_points, total_points_np, auto_points, dc_points, eg_points "
                f"FROM {table} WHERE season = :season AND event_code = :event_code AND match_id = :match_id"
            ),
            {"season": season, "event_code": event_code, "match_id": match_id},
        )
        scores = {}
        for row in result:
            alliance = row[0]  # "Red" or "Blue"
            scores[alliance] = {
                "total_points": row[1],
                "total_points_np": row[2],
                "auto_points": row[3],
                "dc_points": row[4],
                "eg_points": row[5],
            }
        return scores
    except Exception:
        return {}


def process_season_epa(db: Session, season: int, force: bool = False) -> Dict:
    """Calculate EPA for all teams in a season."""
    print(f"\n{'=' * 60}")
    print(f"Calculating EPA for season {season}: {SEASON_NAMES.get(season, 'Unknown')}")
    print(f"{'=' * 60}")

    score_mean, score_sd = get_score_stats(db, season)
    print(f"Score stats: mean={score_mean:.1f}, sd={score_sd:.1f}")

    model = EPAModel(season=season, score_mean=score_mean, score_sd=score_sd)

    # Get all events ordered by start date
    events = (
        db.query(Event)
        .filter(Event.season == season)
        .order_by(Event.start)
        .all()
    )
    print(f"Processing {len(events)} events...")

    stats = {
        "matches_processed": 0,
        "teams_updated": 0,
        "predictions_correct": 0,
        "predictions_total": 0,
        "score_errors": [],
    }

    for event in events:
        print(f"  Processing event: {event.code}")

        # Get matches for this event
        matches = (
            db.query(Match)
            .filter(
                Match.season == season,
                Match.event_code == event.code,
                Match.has_been_played == True,
            )
            .order_by(Match.tournament_level, Match.match_num)
            .all()
        )

        for match in matches:
            # Get team participation
            tmps = (
                db.query(TeamMatchParticipation)
                .filter(
                    TeamMatchParticipation.season == season,
                    TeamMatchParticipation.event_code == event.code,
                    TeamMatchParticipation.match_id == match.id,
                )
                .all()
            )

            red_teams = [
                t.team_number
                for t in tmps
                if t.alliance and t.alliance.lower() == "red" and not t.surrogate
            ]
            blue_teams = [
                t.team_number
                for t in tmps
                if t.alliance and t.alliance.lower() == "blue" and not t.surrogate
            ]

            if not red_teams or not blue_teams:
                continue

            # Get scores
            scores = _get_match_scores(db, season, event.code, match.id)
            red_scores = scores.get("Red", {})
            blue_scores = scores.get("Blue", {})

            red_total = red_scores.get("total_points")
            blue_total = blue_scores.get("total_points")

            if red_total is None or blue_total is None:
                continue

            # Prediction before update
            prediction = model.predict_match(red_teams, blue_teams)

            # Check prediction accuracy
            actual_winner = "red" if red_total > blue_total else "blue" if blue_total > red_total else "tie"
            if actual_winner != "tie":
                stats["predictions_total"] += 1
                if prediction.predicted_winner == actual_winner:
                    stats["predictions_correct"] += 1

            stats["score_errors"].append(abs(red_total - prediction.red_score))
            stats["score_errors"].append(abs(blue_total - prediction.blue_score))

            # Store pre-match EPA for each team
            for team_num in red_teams + blue_teams:
                team_epa = model.get_team_epa(team_num)
                alliance = "red" if team_num in red_teams else "blue"

                etm = (
                    db.query(EpaTeamMatch)
                    .filter(
                        EpaTeamMatch.team_number == team_num,
                        EpaTeamMatch.season == season,
                        EpaTeamMatch.event_code == event.code,
                        EpaTeamMatch.match_id == match.id,
                    )
                    .first()
                )
                if not etm:
                    etm = EpaTeamMatch(
                        team_number=team_num,
                        season=season,
                        event_code=event.code,
                        match_id=match.id,
                        alliance=alliance,
                    )
                    db.add(etm)
                etm.epa_pre = team_epa.total

            # Build breakdown
            red_breakdown = None
            blue_breakdown = None
            if red_scores.get("auto_points") is not None:
                red_breakdown = {
                    "auto": red_scores.get("auto_points", 0) or 0,
                    "dc": red_scores.get("dc_points", 0) or 0,
                    "endgame": red_scores.get("eg_points", 0) or 0,
                }
            if blue_scores.get("auto_points") is not None:
                blue_breakdown = {
                    "auto": blue_scores.get("auto_points", 0) or 0,
                    "dc": blue_scores.get("dc_points", 0) or 0,
                    "endgame": blue_scores.get("eg_points", 0) or 0,
                }

            is_elim = match.tournament_level not in ("Quals", None, "")

            # Update EPAs
            model.update_from_match(
                red_teams=red_teams,
                blue_teams=blue_teams,
                red_score=red_total,
                blue_score=blue_total,
                red_breakdown=red_breakdown,
                blue_breakdown=blue_breakdown,
                is_elim=is_elim,
            )

            # Store post-match EPA
            for team_num in red_teams + blue_teams:
                team_epa = model.get_team_epa(team_num)
                etm = (
                    db.query(EpaTeamMatch)
                    .filter(
                        EpaTeamMatch.team_number == team_num,
                        EpaTeamMatch.season == season,
                        EpaTeamMatch.event_code == event.code,
                        EpaTeamMatch.match_id == match.id,
                    )
                    .first()
                )
                if etm:
                    etm.epa_post = team_epa.total
                    etm.epa_change = team_epa.total - (etm.epa_pre or 0)
                    etm.won = (actual_winner == etm.alliance)

            stats["matches_processed"] += 1

        db.flush()

    # Update EpaTeamSeason records
    print("\nUpdating team season records...")
    for team_num, team_epa in model.team_epas.items():
        # Fetch team metadata from TypeORM team table
        team = db.query(Team).filter(Team.number == team_num).first()

        ets = (
            db.query(EpaTeamSeason)
            .filter(EpaTeamSeason.team_number == team_num, EpaTeamSeason.season == season)
            .first()
        )
        if not ets:
            ets = EpaTeamSeason(team_number=team_num, season=season)
            db.add(ets)

        ets.epa_total = team_epa.total
        ets.epa_auto = team_epa.auto
        ets.epa_dc = team_epa.dc
        ets.epa_endgame = team_epa.endgame
        ets.epa_end = team_epa.total
        ets.epa_max = team_epa.total
        ets.epa_mean = team_epa.total
        ets.norm_epa = team_epa.norm_epa
        ets.unitless_epa = (team_epa.norm_epa - 1500) / 250
        ets.matches_played = team_epa.matches_played

        conf = team_epa.confidence_interval
        ets.epa_conf_low = conf[0]
        ets.epa_conf_high = conf[1]

        if team:
            ets.name = team.name
            ets.country = team.country
            ets.state = team.state

        stats["teams_updated"] += 1

    # Calculate rankings
    print("Calculating rankings...")
    rankings = model.get_rankings("total")
    for rank, (team_num, _) in enumerate(rankings, 1):
        ets = (
            db.query(EpaTeamSeason)
            .filter(EpaTeamSeason.team_number == team_num, EpaTeamSeason.season == season)
            .first()
        )
        if ets:
            ets.total_epa_rank = rank

    # Country/state rankings
    team_seasons = (
        db.query(EpaTeamSeason)
        .filter(EpaTeamSeason.season == season, EpaTeamSeason.epa_total > 0)
        .order_by(EpaTeamSeason.epa_total.desc())
        .all()
    )

    by_country: dict[str, list] = {}
    by_state: dict[str, list] = {}
    for ets in team_seasons:
        country = ets.country or "Unknown"
        state = ets.state or "Unknown"
        by_country.setdefault(country, []).append(ets)
        by_state.setdefault(state, []).append(ets)

    for group in by_country.values():
        for rank, ets in enumerate(group, 1):
            ets.country_epa_rank = rank
    for group in by_state.values():
        for rank, ets in enumerate(group, 1):
            ets.state_epa_rank = rank

    # Update season statistics
    print("Updating season statistics...")
    epa_season = db.query(EpaSeason).filter(EpaSeason.season == season).first()
    if not epa_season:
        epa_season = EpaSeason(season=season)
        db.add(epa_season)

    epa_season.score_mean = score_mean
    epa_season.score_sd = score_sd

    percentiles = model.calculate_percentiles()
    if "total" in percentiles:
        epa_season.epa_p99 = percentiles["total"]["p99"]
        epa_season.epa_p95 = percentiles["total"]["p95"]
        epa_season.epa_p90 = percentiles["total"]["p90"]
        epa_season.epa_p75 = percentiles["total"]["p75"]
        epa_season.epa_p50 = percentiles["total"]["p50"]
        epa_season.epa_p25 = percentiles["total"]["p25"]

    all_epas = sorted([epa.total for epa in model.team_epas.values()], reverse=True)
    if all_epas:
        epa_season.epa_max = all_epas[0]
        epa_season.epa_top_10 = all_epas[min(9, len(all_epas) - 1)]

    if stats["predictions_total"] > 0:
        epa_season.win_prob_accuracy = stats["predictions_correct"] / stats["predictions_total"]

    if stats["score_errors"]:
        errors = stats["score_errors"]
        epa_season.score_pred_mae = sum(errors) / len(errors)
        epa_season.score_pred_rmse = math.sqrt(sum(e**2 for e in errors) / len(errors))

    # Update career-level team EPA
    print("Updating team career EPA...")
    for team_num, team_epa in model.team_epas.items():
        et = db.query(EpaTeam).filter(EpaTeam.team_number == team_num).first()
        if not et:
            et = EpaTeam(team_number=team_num)
            db.add(et)

        et.norm_epa_current = team_epa.norm_epa

        all_seasons = (
            db.query(EpaTeamSeason)
            .filter(EpaTeamSeason.team_number == team_num, EpaTeamSeason.norm_epa > 0)
            .order_by(EpaTeamSeason.season.desc())
            .all()
        )
        if all_seasons:
            et.norm_epa_recent = sum(s.norm_epa for s in all_seasons[:2]) / min(2, len(all_seasons))
            et.norm_epa_mean = sum(s.norm_epa for s in all_seasons) / len(all_seasons)
            et.norm_epa_max = max(s.norm_epa for s in all_seasons)

    db.commit()

    accuracy = stats["predictions_correct"] / max(1, stats["predictions_total"]) * 100
    print(f"\n{'=' * 60}")
    print(f"EPA calculation complete for season {season}")
    print(f"  Matches processed: {stats['matches_processed']}")
    print(f"  Teams updated: {stats['teams_updated']}")
    print(f"  Prediction accuracy: {accuracy:.1f}%")
    print(f"{'=' * 60}")

    return stats


def process_all_seasons(db: Session, force: bool = False) -> None:
    for season in sorted(SEASONS):
        process_season_epa(db, season, force=force)
