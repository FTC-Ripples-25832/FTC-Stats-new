/**
 * Match prediction logic based on OPR (Offensive Power Rating)
 *
 * This module provides functions to predict match outcomes using team OPR values.
 * Predictions are based on the sum of alliance OPRs with statistical modeling.
 */

export interface MatchPrediction {
    redWinProbability: number;
    blueWinProbability: number;
    predictedRedScore: number;
    predictedBlueScore: number;
    confidence: number; // 0-1, higher means more confident
}

export interface AllianceOPR {
    team1: number;
    team2: number;
    opr1: number;
    opr2: number;
}

/**
 * Calculate win probability using a logistic function
 * Based on the score differential and variance
 */
function calculateWinProbability(scoreDiff: number, variance: number): number {
    // Use a logistic function: P(win) = 1 / (1 + e^(-k * diff / sqrt(variance)))
    // k is a scaling factor (higher k = more confident predictions)
    const k = 0.05;
    const normalizedDiff = scoreDiff / Math.sqrt(Math.max(variance, 1));
    return 1 / (1 + Math.exp(-k * normalizedDiff));
}

/**
 * Predict match outcome from precomputed alliance scores.
 */
export function predictMatchFromScores(
    predictedRedScore: number,
    predictedBlueScore: number,
    variance: number = 100
): MatchPrediction {
    const scoreDiff = predictedRedScore - predictedBlueScore;
    const redWinProb = calculateWinProbability(scoreDiff, variance);
    const blueWinProb = 1 - redWinProb;
    const confidence = Math.min(Math.abs(scoreDiff) / 50, 1);

    return {
        redWinProbability: redWinProb,
        blueWinProbability: blueWinProb,
        predictedRedScore: Math.max(0, predictedRedScore),
        predictedBlueScore: Math.max(0, predictedBlueScore),
        confidence,
    };
}

/**
 * Predict match outcome based on alliance OPRs
 *
 * @param redAlliance - Red alliance team OPRs
 * @param blueAlliance - Blue alliance team OPRs
 * @param oprVariance - Optional variance in OPR calculations (default: 100)
 * @returns Match prediction with win probabilities and predicted scores
 */
export function predictMatch(
    redAlliance: AllianceOPR,
    blueAlliance: AllianceOPR,
    oprVariance: number = 100
): MatchPrediction {
    // Calculate predicted scores as sum of alliance OPRs
    const predictedRedScore = redAlliance.opr1 + redAlliance.opr2;
    const predictedBlueScore = blueAlliance.opr1 + blueAlliance.opr2;

    // Calculate score differential
    const scoreDiff = predictedRedScore - predictedBlueScore;

    // Calculate win probability
    const redWinProb = calculateWinProbability(scoreDiff, oprVariance);
    const blueWinProb = 1 - redWinProb;

    // Calculate confidence based on score differential
    // Higher differential = higher confidence
    const confidence = Math.min(Math.abs(scoreDiff) / 50, 1);

    return {
        redWinProbability: redWinProb,
        blueWinProbability: blueWinProb,
        predictedRedScore: Math.max(0, predictedRedScore),
        predictedBlueScore: Math.max(0, predictedBlueScore),
        confidence
    };
}

/**
 * Predict match outcome using simple OPR values
 * Convenience function when you just have OPR numbers
 */
export function predictMatchSimple(
    redOPR1: number,
    redOPR2: number,
    blueOPR1: number,
    blueOPR2: number,
    oprVariance?: number
): MatchPrediction {
    return predictMatch(
        { team1: 0, team2: 0, opr1: redOPR1, opr2: redOPR2 },
        { team1: 0, team2: 0, opr1: blueOPR1, opr2: blueOPR2 },
        oprVariance
    );
}

/**
 * Format win probability as a percentage string
 */
export function formatWinProbability(probability: number): string {
    return `${(probability * 100).toFixed(1)}%`;
}

/**
 * Get a color class based on win probability
 * Useful for UI styling
 */
export function getWinProbabilityColor(probability: number): 'high' | 'medium' | 'low' {
    if (probability >= 0.65) return 'high';
    if (probability >= 0.45) return 'medium';
    return 'low';
}
