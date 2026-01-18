<script lang="ts">
    import { simulateEvent, formatRankProbability, type TeamRecord, type Match } from "@ftc-stats/common";
    import { faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let teams: any[];
    export let matches: any[];
    export let season: number;

    let isSimulating = false;
    let simulationResults: any[] = [];
    let numSimulations = 1000;

    // Convert event data to simulation format
    function prepareSimulationData(): { teams: TeamRecord[]; matches: Match[] } {
        const teamRecords: TeamRecord[] = teams.map((t) => ({
            teamNumber: t.teamNumber,
            wins: 0,
            losses: 0,
            ties: 0,
            rankingPoints: 0,
            totalPoints: 0,
            opr: t.stats?.tot?.opr?.value || 0,
        }));

        const matchData: Match[] = matches.map((m, idx) => ({
            id: `${m.eventCode}-${m.id}`,
            redTeam1: m.teams.find((t: any) => t.alliance === "Red" && t.station === 1)?.teamNumber || 0,
            redTeam2: m.teams.find((t: any) => t.alliance === "Red" && t.station === 2)?.teamNumber || 0,
            blueTeam1: m.teams.find((t: any) => t.alliance === "Blue" && t.station === 1)?.teamNumber || 0,
            blueTeam2: m.teams.find((t: any) => t.alliance === "Blue" && t.station === 2)?.teamNumber || 0,
            played: m.scores !== undefined && m.scores !== null,
            redScore: m.scores?.red?.totalPoints,
            blueScore: m.scores?.blue?.totalPoints,
        }));

        return { teams: teamRecords, matches: matchData };
    }

    function runSimulation() {
        isSimulating = true;

        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                const { teams: teamRecords, matches: matchData } = prepareSimulationData();

                const results = simulateEvent({
                    teams: teamRecords,
                    matches: matchData,
                    numSimulations,
                    qualificationCutoff: 4,
                    currentSeason: season,
                });

                simulationResults = results;
            } catch (error) {
                console.error("Simulation error:", error);
            } finally {
                isSimulating = false;
            }
        }, 100);
    }

    // Get team name by number
    function getTeamName(teamNumber: number): string {
        const team = teams.find((t) => t.teamNumber === teamNumber);
        return team?.team?.name || `Team ${teamNumber}`;
    }

    // Get top 3 rank probabilities for a team
    function getTopRanks(rankProbs: number[]): { rank: number; prob: number }[] {
        return rankProbs
            .map((prob, idx) => ({ rank: idx + 1, prob }))
            .sort((a, b) => b.prob - a.prob)
            .slice(0, 3);
    }
</script>

<div class="simulation-container">
    <div class="header">
        <h2>Event Simulation</h2>
        <p class="description">
            Monte Carlo simulation of event rankings based on team OPR. Simulates remaining matches
            to predict final rankings and qualification probabilities.
        </p>
    </div>

    <div class="controls">
        <div class="control-group">
            <label for="num-sims">Number of Simulations:</label>
            <select id="num-sims" bind:value={numSimulations} disabled={isSimulating}>
                <option value={100}>100 (Fast)</option>
                <option value={1000}>1,000 (Recommended)</option>
                <option value={5000}>5,000 (Accurate)</option>
                <option value={10000}>10,000 (Very Accurate)</option>
            </select>
        </div>

        <button class="run-btn" on:click={runSimulation} disabled={isSimulating}>
            {#if isSimulating}
                <Fa icon={faSpinner} spin />
                Simulating...
            {:else}
                <Fa icon={faPlay} />
                Run Simulation
            {/if}
        </button>
    </div>

    {#if simulationResults.length > 0}
        <div class="results">
            <h3>Simulation Results</h3>
            <p class="results-info">Based on {numSimulations.toLocaleString()} simulations</p>

            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Team</th>
                            <th>Avg Rank</th>
                            <th>Qual Prob</th>
                            <th>Most Likely Ranks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each simulationResults as result, idx}
                            {@const topRanks = getTopRanks(result.rankProbabilities)}
                            <tr class:qualified={idx < 4}>
                                <td class="rank-col">{idx + 1}</td>
                                <td class="team-col">
                                    <strong>{result.teamNumber}</strong>
                                    <span class="team-name">{getTeamName(result.teamNumber)}</span>
                                </td>
                                <td>{result.averageRank.toFixed(2)}</td>
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
            <p>Click "Run Simulation" to predict event rankings</p>
            <p class="hint">
                Simulation uses team OPR values to predict match outcomes and calculate ranking
                probabilities
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
        background: var(--hover-color);
        border-radius: 8px;
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
        border: 1px solid var(--sep-color);
        border-radius: 4px;
        background: var(--form-bg-color);
        color: var(--text-color);
        font-size: var(--md-font-size);
    }

    .run-btn {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        padding: var(--md-pad) var(--lg-pad);
        background: var(--theme-color);
        color: var(--theme-text-color);
        border: none;
        border-radius: 4px;
        font-size: var(--md-font-size);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .run-btn:hover:not(:disabled) {
        opacity: 0.9;
    }

    .run-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .results {
        margin-top: var(--vl-gap);
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
    }

    thead {
        background: var(--hover-color);
    }

    th {
        padding: var(--md-pad);
        text-align: left;
        font-size: var(--sm-font-size);
        font-weight: 600;
        border-bottom: 2px solid var(--sep-color);
    }

    td {
        padding: var(--md-pad);
        border-bottom: 1px solid var(--sep-color);
    }

    tr.qualified {
        background: rgba(var(--theme-color-vs), 0.1);
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
        border-radius: 4px;
        font-size: var(--xs-font-size);
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
