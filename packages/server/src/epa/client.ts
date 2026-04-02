/**
 * HTTP client for the EPA Python microservice.
 *
 * Provides typed wrappers around the EPA service REST API.
 * Gracefully returns null when the service is unreachable.
 */

import type {
    EpaMatchPrediction,
    SeasonEpaStats,
    TeamEpa,
    TeamMatchEpa,
    TeamSeasonEpa,
} from "@ftc-stats/common";
import { EPA_SERVICE_URL } from "./constants";

async function epaFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
    try {
        const res = await fetch(`${EPA_SERVICE_URL}${path}`, {
            ...options,
            headers: { "Content-Type": "application/json", ...options?.headers },
            signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        // EPA service is down — degrade gracefully
        return null;
    }
}

export async function getTeamEpa(teamNumber: number): Promise<TeamEpa | null> {
    return epaFetch(`/epa/team/${teamNumber}`);
}

export async function getTeamSeasonEpa(
    teamNumber: number,
    season: number
): Promise<TeamSeasonEpa | null> {
    return epaFetch(`/epa/team/${teamNumber}/season/${season}`);
}

export async function getTeamAllSeasons(teamNumber: number): Promise<TeamSeasonEpa[] | null> {
    return epaFetch(`/epa/team/${teamNumber}/seasons`);
}

export async function getTeamMatchEpas(
    teamNumber: number,
    season: number
): Promise<TeamMatchEpa[] | null> {
    return epaFetch(`/epa/team/${teamNumber}/matches/${season}`);
}

export async function getEpaRankings(
    season: number,
    options?: { limit?: number; offset?: number; country?: string; state?: string }
): Promise<TeamSeasonEpa[] | null> {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", String(options.limit));
    if (options?.offset) params.set("offset", String(options.offset));
    if (options?.country) params.set("country", options.country);
    if (options?.state) params.set("state", options.state);
    const qs = params.toString();
    return epaFetch(`/epa/rankings/${season}${qs ? `?${qs}` : ""}`);
}

export async function getSeasonEpa(season: number): Promise<SeasonEpaStats | null> {
    return epaFetch(`/epa/season/${season}`);
}

export async function getEventEpa(
    season: number,
    code: string
): Promise<Array<{ team_number: number; epa_post: number | null; matches: number }> | null> {
    return epaFetch(`/epa/event/${season}/${code}`);
}

export async function predictMatch(
    redTeams: number[],
    blueTeams: number[],
    season: number
): Promise<EpaMatchPrediction | null> {
    return epaFetch("/epa/predict", {
        method: "POST",
        body: JSON.stringify({
            red_teams: redTeams,
            blue_teams: blueTeams,
            season,
        }),
    });
}

export async function triggerCalculation(season: number): Promise<boolean> {
    const result = await epaFetch(`/epa/calculate/${season}`, { method: "POST" });
    return result !== null;
}

export async function isEpaServiceHealthy(): Promise<boolean> {
    const result = await epaFetch<{ status: string }>("/epa/health");
    return result?.status === "ok";
}
