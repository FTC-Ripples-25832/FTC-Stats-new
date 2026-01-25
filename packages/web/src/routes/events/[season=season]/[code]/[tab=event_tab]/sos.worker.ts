import { DESCRIPTORS, predictMatchSimple, type Season } from "@ftc-stats/common";

type SosTeamInput = {
    teamNumber: number;
    opr: number;
    rpBonusRates?: {
        movement: number;
        goal: number;
        pattern: number;
    };
};

type SosScheduleMatch = {
    red: number[];
    blue: number[];
};

type SosConfig = {
    teams: SosTeamInput[];
    schedule: SosScheduleMatch[];
    season: Season;
    simCount: number;
};

type SosMetrics = {
    matchCount: number;
    avgPartnerOpr: number | null;
    avgOpponentOpr: number | null;
    deltaOpr: number | null;
    oprPercentile: number | null;
    preSimAvgRank: number;
    simAvgRank: number;
    deltaRank: number;
    rankPercentile: number;
    preSimAvgRp: number;
    simAvgRp: number;
    deltaRp: number;
    rpPercentile: number;
    overallPercentile: number | null;
};

type SosMessage =
    | { type: "run"; config: SosConfig }
    | { type: "result"; metrics: Record<number, SosMetrics> }
    | { type: "error"; message: string };

type RpType = "TotalPoints" | "Record" | "DecodeRP";

const ctx: Worker = self as unknown as Worker;
const SCORE_VARIANCE = 20;

function getRpType(season: Season): RpType {
    return DESCRIPTORS[season]?.rankings.rp ?? "Record";
}

function clampRate(rate: number | undefined): number {
    if (typeof rate !== "number" || Number.isNaN(rate)) return 0;
    if (rate < 0) return 0;
    if (rate > 1) return 1;
    return rate;
}

function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function erf(x: number): number {
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * absX);
    const y =
        1 -
        (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
            Math.exp(-absX * absX);
    return sign * y;
}

function normalCdf(x: number, mean: number, sd: number): number {
    if (sd <= 0) return x < mean ? 0 : 1;
    const z = (x - mean) / (sd * Math.sqrt(2));
    return 0.5 * (1 + erf(z));
}

function getAllianceBonusRate(
    teamNumbers: number[],
    teamRpRates: Map<number, SosTeamInput["rpBonusRates"]>,
    key: "movement" | "goal" | "pattern"
): number {
    if (teamNumbers.length === 0) return 0;
    const total = teamNumbers.reduce((sum, team) => {
        const rate = teamRpRates.get(team)?.[key];
        return sum + clampRate(rate);
    }, 0);
    return clampRate(total / teamNumbers.length);
}

function rollBonus(rate: number): number {
    return Math.random() < rate ? 1 : 0;
}

function simulateMatch(
    redTeams: number[],
    blueTeams: number[],
    teamOprs: Map<number, number>,
    teamRpRates: Map<number, SosTeamInput["rpBonusRates"]>,
    rpType: RpType
): { redRp: number; blueRp: number } {
    const redOpr1 = teamOprs.get(redTeams[0]) || 0;
    const redOpr2 = teamOprs.get(redTeams[1]) || 0;
    const blueOpr1 = teamOprs.get(blueTeams[0]) || 0;
    const blueOpr2 = teamOprs.get(blueTeams[1]) || 0;

    const prediction = predictMatchSimple(redOpr1, redOpr2, blueOpr1, blueOpr2);

    const redScore = Math.max(
        0,
        Math.round(prediction.predictedRedScore + (Math.random() - 0.5) * SCORE_VARIANCE)
    );
    const blueScore = Math.max(
        0,
        Math.round(prediction.predictedBlueScore + (Math.random() - 0.5) * SCORE_VARIANCE)
    );

    const tied = redScore === blueScore;
    const redWon = redScore > blueScore;

    if (rpType === "TotalPoints") {
        return { redRp: redScore, blueRp: blueScore };
    }

    let redRp = 0;
    let blueRp = 0;
    if (rpType === "DecodeRP") {
        redRp = redWon ? 3 : tied ? 1 : 0;
        blueRp = !redWon && !tied ? 3 : tied ? 1 : 0;

        const redBonus =
            rollBonus(getAllianceBonusRate(redTeams, teamRpRates, "movement")) +
            rollBonus(getAllianceBonusRate(redTeams, teamRpRates, "goal")) +
            rollBonus(getAllianceBonusRate(redTeams, teamRpRates, "pattern"));
        const blueBonus =
            rollBonus(getAllianceBonusRate(blueTeams, teamRpRates, "movement")) +
            rollBonus(getAllianceBonusRate(blueTeams, teamRpRates, "goal")) +
            rollBonus(getAllianceBonusRate(blueTeams, teamRpRates, "pattern"));

        return { redRp: redRp + redBonus, blueRp: blueRp + blueBonus };
    }

    redRp = redWon ? 2 : tied ? 1 : 0;
    blueRp = !redWon && !tied ? 2 : tied ? 1 : 0;
    return { redRp, blueRp };
}

function buildScheduleIndices(teamCount: number, matchesPerTeam: number): number[][] {
    const slots: number[] = [];
    for (let i = 0; i < teamCount; i++) {
        for (let j = 0; j < matchesPerTeam; j++) {
            slots.push(i);
        }
    }

    shuffle(slots);

    const matches: number[][] = [];
    for (let i = 0; i + 3 < slots.length; i += 4) {
        const group = slots.slice(i, i + 4);
        if (new Set(group).size < 4) {
            for (let j = i + 4; j < slots.length && new Set(group).size < 4; j++) {
                for (let k = 0; k < group.length; k++) {
                    if (group.indexOf(group[k]) !== k && !group.includes(slots[j])) {
                        [group[k], slots[j]] = [slots[j], group[k]];
                    }
                }
            }
        }
        matches.push(group);
    }

    return matches;
}

function simulateSchedule(
    schedule: SosScheduleMatch[],
    teamNumbers: number[],
    teamOprs: Map<number, number>,
    teamRpRates: Map<number, SosTeamInput["rpBonusRates"]>,
    rpType: RpType,
    simCount: number
): { simRanks: Record<number, number[]>; simRps: Record<number, number[]> } {
    const simRanks: Record<number, number[]> = {};
    const simRps: Record<number, number[]> = {};

    for (const team of teamNumbers) {
        simRanks[team] = [];
        simRps[team] = [];
    }

    for (let i = 0; i < simCount; i++) {
        const rpTotals: Record<number, number> = {};
        for (const team of teamNumbers) {
            rpTotals[team] = 0;
        }

        for (const match of schedule) {
            const { redRp, blueRp } = simulateMatch(
                match.red,
                match.blue,
                teamOprs,
                teamRpRates,
                rpType
            );
            for (const team of match.red) {
                rpTotals[team] += redRp;
            }
            for (const team of match.blue) {
                rpTotals[team] += blueRp;
            }
        }

        const rankedTeams = [...teamNumbers].sort((a, b) => {
            if (rpTotals[b] !== rpTotals[a]) return rpTotals[b] - rpTotals[a];
            return Math.random() - 0.5;
        });

        rankedTeams.forEach((team, rank) => {
            simRanks[team].push(rank + 1);
            simRps[team].push(rpTotals[team]);
        });
    }

    return { simRanks, simRps };
}

function simulateRandomSchedule(
    scheduleIndices: number[][],
    teamNumbers: number[],
    teamOprs: Map<number, number>,
    teamRpRates: Map<number, SosTeamInput["rpBonusRates"]>,
    rpType: RpType,
    simCount: number
): { simRanks: Record<number, number[]>; simRps: Record<number, number[]> } {
    const simRanks: Record<number, number[]> = {};
    const simRps: Record<number, number[]> = {};

    for (const team of teamNumbers) {
        simRanks[team] = [];
        simRps[team] = [];
    }

    for (let i = 0; i < simCount; i++) {
        const mapping = shuffle([...teamNumbers]);
        const rpTotals: Record<number, number> = {};
        for (const team of teamNumbers) {
            rpTotals[team] = 0;
        }

        for (const matchIndices of scheduleIndices) {
            const redTeams = [mapping[matchIndices[0]], mapping[matchIndices[1]]];
            const blueTeams = [mapping[matchIndices[2]], mapping[matchIndices[3]]];
            const { redRp, blueRp } = simulateMatch(
                redTeams,
                blueTeams,
                teamOprs,
                teamRpRates,
                rpType
            );
            for (const team of redTeams) {
                rpTotals[team] += redRp;
            }
            for (const team of blueTeams) {
                rpTotals[team] += blueRp;
            }
        }

        const rankedTeams = [...teamNumbers].sort((a, b) => {
            if (rpTotals[b] !== rpTotals[a]) return rpTotals[b] - rpTotals[a];
            return Math.random() - 0.5;
        });

        rankedTeams.forEach((team, rank) => {
            simRanks[team].push(rank + 1);
            simRps[team].push(rpTotals[team]);
        });
    }

    return { simRanks, simRps };
}

function computeScheduleStats(
    schedule: SosScheduleMatch[],
    teamNumbers: number[],
    teamOprs: Map<number, number>
) {
    const partnerTotals: Record<number, number> = {};
    const partnerCounts: Record<number, number> = {};
    const opponentTotals: Record<number, number> = {};
    const opponentCounts: Record<number, number> = {};
    const matchCounts: Record<number, number> = {};

    for (const team of teamNumbers) {
        partnerTotals[team] = 0;
        partnerCounts[team] = 0;
        opponentTotals[team] = 0;
        opponentCounts[team] = 0;
        matchCounts[team] = 0;
    }

    for (const match of schedule) {
        for (const team of match.red) {
            matchCounts[team] += 1;
            const partner = match.red.find((t) => t !== team);
            if (partner != null) {
                partnerTotals[team] += teamOprs.get(partner) || 0;
                partnerCounts[team] += 1;
            }
            for (const opponent of match.blue) {
                opponentTotals[team] += teamOprs.get(opponent) || 0;
                opponentCounts[team] += 1;
            }
        }

        for (const team of match.blue) {
            matchCounts[team] += 1;
            const partner = match.blue.find((t) => t !== team);
            if (partner != null) {
                partnerTotals[team] += teamOprs.get(partner) || 0;
                partnerCounts[team] += 1;
            }
            for (const opponent of match.red) {
                opponentTotals[team] += teamOprs.get(opponent) || 0;
                opponentCounts[team] += 1;
            }
        }
    }

    return { partnerTotals, partnerCounts, opponentTotals, opponentCounts, matchCounts };
}

function runSos(config: SosConfig): Record<number, SosMetrics> {
    const teamNumbers = config.teams.map((team) => team.teamNumber);
    const teamOprs = new Map<number, number>();
    const teamRpRates = new Map<number, SosTeamInput["rpBonusRates"]>();
    for (const team of config.teams) {
        teamOprs.set(team.teamNumber, team.opr || 0);
        teamRpRates.set(team.teamNumber, team.rpBonusRates);
    }

    const rpType = getRpType(config.season);

    const schedule = config.schedule;
    const matchesPerTeam =
        teamNumbers.length > 0 ? Math.round((4 * schedule.length) / teamNumbers.length) : 0;

    const scheduleIndices = buildScheduleIndices(teamNumbers.length, matchesPerTeam);

    const { simRanks: preSimRanks, simRps: preSimRps } = simulateRandomSchedule(
        scheduleIndices,
        teamNumbers,
        teamOprs,
        teamRpRates,
        rpType,
        config.simCount
    );
    const { simRanks, simRps } = simulateSchedule(
        schedule,
        teamNumbers,
        teamOprs,
        teamRpRates,
        rpType,
        config.simCount
    );

    const { partnerTotals, partnerCounts, opponentTotals, opponentCounts, matchCounts } =
        computeScheduleStats(schedule, teamNumbers, teamOprs);

    const oprValues = config.teams.map((team) => team.opr || 0);
    const oprAvg =
        oprValues.reduce((sum, value) => sum + value, 0) / (oprValues.length || 1);
    const oprVar =
        oprValues.reduce((sum, value) => sum + value * value, 0) / (oprValues.length || 1) -
        oprAvg * oprAvg;
    const oprSd = oprVar > 0 ? Math.sqrt(oprVar) : 0;

    const metrics: Record<number, SosMetrics> = {};
    for (const team of teamNumbers) {
        const teamPreRanks = preSimRanks[team] || [];
        const teamSimRanks = simRanks[team] || [];
        const teamPreRps = preSimRps[team] || [];
        const teamSimRps = simRps[team] || [];

        const preSimAvgRank =
            teamPreRanks.reduce((sum, value) => sum + value, 0) / (teamPreRanks.length || 1);
        const simAvgRank =
            teamSimRanks.reduce((sum, value) => sum + value, 0) / (teamSimRanks.length || 1);
        const preSimAvgRp =
            teamPreRps.reduce((sum, value) => sum + value, 0) / (teamPreRps.length || 1);
        const simAvgRp =
            teamSimRps.reduce((sum, value) => sum + value, 0) / (teamSimRps.length || 1);

        const rankPercentile =
            teamPreRanks.filter((rank) => rank <= simAvgRank).length /
            (teamPreRanks.length || 1);
        const rpPercentile =
            teamPreRps.filter((rp) => rp >= simAvgRp).length / (teamPreRps.length || 1);

        const avgPartnerOpr =
            partnerCounts[team] > 0 ? partnerTotals[team] / partnerCounts[team] : null;
        const avgOpponentOpr =
            opponentCounts[team] > 0 ? opponentTotals[team] / opponentCounts[team] : null;

        const deltaOpr =
            avgPartnerOpr != null && avgOpponentOpr != null
                ? oprAvg + avgPartnerOpr - 2 * avgOpponentOpr
                : null;

        let oprPercentile: number | null = null;
        if (deltaOpr != null && matchesPerTeam > 0 && oprSd > 0) {
            const sd = oprSd * Math.sqrt(3 / matchesPerTeam);
            oprPercentile = 1 - normalCdf(deltaOpr, 0, sd);
        }

        const overallPercentile =
            oprPercentile == null ? null : (rankPercentile + rpPercentile + oprPercentile) / 3;

        metrics[team] = {
            matchCount: matchCounts[team] || 0,
            avgPartnerOpr,
            avgOpponentOpr,
            deltaOpr,
            oprPercentile,
            preSimAvgRank,
            simAvgRank,
            deltaRank: simAvgRank - preSimAvgRank,
            rankPercentile,
            preSimAvgRp,
            simAvgRp,
            deltaRp: simAvgRp - preSimAvgRp,
            rpPercentile,
            overallPercentile,
        };
    }

    return metrics;
}

ctx.onmessage = (event: MessageEvent<SosMessage>) => {
    if (event.data.type !== "run") return;

    try {
        const metrics = runSos(event.data.config);
        ctx.postMessage({ type: "result", metrics } satisfies SosMessage);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ctx.postMessage({ type: "error", message } satisfies SosMessage);
    }
};
