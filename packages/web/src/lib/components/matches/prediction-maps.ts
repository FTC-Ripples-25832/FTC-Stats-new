import {
    Alliance as CommonAlliance,
    DESCRIPTORS,
    TournamentLevel as CommonTournamentLevel,
    calculateEpaRatings,
    calculateTeamEventStats,
    type FrontendMatch,
    type Season,
} from "@ftc-stats/common";
import type { FullMatchFragment } from "$lib/graphql/generated/graphql-operations";

export function hasEntries(map: Record<number, number> | null | undefined): boolean {
    return !!map && Object.keys(map).length > 0;
}

export function getOprValue(
    stats: { opr?: Record<string, number | null | undefined> } | null | undefined,
    season: Season
): number | null {
    if (!stats?.opr) return null;
    const opr = stats.opr;
    if (DESCRIPTORS[season].pensSubtract || !("totalPointsNp" in opr)) {
        return opr.totalPoints ?? null;
    }
    return opr.totalPointsNp ?? opr.totalPoints ?? null;
}

export function toFrontendMatch(match: FullMatchFragment): FrontendMatch | null {
    const teams = match.teams
        .map((t) => {
            const teamNumber = t.teamNumber ?? t.team?.number ?? null;
            if (!teamNumber) return null;
            return {
                matchId: t.matchId ?? match.id,
                teamNumber,
                alliance: t.alliance as unknown as CommonAlliance,
                station: t.station,
                surrogate: !!t.surrogate,
                dq: !!t.dq,
                onField: !!t.onField,
            };
        })
        .filter((t): t is FrontendMatch["teams"][number] => t != null);

    if (!teams.length) return null;

    let scores: FrontendMatch["scores"] = null;
    const s = match.scores;
    if (s && "red" in s) {
        scores = {
            red: {
                ...s.red,
                matchId: match.id,
                alliance: CommonAlliance.Red,
            },
            blue: {
                ...s.blue,
                matchId: match.id,
                alliance: CommonAlliance.Blue,
            },
        };
    } else if (s && "totalPoints" in s) {
        scores = {
            ...s,
            matchId: match.id,
            alliance: CommonAlliance.Solo,
        };
    }

    return {
        tournamentLevel: match.tournamentLevel as unknown as CommonTournamentLevel,
        teams,
        scores,
    };
}

export function buildOprMapFromMatches(
    matches: FullMatchFragment[],
    season: Season,
    eventCode: string,
    isRemote: boolean
): Record<number, number> {
    if (!matches.length) return {};
    const teams = new Set<number>();
    const formatted = matches
        .map((match) => {
            const front = toFrontendMatch(match);
            if (!front) return null;
            front.teams.forEach((t) => teams.add(t.teamNumber));
            return front;
        })
        .filter((m): m is FrontendMatch => m != null);

    if (!formatted.length || !teams.size) return {};

    const stats = calculateTeamEventStats(season, eventCode, isRemote, formatted, [...teams]);
    return stats.reduce((acc, team) => {
        const opr = getOprValue(team as { opr?: Record<string, number | null | undefined> }, season);
        if (opr != null) acc[team.teamNumber] = opr;
        return acc;
    }, {} as Record<number, number>);
}

export function buildEpaMapFromMatches(
    matches: FullMatchFragment[],
    season: Season
): Record<number, number> {
    if (!matches.length) return {};
    return calculateEpaRatings(
        matches.map((m) => ({
            tournamentLevel: m.tournamentLevel as unknown as CommonTournamentLevel,
            scheduledStartTime: m.scheduledStartTime,
            actualStartTime: m.actualStartTime,
            teams: m.teams.map((t) => ({
                teamNumber: t.teamNumber ?? t.team?.number ?? null,
                alliance: t.alliance as unknown as CommonAlliance,
                surrogate: t.surrogate,
            })),
            scores:
                m.scores && "red" in m.scores
                    ? {
                          red: {
                              totalPoints: m.scores.red.totalPoints,
                              totalPointsNp: m.scores.red.totalPointsNp,
                          },
                          blue: {
                              totalPoints: m.scores.blue.totalPoints,
                              totalPointsNp: m.scores.blue.totalPointsNp,
                          },
                      }
                    : null,
        })),
        season
    );
}

export function getAllianceTeamNumbers(match: FullMatchFragment): {
    red: number[];
    blue: number[];
} {
    const red = match.teams
        .filter((t) => t.alliance === CommonAlliance.Red)
        .map((t) => t.teamNumber ?? t.team?.number ?? null)
        .filter((n): n is number => !!n);
    const blue = match.teams
        .filter((t) => t.alliance === CommonAlliance.Blue)
        .map((t) => t.teamNumber ?? t.team?.number ?? null)
        .filter((n): n is number => !!n);
    return { red, blue };
}
