import { predictMatchFromScores } from "@ftc-stats/common";
import type { FullMatchFragment } from "$lib/graphql/generated/graphql-operations";
import { getAllianceTeamNumbers, hasEntries } from "./prediction-maps";

export const MODEL_PRIORITY = ["XGB", "EPA", "OPR"] as const;
export type PredictionModel = (typeof MODEL_PRIORITY)[number];

export const MODEL_VARIANCE: Record<PredictionModel, number> = {
    XGB: 200,
    EPA: 150,
    OPR: 100,
};

export function getModelNote(
    t: (key: string, fallback?: string) => string,
    model: PredictionModel
): string {
    if (model === "EPA") return t("matches.predicted-scores.note-epa", "Based on event EPA");
    if (model === "OPR") return t("matches.predicted-scores.note-opr", "Based on team OPR");
    return t("matches.predicted-scores.note-xgb", "Based on ftc-match-predictor");
}

export function getPredictionFromMaps(
    match: FullMatchFragment,
    teamEpaMap: Record<number, number> | null | undefined,
    teamOprMap: Record<number, number> | null | undefined
): { model: PredictionModel; redScore: number; blueScore: number } | null {
    const { red, blue } = getAllianceTeamNumbers(match);
    if (red.length < 2 || blue.length < 2) return null;

    if (hasEntries(teamEpaMap)) {
        const redScore = red.reduce((sum, t) => sum + (teamEpaMap?.[t] ?? 0), 0);
        const blueScore = blue.reduce((sum, t) => sum + (teamEpaMap?.[t] ?? 0), 0);
        return { model: "EPA", redScore, blueScore };
    }

    if (hasEntries(teamOprMap)) {
        const redScore = red.reduce((sum, t) => sum + (teamOprMap?.[t] ?? 0), 0);
        const blueScore = blue.reduce((sum, t) => sum + (teamOprMap?.[t] ?? 0), 0);
        return { model: "OPR", redScore, blueScore };
    }

    return null;
}

export function getWinProbabilities(
    redScore: number,
    blueScore: number,
    variance: number
) {
    const prediction = predictMatchFromScores(redScore, blueScore, variance);
    return {
        red: prediction.redWinProbability,
        blue: prediction.blueWinProbability,
        predictedRed: prediction.predictedRedScore,
        predictedBlue: prediction.predictedBlueScore,
    };
}
