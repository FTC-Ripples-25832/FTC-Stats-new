import { Alliance, type FullMatchFragment } from "$lib/graphql/generated/graphql-operations";
import { DESCRIPTORS, type Season } from "@ftc-stats/common";

export type MatchResult = "win" | "loss" | "tie";

export function getTeamAlliance(
    match: FullMatchFragment,
    teamNumber: number
): Alliance | null {
    const entry = match.teams.find(
        (t) => (t.teamNumber ?? t.team?.number) === teamNumber
    );
    return entry?.alliance ?? null;
}

export function getAllianceScores(match: FullMatchFragment): {
    red?: number;
    blue?: number;
    solo?: number;
} {
    const scores = match.scores;
    if (!scores) return {};
    if ("red" in scores) {
        return {
            red: scores.red.totalPoints,
            blue: scores.blue.totalPoints,
        };
    }
    if ("totalPoints" in scores) {
        return { solo: scores.totalPoints };
    }
    return {};
}

export function getMatchResult(
    match: FullMatchFragment,
    teamNumber: number
): MatchResult | null {
    const alliance = getTeamAlliance(match, teamNumber);
    const scores = getAllianceScores(match);
    if (!alliance || !scores) return null;

    if (alliance === Alliance.Solo && scores.solo != null) {
        return "win";
    }

    if (scores.red == null || scores.blue == null) return null;
    if (scores.red === scores.blue) return "tie";

    const redWon = scores.red > scores.blue;
    if (alliance === Alliance.Red) return redWon ? "win" : "loss";
    if (alliance === Alliance.Blue) return redWon ? "loss" : "win";
    return null;
}

export function getAllianceScoreForTeam(
    match: FullMatchFragment,
    teamNumber: number
): number | null {
    const alliance = getTeamAlliance(match, teamNumber);
    const scores = getAllianceScores(match);
    if (!alliance || !scores) return null;
    if (alliance === Alliance.Red) return scores.red ?? null;
    if (alliance === Alliance.Blue) return scores.blue ?? null;
    if (alliance === Alliance.Solo) return scores.solo ?? null;
    return null;
}

export function getOpponentScoreForTeam(
    match: FullMatchFragment,
    teamNumber: number
): number | null {
    const alliance = getTeamAlliance(match, teamNumber);
    const scores = getAllianceScores(match);
    if (!alliance || !scores) return null;
    if (alliance === Alliance.Red) return scores.blue ?? null;
    if (alliance === Alliance.Blue) return scores.red ?? null;
    return null;
}

export function getMatchMarginForTeam(
    match: FullMatchFragment,
    teamNumber: number
): number | null {
    const teamScore = getAllianceScoreForTeam(match, teamNumber);
    const oppScore = getOpponentScoreForTeam(match, teamNumber);
    if (teamScore == null || oppScore == null) return null;
    return teamScore - oppScore;
}

export function getSeasonProgressForMatch(match: FullMatchFragment): number {
    const descriptor = DESCRIPTORS[match.season as Season];
    const start = descriptor.firstDate?.getTime?.() ?? 0;
    const end = descriptor.lastDate?.getTime?.() ?? 0;
    const rawTime = match.actualStartTime ?? match.scheduledStartTime ?? null;
    if (!rawTime) return 1.0;
    const matchTime = Date.parse(rawTime);
    if (!Number.isFinite(matchTime) || !Number.isFinite(start) || !Number.isFinite(end)) {
        return 1.0;
    }
    const span = Math.max(1, end - start);
    const progress = (matchTime - start) / span;
    return Math.min(1, Math.max(0.1, progress));
}

