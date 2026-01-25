<script lang="ts">
    import {
        DESCRIPTORS,
        formatRankProbability,
        type TeamRecord,
        type Match,
        type EventSimulationConfig,
        type SimulationResult,
    } from "@ftc-stats/common";
    import { faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { TournamentLevel } from "$lib/graphql/generated/graphql-operations";
    import { onDestroy } from "svelte";
    import { t } from "$lib/i18n";

    export let teams: any[];
    export let matches: any[];
    export let season: number;

    let isSimulating = false;
    let simulationResults: SimulationResult[] = [];
    let numSimulations = 1000;
    let simulationError: string | null = null;
    let matchSummary = { total: 0, played: 0 };

    type SimulationMessage =
        | { type: "run"; config: EventSimulationConfig }
        | { type: "result"; results: SimulationResult[] }
        | { type: "error"; message: string };

    let worker: Worker | null = null;

    function handleWorkerMessage(event: MessageEvent<SimulationMessage>) {
        const payload = event.data;
        if (payload.type === "result") {
            simulationResults = payload.results;
            isSimulating = false;
            return;
        }
        if (payload.type === "error") {
            simulationError = payload.message;
            isSimulating = false;
        }
    }

    function getWorker(): Worker {
        if (!worker) {
            worker = new Worker(new URL("./simulation.worker.ts", import.meta.url), {
                type: "module",
            });
            worker.addEventListener("message", handleWorkerMessage);
        }
        return worker;
    }

    onDestroy(() => {
        if (worker) {
            worker.terminate();
            worker = null;
        }
    });

    // Convert event data to simulation format
    function prepareSimulationData(): { teams: TeamRecord[]; matches: Match[] } {
        const qualificationMatches =
            matches?.filter((m) => m.tournamentLevel === TournamentLevel.Quals) ?? [];
        const rpType = DESCRIPTORS[season]?.rankings.rp ?? "Record";

        const teamRecords: TeamRecord[] = teams.map((t) => ({
            teamNumber: t.teamNumber,
            wins: 0,
            losses: 0,
            ties: 0,
            rankingPoints: 0,
            totalPoints: 0,
            opr: t.stats?.tot?.opr?.value || 0,
            rpBonusRates: getTeamRpRates(t.stats, season),
        }));

        const matchData: Match[] = qualificationMatches.map((m) => ({
            id: `${m.eventCode}-${m.id}`,
            redTeam1:
                m.teams.find((t: any) => t.alliance === "Red" && t.station === 1)?.teamNumber || 0,
            redTeam2:
                m.teams.find((t: any) => t.alliance === "Red" && t.station === 2)?.teamNumber || 0,
            blueTeam1:
                m.teams.find((t: any) => t.alliance === "Blue" && t.station === 1)?.teamNumber || 0,
            blueTeam2:
                m.teams.find((t: any) => t.alliance === "Blue" && t.station === 2)?.teamNumber || 0,
            played: m.scores !== undefined && m.scores !== null,
            redScore: m.scores?.red?.totalPoints,
            blueScore: m.scores?.blue?.totalPoints,
            scores: m.scores,
        }));

        matchSummary = {
            total: matchData.length,
            played: matchData.filter((m) => m.played).length,
        };

        const teamRecordMap = new Map(teamRecords.map((t) => [t.teamNumber, t]));
        for (const match of matchData) {
            if (!match.played) continue;
            const redScore = match.redScore ?? 0;
            const blueScore = match.blueScore ?? 0;
            const tied = redScore === blueScore;
            const redWon = redScore > blueScore;
            const blueWon = !redWon && !tied;

            const redTeams = [match.redTeam1, match.redTeam2].filter((t) => t);
            const blueTeams = [match.blueTeam1, match.blueTeam2].filter((t) => t);

            const redRp = getMatchRp(rpType, "Red", match);
            const blueRp = getMatchRp(rpType, "Blue", match);

            for (const teamNumber of redTeams) {
                const record = teamRecordMap.get(teamNumber);
                if (!record) continue;
                if (redWon) record.wins++;
                else if (tied) record.ties++;
                else record.losses++;
                record.totalPoints += redScore;
                record.rankingPoints += redRp;
            }

            for (const teamNumber of blueTeams) {
                const record = teamRecordMap.get(teamNumber);
                if (!record) continue;
                if (blueWon) record.wins++;
                else if (tied) record.ties++;
                else record.losses++;
                record.totalPoints += blueScore;
                record.rankingPoints += blueRp;
            }
        }

        return { teams: teamRecords, matches: matchData };
    }

    function runSimulation() {
        if (isSimulating) return;
        isSimulating = true;
        simulationError = null;

        try {
            const { teams: teamRecords, matches: matchData } = prepareSimulationData();
            const config: EventSimulationConfig = {
                teams: teamRecords,
                matches: matchData,
                numSimulations,
                qualificationCutoff: 4,
                currentSeason: season,
            };
            getWorker().postMessage({ type: "run", config } satisfies SimulationMessage);
        } catch (error) {
            console.error("Simulation error:", error);
            simulationError = error instanceof Error ? error.message : String(error);
            isSimulating = false;
        }
    }

    // Get team name by number
    function getTeamName(teamNumber: number): string {
        const team = teams.find((t) => t.teamNumber === teamNumber);
        return team?.team?.name || `${$t("common.team", "Team")} ${teamNumber}`;
    }

    // Get top 3 rank probabilities for a team
    function getTopRanks(rankProbs: number[]): { rank: number; prob: number }[] {
        return rankProbs
            .map((prob, idx) => ({ rank: idx + 1, prob }))
            .sort((a, b) => b.prob - a.prob)
            .slice(0, 3);
    }

    function getPercentileRank(rankProbs: number[], percentile: number): number {
        let cumulative = 0;
        for (let i = 0; i < rankProbs.length; i++) {
            cumulative += rankProbs[i];
            if (cumulative >= percentile) return i + 1;
        }
        return rankProbs.length;
    }

    function formatRecord(result: SimulationResult): string {
        return `${result.wins.toFixed(1)}-${result.losses.toFixed(1)}-${result.ties.toFixed(1)}`;
    }

    function clampRate(rate: number | null | undefined): number {
        if (typeof rate !== "number" || Number.isNaN(rate)) return 0;
        if (rate < 0) return 0;
        if (rate > 1) return 1;
        return rate;
    }

    function getTeamRpRates(stats: any, season: number): TeamRecord["rpBonusRates"] | undefined {
        if (DESCRIPTORS[season]?.rankings.rp !== "DecodeRP") return undefined;
        const avg = stats?.avg ?? null;
        if (!avg) return undefined;
        return {
            movement: clampRate(avg.movementRp),
            goal: clampRate(avg.goalRp),
            pattern: clampRate(avg.patternRp),
        };
    }

    function getDecodeBonus(scores: any, alliance: "Red" | "Blue"): number {
        const side = alliance === "Red" ? scores?.red : scores?.blue;
        if (!side) return 0;
        return (side.movementRp ? 1 : 0) + (side.goalRp ? 1 : 0) + (side.patternRp ? 1 : 0);
    }

    function getMatchRp(rpType: string, alliance: "Red" | "Blue", match: Match): number {
        const redScore = match.redScore ?? 0;
        const blueScore = match.blueScore ?? 0;
        const tied = redScore === blueScore;
        const redWon = redScore > blueScore;
        const allianceScore = alliance === "Red" ? redScore : blueScore;

        if (rpType === "TotalPoints") {
            return allianceScore;
        }

        if (rpType === "DecodeRP") {
            const baseRp =
                alliance === "Red"
                    ? redWon
                        ? 3
                        : tied
                          ? 1
                          : 0
                    : !redWon && !tied
                      ? 3
                      : tied
                        ? 1
                        : 0;
            return baseRp + getDecodeBonus((match as any).scores, alliance);
        }

        const baseRp =
            alliance === "Red"
                ? redWon
                    ? 2
                    : tied
                      ? 1
                      : 0
                : !redWon && !tied
                  ? 2
                  : tied
                    ? 1
                    : 0;
        return baseRp;
    }
</script>

<div class="simulation-container">
    <div class="header">
        <h2>{$t("simulation.title", "Event Simulation")}</h2>
        <p class="description">
            {$t(
                "simulation.description",
                "Monte Carlo simulation of qualification rankings based on team OPR. Simulates remaining qualification matches to predict final rankings and qualification probabilities."
            )}
        </p>
    </div>

    <div class="controls">
        <div class="control-group">
            <label for="num-sims">{$t("simulation.count", "Number of Simulations:")}</label>
            <select id="num-sims" bind:value={numSimulations} disabled={isSimulating}>
                <option value={100}>100 ({$t("simulation.speed.fast", "Fast")})</option>
                <option value={1000}>
                    1,000 ({$t("simulation.speed.recommended", "Recommended")})
                </option>
                <option value={5000}>5,000 ({$t("simulation.speed.accurate", "Accurate")})</option>
                <option value={10000}>
                    10,000 ({$t("simulation.speed.very-accurate", "Very Accurate")})
                </option>
            </select>
        </div>

        <button class="run-btn" on:click={runSimulation} disabled={isSimulating}>
            {#if isSimulating}
                <Fa icon={faSpinner} spin />
                {$t("simulation.running", "Simulating...")}
            {:else}
                <Fa icon={faPlay} />
                {$t("simulation.run", "Run Simulation")}
            {/if}
        </button>
    </div>

    {#if simulationError}
        <div class="error-state">
            <p>
                {$t("simulation.error", "Simulation failed:")} {simulationError}
            </p>
        </div>
    {/if}

    {#if simulationResults.length > 0}
        <div class="results">
            <h3>{$t("simulation.results", "Simulation Results")}</h3>
            <p class="results-info">
                {$t("simulation.results.based-on", "Based on")} {numSimulations.toLocaleString()}{" "}
                {$t("simulation.results.simulations", "simulations")} - {matchSummary.total}{" "}
                {$t("simulation.results.qual-matches", "qualification matches")} (
                {matchSummary.played} {$t("simulation.results.played", "played")})
            </p>

            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>{$t("common.rank", "Rank")}</th>
                            <th>{$t("common.team", "Team")}</th>
                            <th>{$t("simulation.avg-rank", "Avg Rank")}</th>
                            <th>{$t("simulation.median", "Median")}</th>
                            <th>{$t("simulation.p10p90", "P10/P90")}</th>
                            <th>{$t("simulation.expected-record", "Expected W-L-T")}</th>
                            <th>{$t("simulation.qual-prob", "Qual Prob")}</th>
                            <th>{$t("simulation.most-likely", "Most Likely Ranks")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each simulationResults as result, idx}
                            {@const topRanks = getTopRanks(result.rankProbabilities)}
                            {@const p10 = getPercentileRank(result.rankProbabilities, 0.1)}
                            {@const median = getPercentileRank(result.rankProbabilities, 0.5)}
                            {@const p90 = getPercentileRank(result.rankProbabilities, 0.9)}
                            <tr class:qualified={idx < 4}>
                                <td class="rank-col">{idx + 1}</td>
                                <td class="team-col">
                                    <strong>{result.teamNumber}</strong>
                                    <span class="team-name">{getTeamName(result.teamNumber)}</span>
                                </td>
                                <td>{result.averageRank.toFixed(2)}</td>
                                <td>{median}</td>
                                <td>{p10}-{p90}</td>
                                <td>{formatRecord(result)}</td>
                                <td class="qual-prob" class:high={result.qualificationProbability > 0.75}>
                                    {formatRankProbability(result.qualificationProbability)}
                                </td>
                                <td class="rank-probs">
                                    {#each topRanks as { rank, prob }}
                                        <span class="rank-badge">
                                            #{rank}: {formatRankProbability(prob)}
                                        </span>
                                    {/each}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {:else}
        <div class="empty-state">
            <p>{$t("simulation.empty", "Click \\\"Run Simulation\\\" to predict event rankings")}</p>
            <p class="hint">
                {$t(
                    "simulation.hint",
                    "Simulation uses team OPR values to predict qualification match outcomes and calculate ranking probabilities"
                )}
            </p>
        </div>
    {/if}
</div>

<style>
    .simulation-container {
        padding: var(--lg-pad);
    }

    .header {
        margin-bottom: var(--vl-gap);
    }

    h2 {
        font-size: var(--lg-font-size);
        margin-bottom: var(--sm-gap);
    }

    .description {
        color: var(--secondary-text-color);
        line-height: 1.5;
    }

    .controls {
        display: flex;
        align-items: end;
        gap: var(--lg-gap);
        margin-bottom: var(--vl-gap);
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }

    label {
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    select {
        padding: var(--md-pad);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
        background: var(--form-bg-color);
        color: var(--text-color);
        font-size: var(--md-font-size);
    }

    .run-btn {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        padding: var(--md-pad) var(--lg-pad);
        background: var(--fg-color);
        color: var(--text-color);
        border: none;
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
        font-size: var(--md-font-size);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .run-btn:hover:not(:disabled) {
        background: var(--theme-soft-color);
        box-shadow: 4px 4px 0 var(--sep-color);
    }

    .run-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .results {
        margin-top: var(--vl-gap);
    }

    .error-state {
        margin-top: var(--lg-gap);
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
        color: var(--secondary-text-color);
    }

    h3 {
        font-size: var(--md-font-size);
        margin-bottom: var(--sm-gap);
    }

    .results-info {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
        margin-bottom: var(--lg-gap);
    }

    .results-table {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        border: var(--border-width) solid var(--sep-color);
    }

    thead {
        background: var(--table-header-bg);
        border-bottom: var(--border-width) solid var(--sep-color);
    }

    th {
        padding: var(--md-pad);
        text-align: left;
        font-size: var(--sm-font-size);
        font-weight: 600;
        border-bottom: var(--border-width) solid var(--sep-color);
    }

    td {
        padding: var(--md-pad);
        border-bottom: var(--border-width) solid var(--sep-color);
    }

    tr.qualified {
        background: var(--theme-soft-color);
    }

    .rank-col {
        font-weight: 600;
        width: 60px;
    }

    .team-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .team-name {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .qual-prob.high {
        color: var(--theme-color);
        font-weight: 600;
    }

    .rank-probs {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
    }

    .rank-badge {
        padding: 2px var(--sm-pad);
        background: var(--hover-color);
        border-radius: var(--control-radius);
        font-size: var(--xs-font-size);
        border: var(--border-width) solid var(--sep-color);
    }

    .empty-state {
        padding: var(--xl-gap);
        text-align: center;
        color: var(--secondary-text-color);
    }

    .empty-state p {
        margin-bottom: var(--md-gap);
    }

    .hint {
        font-size: var(--sm-font-size);
        font-style: italic;
    }

    @media (max-width: 800px) {
        .controls {
            flex-direction: column;
            align-items: stretch;
        }

        .run-btn {
            justify-content: center;
        }
    }
</style>
