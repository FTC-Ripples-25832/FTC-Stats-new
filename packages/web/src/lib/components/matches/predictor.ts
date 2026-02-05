export type PredictorSuccess = {
    ok: true;
    input: {
        red1: number;
        red2: number;
        blue1: number;
        blue2: number;
        seasonProgress: number;
        penaltyBonus: number;
    };
    stats: Record<
        "red1" | "red2" | "blue1" | "blue2",
        { team: number; oprAuto: number; oprTeleop: number; oprTotal: number }
    >;
    prediction: {
        red: { auto: number; teleop: number; total: number };
        blue: { auto: number; teleop: number; total: number };
        winner: "RED" | "BLUE" | "TIE";
        margin: number;
    };
};

export type PredictorFailure = {
    ok: false;
    error: string;
    message?: string;
    missingTeams?: number[];
    missingFiles?: string[];
};

export type PredictorResponse = PredictorSuccess | PredictorFailure;

const cache = new Map<string, Promise<PredictorResponse>>();

export function buildPredictorKey(
    red1: number,
    red2: number,
    blue1: number,
    blue2: number,
    seasonProgress: number,
    penaltyBonus: number
): string {
    return [red1, red2, blue1, blue2, seasonProgress.toFixed(3), penaltyBonus].join(":");
}

async function fetchPredictor(payload: {
    red1: number;
    red2: number;
    blue1: number;
    blue2: number;
    seasonProgress: number;
    penaltyBonus: number;
}): Promise<PredictorResponse> {
    try {
        const res = await fetch("/api/ftc-match-predictor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = (await res.json()) as PredictorResponse;
        if (!data || typeof (data as PredictorResponse).ok !== "boolean") {
            return { ok: false, error: "invalid_predictor_response" };
        }
        return data;
    } catch (error) {
        return { ok: false, error: "predictor_failed", message: String(error) };
    }
}

export function getPredictorPrediction(payload: {
    red1: number;
    red2: number;
    blue1: number;
    blue2: number;
    seasonProgress: number;
    penaltyBonus: number;
}): Promise<PredictorResponse> {
    const key = buildPredictorKey(
        payload.red1,
        payload.red2,
        payload.blue1,
        payload.blue2,
        payload.seasonProgress,
        payload.penaltyBonus
    );

    const existing = cache.get(key);
    if (existing) return existing;

    const request = fetchPredictor(payload);
    cache.set(key, request);
    return request;
}
