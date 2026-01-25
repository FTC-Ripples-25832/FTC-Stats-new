/**
 * Event Simulation Engine
 *
 * Monte Carlo simulation for FTC event rankings based on team OPR.
 * Simulates remaining matches to predict final rankings and qualification probabilities.
 */

import { predictMatchSimple } from "./match-prediction";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import { Season } from "../Season";

export interface TeamRecord {
    teamNumber: number;
    wins: number;
    losses: number;
    ties: number;
    rankingPoints: number;
    totalPoints: number;
    opr: number;
    rpBonusRates?: {
        movement: number;
        goal: number;
        pattern: number;
    };
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
    scores?: {
        red?: {
            movementRp?: boolean;
            goalRp?: boolean;
            patternRp?: boolean;
        };
        blue?: {
            movementRp?: boolean;
            goalRp?: boolean;
            patternRp?: boolean;
        };
    };
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

type RpType = "TotalPoints" | "Record" | "DecodeRP";

function getRpType(currentSeason?: number): RpType {
    if (!currentSeason || !(currentSeason in DESCRIPTORS)) return "Record";
    return DESCRIPTORS[currentSeason as Season].rankings.rp;
}

function clampRate(rate: number | undefined): number {
    if (typeof rate !== "number" || Number.isNaN(rate)) return 0;
    if (rate < 0) return 0;
    if (rate > 1) return 1;
    return rate;
}

function getAllianceBonusRate(
    teamNumbers: number[],
    teamRpRates: Map<number, TeamRecord["rpBonusRates"]>,
    key: "movement" | "goal" | "pattern"
): number {
    if (teamNumbers.length === 0) return 0;
    const rates = teamNumbers.map((team) => clampRate(teamRpRates.get(team)?.[key]));
    const total = rates.reduce((sum, value) => sum + value, 0);
    return clampRate(total / rates.length);
}

function rollBonus(rate: number): number {
    return Math.random() < rate ? 1 : 0;
}

/**
 * Simulate a single match outcome
 */
function simulateMatch(
    match: Match,
    teamOPRs: Map<number, number>,
    teamRpRates: Map<number, TeamRecord["rpBonusRates"]>,
    rpType: RpType
): {
    redScore: number;
    blueScore: number;
    redWins: boolean;
    tied: boolean;
    redRp: number;
    blueRp: number;
} {
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

    const redWon = redScore > blueScore;
    const tied = redScore === blueScore;

    let redRp = 0;
    let blueRp = 0;

    if (rpType === "TotalPoints") {
        redRp = redScore;
        blueRp = blueScore;
    } else {
        if (rpType === "DecodeRP") {
            redRp = redWon ? 3 : tied ? 1 : 0;
            blueRp = !redWon && !tied ? 3 : tied ? 1 : 0;

            const redTeams = [match.redTeam1, match.redTeam2].filter((team) => team);
            const blueTeams = [match.blueTeam1, match.blueTeam2].filter((team) => team);

            const redBonus =
                rollBonus(getAllianceBonusRate(redTeams, teamRpRates, "movement")) +
                rollBonus(getAllianceBonusRate(redTeams, teamRpRates, "goal")) +
                rollBonus(getAllianceBonusRate(redTeams, teamRpRates, "pattern"));
            const blueBonus =
                rollBonus(getAllianceBonusRate(blueTeams, teamRpRates, "movement")) +
                rollBonus(getAllianceBonusRate(blueTeams, teamRpRates, "goal")) +
                rollBonus(getAllianceBonusRate(blueTeams, teamRpRates, "pattern"));

            redRp += redBonus;
            blueRp += blueBonus;
        } else {
            redRp = redWon ? 2 : tied ? 1 : 0;
            blueRp = !redWon && !tied ? 2 : tied ? 1 : 0;
        }
    }

    return {
        redScore,
        blueScore,
        redWins: redWon,
        tied,
        redRp,
        blueRp,
    };
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
    const rpType = getRpType(season);
    const teamRpRates = new Map<number, TeamRecord["rpBonusRates"]>();
    teams.forEach((team) => {
        teamRpRates.set(team.teamNumber, team.rpBonusRates);
    });

    // Clone team records
    const simTeams = new Map<number, TeamRecord>();
    teams.forEach((team) => {
        simTeams.set(team.teamNumber, { ...team });
    });

    // Simulate unplayed matches
    const unplayedMatches = matches.filter((m) => !m.played);

    for (const match of unplayedMatches) {
        const result = simulateMatch(match, teamOPRs, teamRpRates, rpType);

        const redTeam1 = simTeams.get(match.redTeam1)!;
        const redTeam2 = simTeams.get(match.redTeam2)!;
        const blueTeam1 = simTeams.get(match.blueTeam1)!;
        const blueTeam2 = simTeams.get(match.blueTeam2)!;

        const tied = result.tied;
        const redWon = result.redWins;
        const blueWon = !redWon && !tied;

        // Update records for red alliance
        [redTeam1, redTeam2].forEach((team) => {
            if (redWon) team.wins++;
            else if (tied) team.ties++;
            else team.losses++;

            team.totalPoints += result.redScore;
            team.rankingPoints += result.redRp;
        });

        // Update records for blue alliance
        [blueTeam1, blueTeam2].forEach((team) => {
            if (blueWon) team.wins++;
            else if (tied) team.ties++;
            else team.losses++;

            team.totalPoints += result.blueScore;
            team.rankingPoints += result.blueRp;
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
