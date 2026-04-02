import type {
    TeamEpa,
    TeamSeasonEpa,
    TeamMatchEpa,
    EpaMatchPrediction,
    SeasonEpaStats,
} from "@ftc-stats/common";
import { getHttpOrigin } from "$lib/apiOrigin";

const BASE = () => `${getHttpOrigin()}/rest/v1/epa`;

async function get<T>(path: string): Promise<T | null> {
    try {
        let res = await fetch(`${BASE()}${path}`);
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

export async function getTeamEpa(teamNumber: number): Promise<TeamEpa | null> {
    return get<TeamEpa>(`/team/${teamNumber}`);
}

export async function getTeamSeasonEpa(
    teamNumber: number,
    season: number,
): Promise<TeamSeasonEpa | null> {
    return get<TeamSeasonEpa>(`/team/${teamNumber}/season/${season}`);
}

export async function getTeamAllSeasons(teamNumber: number): Promise<TeamSeasonEpa[]> {
    return (await get<TeamSeasonEpa[]>(`/team/${teamNumber}/seasons`)) ?? [];
}

export async function getTeamMatchEpas(
    teamNumber: number,
    season: number,
): Promise<TeamMatchEpa[]> {
    return (await get<TeamMatchEpa[]>(`/team/${teamNumber}/matches/${season}`)) ?? [];
}

export async function getEpaRankings(
    season: number,
    opts?: { limit?: number; offset?: number; country?: string; state?: string },
): Promise<TeamSeasonEpa[]> {
    let params = new URLSearchParams();
    if (opts?.limit != null) params.set("limit", String(opts.limit));
    if (opts?.offset != null) params.set("offset", String(opts.offset));
    if (opts?.country) params.set("country", opts.country);
    if (opts?.state) params.set("state", opts.state);
    let qs = params.toString();
    return (await get<TeamSeasonEpa[]>(`/rankings/${season}${qs ? `?${qs}` : ""}`)) ?? [];
}

export async function getSeasonEpa(year: number): Promise<SeasonEpaStats | null> {
    return get<SeasonEpaStats>(`/season/${year}`);
}

export async function getEventEpa(
    season: number,
    eventCode: string,
): Promise<TeamSeasonEpa[]> {
    return (await get<TeamSeasonEpa[]>(`/event/${season}/${eventCode}`)) ?? [];
}

export async function predictMatch(
    redTeams: number[],
    blueTeams: number[],
    season: number,
): Promise<EpaMatchPrediction | null> {
    try {
        let res = await fetch(`${BASE()}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ red_teams: redTeams, blue_teams: blueTeams, season }),
        });
        if (!res.ok) return null;
        return (await res.json()) as EpaMatchPrediction;
    } catch {
        return null;
    }
}

export async function getEpaHealth(): Promise<{ epa_service: "ok" | "unavailable" } | null> {
    return get<{ epa_service: "ok" | "unavailable" }>("/health");
}
