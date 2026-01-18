/**
 * Event Simulation Engine
 *
 * Monte Carlo simulation for FTC event rankings based on team OPR.
 * Simulates remaining matches to predict final rankings and qualification probabilities.
 */

import { predictMatchSimple } from "./match-prediction";

export interface TeamRecord {
    teamNumber: number;
    wins: number;
    losses: number;
    ties: number;
    rankingPoints: number;
    totalPoints: number;
    opr: number;
}

export interface Match {
    id: string;
    redTeam1: number;
    redTeam2: number;
    blueTeam1: number;
    blueTeam2: number;
    played: boolean;
    redScore?: number;
    blueScore?: number;
}

export interface SimulationResult {
    teamNumber: number;
    averageRank: number;
    rankProbabilities: number[]; // Index = rank-1, value = probability
    qualificationProbability: number; // Probability of making top N
    wins: number;
    losses: number;
    ties: number;
}

export interface EventSimulationConfig {
    teams: TeamRecord[];
    matches: Match[];
    numSimulations?: number;
    qualificationCutoff?: number; // Top N teams qualify
    currentSeason?: number;
}

/**
 * Simulate a single match outcome
 */
function simulateMatch(
    match: Match,
    teamOPRs: Map<number, number>
): { redScore: number; blueScore: number; redWins: boolean } {
    const redOPR1 = teamOPRs.get(match.redTeam1) || 0;
    const redOPR2 = teamOPRs.get(match.redTeam2) || 0;
    const blueOPR1 = teamOPRs.get(match.blueTeam1) || 0;
    const blueOPR2 = teamOPRs.get(match.blueTeam2) || 0;

    const prediction = predictMatchSimple(redOPR1, redOPR2, blueOPR1, blueOPR2);

    // Add randomness based on variance
    const variance = 20; // Score variance
    const redNoise = (Math.random() - 0.5) * variance;
    const blueNoise = (Math.random() - 0.5) * variance;

    const redScore = Math.max(0, Math.round(prediction.predictedRedScore + redNoise));
    const blueScore = Math.max(0, Math.round(prediction.predictedBlueScore + blueNoise));

    return {
        redScore,
        blueScore,
        redWins: redScore > blueScore,
    };
}

/**
 * Calculate ranking points for a match (season-specific)
 * This is a simplified version - actual RP calculation varies by season
 */
function calculateRankingPoints(
    _score: number,
    won: boolean,
    tied: boolean,
    _season?: number
): number {
    // Simplified: 2 RP for win, 1 for tie, 0 for loss
    // Real implementation would include bonus RPs based on score thresholds
    if (won) return 2;
    if (tied) return 1;
    return 0;
}

/**
 * Run a single simulation iteration
 */
function runSingleSimulation(
    teams: TeamRecord[],
    matches: Match[],
    teamOPRs: Map<number, number>,
    season?: number
): Map<number, TeamRecord> {
    // Clone team records
    const simTeams = new Map<number, TeamRecord>();
    teams.forEach((team) => {
        simTeams.set(team.teamNumber, { ...team });
    });

    // Simulate unplayed matches
    const unplayedMatches = matches.filter((m) => !m.played);

    for (const match of unplayedMatches) {
        const result = simulateMatch(match, teamOPRs);

        const redTeam1 = simTeams.get(match.redTeam1)!;
        const redTeam2 = simTeams.get(match.redTeam2)!;
        const blueTeam1 = simTeams.get(match.blueTeam1)!;
        const blueTeam2 = simTeams.get(match.blueTeam2)!;

        const tied = result.redScore === result.blueScore;
        const redWon = result.redWins;
        const blueWon = !redWon && !tied;

        // Update records for red alliance
        [redTeam1, redTeam2].forEach((team) => {
            if (redWon) team.wins++;
            else if (tied) team.ties++;
            else team.losses++;

            team.totalPoints += result.redScore;
            team.rankingPoints += calculateRankingPoints(result.redScore, redWon, tied, season);
        });

        // Update records for blue alliance
        [blueTeam1, blueTeam2].forEach((team) => {
            if (blueWon) team.wins++;
            else if (tied) team.ties++;
            else team.losses++;

            team.totalPoints += result.blueScore;
            team.rankingPoints += calculateRankingPoints(result.blueScore, blueWon, tied, season);
        });
    }

    return simTeams;
}

/**
 * Rank teams based on their records
 * Tiebreakers: 1) Ranking Points, 2) Total Points, 3) Random
 */
function rankTeams(teams: TeamRecord[]): TeamRecord[] {
    return [...teams].sort((a, b) => {
        // Primary: Ranking Points (descending)
        if (b.rankingPoints !== a.rankingPoints) {
            return b.rankingPoints - a.rankingPoints;
        }
        // Secondary: Total Points (descending)
        if (b.totalPoints !== a.totalPoints) {
            return b.totalPoints - a.totalPoints;
        }
        // Tertiary: Random (for simulation variety)
        return Math.random() - 0.5;
    });
}

/**
 * Run full event simulation
 */
export function simulateEvent(config: EventSimulationConfig): SimulationResult[] {
    const {
        teams,
        matches,
        numSimulations = 1000,
        qualificationCutoff = 4,
        currentSeason,
    } = config;

    // Build OPR map
    const teamOPRs = new Map<number, number>();
    teams.forEach((team) => {
        teamOPRs.set(team.teamNumber, team.opr);
    });

    // Initialize result tracking
    const results = new Map<number, {
        rankSum: number;
        rankCounts: number[];
        qualifications: number;
        totalWins: number;
        totalLosses: number;
        totalTies: number;
    }>();

    teams.forEach((team) => {
        results.set(team.teamNumber, {
            rankSum: 0,
            rankCounts: new Array(teams.length).fill(0),
            qualifications: 0,
            totalWins: 0,
            totalLosses: 0,
            totalTies: 0,
        });
    });

    // Run simulations
    for (let i = 0; i < numSimulations; i++) {
        const simTeams = runSingleSimulation(teams, matches, teamOPRs, currentSeason);
        const rankedTeams = rankTeams(Array.from(simTeams.values()));

        rankedTeams.forEach((team, rank) => {
            const result = results.get(team.teamNumber)!;
            result.rankSum += rank + 1;
            result.rankCounts[rank]++;
            if (rank < qualificationCutoff) {
                result.qualifications++;
            }
            result.totalWins += team.wins;
            result.totalLosses += team.losses;
            result.totalTies += team.ties;
        });
    }

    // Calculate final results
    const finalResults: SimulationResult[] = [];

    results.forEach((result, teamNumber) => {
        finalResults.push({
            teamNumber,
            averageRank: result.rankSum / numSimulations,
            rankProbabilities: result.rankCounts.map((count) => count / numSimulations),
            qualificationProbability: result.qualifications / numSimulations,
            wins: result.totalWins / numSimulations,
            losses: result.totalLosses / numSimulations,
            ties: result.totalTies / numSimulations,
        });
    });

    // Sort by average rank
    return finalResults.sort((a, b) => a.averageRank - b.averageRank);
}

/**
 * Format rank probability as percentage
 */
export function formatRankProbability(probability: number): string {
    if (probability < 0.01) return "<1%";
    return `${Math.round(probability * 100)}%`;
}
