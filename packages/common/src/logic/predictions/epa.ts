import { Alliance } from "../Alliance";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import { Season } from "../Season";
import { TournamentLevel } from "../TournamentLevel";

export type EpaMatch = {
    tournamentLevel: TournamentLevel;
    scheduledStartTime?: string | null;
    actualStartTime?: string | null;
    teams: {
        teamNumber: number | null;
        alliance: Alliance;
        surrogate?: boolean | null;
    }[];
    scores:
        | {
              red: { totalPoints: number; totalPointsNp?: number | null };
              blue: { totalPoints: number; totalPointsNp?: number | null };
          }
        | null
        | undefined;
};

export type EpaOptions = {
    baseK?: number;
    includeElims?: boolean;
};

function getTimestamp(match: EpaMatch): number {
    const raw = match.actualStartTime ?? match.scheduledStartTime;
    if (!raw) return 0;
    const time = Date.parse(raw);
    return Number.isFinite(time) ? time : 0;
}

function getScore(season: Season, score: { totalPoints: number; totalPointsNp?: number | null }) {
    const descriptor = DESCRIPTORS[season];
    if (!descriptor.pensSubtract && typeof score.totalPointsNp === "number") {
        return score.totalPointsNp;
    }
    return score.totalPoints;
}

export function calculateEpaRatings(
    matches: EpaMatch[],
    season: Season,
    options: EpaOptions = {}
): Record<number, number> {
    const baseK = options.baseK ?? 0.25;
    const includeElims = options.includeElims ?? false;

    const ratings = new Map<number, number>();
    const counts = new Map<number, number>();

    const sorted = [...matches].sort((a, b) => getTimestamp(a) - getTimestamp(b));

    for (const match of sorted) {
        if (!match.scores || !("red" in match.scores)) continue;
        if (!includeElims && match.tournamentLevel !== TournamentLevel.Quals) continue;

        const redTeams = match.teams
            .filter((t) => t.alliance === Alliance.Red && !t.surrogate)
            .map((t) => t.teamNumber)
            .filter((t): t is number => typeof t === "number");
        const blueTeams = match.teams
            .filter((t) => t.alliance === Alliance.Blue && !t.surrogate)
            .map((t) => t.teamNumber)
            .filter((t): t is number => typeof t === "number");

        if (!redTeams.length || !blueTeams.length) continue;

        const redScore = getScore(season, match.scores.red);
        const blueScore = getScore(season, match.scores.blue);

        const redPred = redTeams.reduce((sum, team) => sum + (ratings.get(team) ?? 0), 0);
        const bluePred = blueTeams.reduce((sum, team) => sum + (ratings.get(team) ?? 0), 0);

        const redError = redScore - redPred;
        const blueError = blueScore - bluePred;

        for (const team of redTeams) {
            const count = counts.get(team) ?? 0;
            const k = baseK / Math.sqrt(count + 1);
            const next = (ratings.get(team) ?? 0) + (k * redError) / redTeams.length;
            ratings.set(team, next);
            counts.set(team, count + 1);
        }

        for (const team of blueTeams) {
            const count = counts.get(team) ?? 0;
            const k = baseK / Math.sqrt(count + 1);
            const next = (ratings.get(team) ?? 0) + (k * blueError) / blueTeams.length;
            ratings.set(team, next);
            counts.set(team, count + 1);
        }
    }

    return Object.fromEntries(ratings.entries());
}
