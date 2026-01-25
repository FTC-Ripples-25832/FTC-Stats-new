<script lang="ts">
    import { DESCRIPTORS, formatRankProbability } from "@ftc-stats/common";
    import { ExportToCsv } from "export-to-csv";
    import { faDownload, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { onDestroy } from "svelte";
    import Card from "$lib/components/Card.svelte";
    import { t } from "$lib/i18n";
    import { prettyPrintFloat } from "$lib/printers/number";
    import {
        TournamentLevel,
        type EventPageQuery,
    } from "$lib/graphql/generated/graphql-operations";

    type TeamEntry = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];
    type MatchEntry = NonNullable<EventPageQuery["eventByCode"]>["matches"][number];

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

    type SosRow = {
        teamNumber: number;
        teamName: string;
        eventRank: number | null;
        matchCount: number;
        avgPartnerOpr: number | null;
        avgOpponentOpr: number | null;
        netOpr: number | null;
        preSimAvgRank: number;
        simAvgRank: number;
        deltaRank: number;
        rankPercentile: number;
        preSimAvgRp: number;
        simAvgRp: number;
        deltaRp: number;
        rpPercentile: number;
        oprPercentile: number | null;
        overallPercentile: number | null;
    };

    type SosMessage =
        | { type: "run"; config: SosConfig }
        | { type: "result"; metrics: Record<number, SosMetrics> }
        | { type: "error"; message: string };

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
        season: number;
        simCount: number;
    };

    export let teams: TeamEntry[];
    export let matches: MatchEntry[];
    export let teamOprMap: Record<number, number>;
    export let eventName: string;
    export let season: number;

    let simCount = 1000;
    let isSimulating = false;
    let simulationError: string | null = null;
    let metrics: Record<number, SosMetrics> | null = null;
    let showDetailed = false;
    let sortKey = "overall";
    let sortDir: "asc" | "desc" = "desc";

    let worker: Worker | null = null;

    function handleWorkerMessage(event: MessageEvent<SosMessage>) {
        const payload = event.data;
        if (payload.type === "result") {
            metrics = payload.metrics;
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
            worker = new Worker(new URL("./sos.worker.ts", import.meta.url), {
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

    $: qualMatches = matches?.filter((m) => m.tournamentLevel === TournamentLevel.Quals) ?? [];

    function clampRate(rate: number | null | undefined): number {
        if (typeof rate !== "number" || Number.isNaN(rate)) return 0;
        if (rate < 0) return 0;
        if (rate > 1) return 1;
        return rate;
    }

    function getTeamRpRates(stats: any, season: number): SosTeamInput["rpBonusRates"] | undefined {
        if (DESCRIPTORS[season]?.rankings.rp !== "DecodeRP") return undefined;
        const avg = stats?.avg ?? null;
        if (!avg) return undefined;
        return {
            movement: clampRate(avg.movementRp),
            goal: clampRate(avg.goalRp),
            pattern: clampRate(avg.patternRp),
        };
    }

    $: teamInputs =
        teams?.map((team) => ({
            teamNumber: team.teamNumber,
            opr: teamOprMap[team.teamNumber] ?? 0,
            rpBonusRates: getTeamRpRates(team.stats, season),
        })) ?? [];

    $: schedule =
        qualMatches
            ?.map((match) => {
                const redTeams = match.teams
                    .filter((t) => t.alliance === "Red")
                    .map((t) => t.teamNumber);
                const blueTeams = match.teams
                    .filter((t) => t.alliance === "Blue")
                    .map((t) => t.teamNumber);
                if (redTeams.length !== 2 || blueTeams.length !== 2) return null;
                return { red: redTeams, blue: blueTeams } satisfies SosScheduleMatch;
            })
            .filter((match): match is SosScheduleMatch => match != null) ?? [];

    function getEventRank(teamNumber: number): number | null {
        const team = teams.find((t) => t.teamNumber === teamNumber);
        const rank = (team?.stats as { rank?: number } | null)?.rank;
        return typeof rank === "number" ? rank : null;
    }

    function runSimulation() {
        if (isSimulating) return;
        simulationError = null;
        metrics = null;
        if (!schedule.length || !teamInputs.length) {
            simulationError = "No qualification schedule is available.";
            return;
        }

        isSimulating = true;
        const config: SosConfig = {
            teams: teamInputs,
            schedule,
            season,
            simCount,
        };
        getWorker().postMessage({ type: "run", config } satisfies SosMessage);
    }

    function formatValue(value: number | null): string {
        return value == null ? "-" : prettyPrintFloat(value);
    }

    function formatPercent(value: number | null): string {
        return value == null ? "-" : formatRankProbability(value);
    }

    function getSortValue(row: SosRow): number {
        switch (sortKey) {
            case "rankScore":
                return row.rankPercentile ?? -Infinity;
            case "rpScore":
                return row.rpPercentile ?? -Infinity;
            case "oprScore":
                return row.oprPercentile ?? -Infinity;
            case "overall":
                return row.overallPercentile ?? -Infinity;
            case "opponentOpr":
                return row.avgOpponentOpr ?? -Infinity;
            case "netOpr":
                return row.netOpr ?? -Infinity;
            case "deltaRank":
                return row.deltaRank ?? -Infinity;
            case "deltaRp":
                return row.deltaRp ?? -Infinity;
            default:
                return row.overallPercentile ?? -Infinity;
        }
    }

    $: rows =
        teams?.map((team) => {
            const teamMetric = metrics?.[team.teamNumber];
            return {
                teamNumber: team.teamNumber,
                teamName: team.team?.name ?? `Team ${team.teamNumber}`,
                eventRank: getEventRank(team.teamNumber),
                matchCount: teamMetric?.matchCount ?? 0,
                avgPartnerOpr: teamMetric?.avgPartnerOpr ?? null,
                avgOpponentOpr: teamMetric?.avgOpponentOpr ?? null,
                netOpr:
                    teamMetric?.avgOpponentOpr != null && teamMetric?.avgPartnerOpr != null
                        ? teamMetric.avgOpponentOpr - teamMetric.avgPartnerOpr
                        : null,
                preSimAvgRank: teamMetric?.preSimAvgRank ?? 0,
                simAvgRank: teamMetric?.simAvgRank ?? 0,
                deltaRank: teamMetric?.deltaRank ?? 0,
                rankPercentile: teamMetric?.rankPercentile ?? 0,
                preSimAvgRp: teamMetric?.preSimAvgRp ?? 0,
                simAvgRp: teamMetric?.simAvgRp ?? 0,
                deltaRp: teamMetric?.deltaRp ?? 0,
                rpPercentile: teamMetric?.rpPercentile ?? 0,
                oprPercentile: teamMetric?.oprPercentile ?? null,
                overallPercentile: teamMetric?.overallPercentile ?? null,
            } satisfies SosRow;
        }) ?? [];

    $: sortedRows = [...rows].sort((a, b) => {
        const aValue = getSortValue(a);
        const bValue = getSortValue(b);
        if (aValue === bValue) return a.teamNumber - b.teamNumber;
        return sortDir === "asc" ? aValue - bValue : bValue - aValue;
    });

    function toggleSortDirection() {
        sortDir = sortDir === "asc" ? "desc" : "asc";
    }

    function exportCsv() {
        if (!sortedRows.length) return;
        const exporter = new ExportToCsv({
            filename: `${eventName.replace(/\s+/g, "_").toLowerCase()}_sos`,
            title: `${eventName} SOS`,
            showTitle: true,
            showLabels: true,
            useKeysAsHeaders: true,
        });

        const data = sortedRows.map((row) => ({
            teamNumber: row.teamNumber,
            teamName: row.teamName,
            eventRank: row.eventRank ?? "",
            matchCount: row.matchCount,
            avgPartnerOpr: row.avgPartnerOpr ?? "",
            avgOpponentOpr: row.avgOpponentOpr ?? "",
            netOpr: row.netOpr ?? "",
            preSimAvgRank: row.preSimAvgRank,
            simAvgRank: row.simAvgRank,
            deltaRank: row.deltaRank,
            rankPercentile: row.rankPercentile,
            preSimAvgRp: row.preSimAvgRp,
            simAvgRp: row.simAvgRp,
            deltaRp: row.deltaRp,
            rpPercentile: row.rpPercentile,
            oprPercentile: row.oprPercentile ?? "",
            overallPercentile: row.overallPercentile ?? "",
        }));

        exporter.generateCsv(data);
    }
</script>

<Card>
    <h2>{$t("events.sos.title", "Strength of Schedule")}</h2>
    <p class="subtitle">
        {$t(
            "events.sos.subtitle-prefix",
            "Statbotics-style schedule strength using OPR, simulated rankings, and RP scores from qualification matches at"
        )} {eventName}.
    </p>
</Card>

<div class="controls">
    <div class="control-group">
        <label for="sos-sims">{$t("events.sos.simulations", "Simulations")}:</label>
        <select id="sos-sims" bind:value={simCount} disabled={isSimulating}>
            <option value={200}>{$t("events.sos.sim-fast", "200 (Fast)")}</option>
            <option value={1000}>{$t("events.sos.sim-recommended", "1,000 (Recommended)")}</option>
            <option value={5000}>{$t("events.sos.sim-accurate", "5,000 (Accurate)")}</option>
        </select>
    </div>

    <div class="control-group">
        <label for="sos-sort">{$t("events.sos.sort-by", "Sort By")}:</label>
        <select id="sos-sort" bind:value={sortKey}>
            <option value="overall">{$t("events.sos.composite-score", "Composite Score")}</option>
            <option value="rankScore">{$t("events.sos.rank-score", "Rank Score")}</option>
            <option value="rpScore">{$t("events.sos.rp-score", "RP Score")}</option>
            <option value="oprScore">{$t("events.sos.opr-score", "OPR Score")}</option>
            <option value="opponentOpr">{$t("events.sos.opponent-opr", "Opponent OPR")}</option>
            <option value="netOpr">{$t("events.sos.net-opr", "Net OPR")}</option>
            <option value="deltaRank">{$t("events.sos.delta-rank", "Delta Rank")}</option>
            <option value="deltaRp">{$t("events.sos.delta-rp", "Delta RP")}</option>
        </select>
    </div>

    <div class="control-group checkbox">
        <label>
            <input type="checkbox" bind:checked={showDetailed} />
            {$t("events.sos.detailed-view", "Detailed View")}
        </label>
    </div>

    <button class="run-btn" on:click={runSimulation} disabled={isSimulating}>
        {#if isSimulating}
            <Fa icon={faSpinner} spin />
            {$t("events.sos.simulating", "Simulating...")}
        {:else}
            <Fa icon={faPlay} />
            {$t("events.sos.run-simulation", "Run Simulation")}
        {/if}
    </button>

    <button class="action-btn" on:click={toggleSortDirection} type="button">
        {$t("events.sos.sort", "Sort")}{" "}
        {$t(sortDir === "asc" ? "common.asc" : "common.desc", sortDir === "asc" ? "Asc" : "Desc")}
    </button>

    <button class="action-btn" on:click={exportCsv} type="button" disabled={!metrics}>
        <Fa icon={faDownload} />
        {$t("stats.export", "Export CSV")}
    </button>
</div>

{#if simulationError}
    <div class="error-state">
        <p>
            {$t("events.sos.simulation-failed", "SOS simulation failed")}: {simulationError}
        </p>
    </div>
{/if}

{#if metrics}
    <Card>
        <table class="sos-table">
            <thead>
                <tr>
                    <th>{$t("events.sos.sos-rank", "SoS Rank")}</th>
                    <th>{$t("common.team", "Team")}</th>
                    <th>{$t("events.sos.event-rank", "Event Rank")}</th>
                    <th>{$t("events.sos.qual-matches", "Qual Matches")}</th>
                    <th>{$t("events.sos.partner-opr", "Partner OPR")}</th>
                    <th>{$t("events.sos.opponent-opr", "Opponent OPR")}</th>
                    <th>{$t("events.sos.net", "Net")}</th>
                    <th>{$t("events.sos.rank-score", "Rank Score")}</th>
                    <th>{$t("events.sos.rp-score", "RP Score")}</th>
                    <th>{$t("events.sos.opr-score", "OPR Score")}</th>
                    <th>{$t("events.sos.composite", "Composite")}</th>
                    {#if showDetailed}
                        <th>{$t("events.sos.pre-rank", "Pre Rank")}</th>
                        <th>{$t("events.sos.sched-rank", "Sched Rank")}</th>
                        <th>{$t("events.sos.delta-rank", "Delta Rank")}</th>
                        <th>{$t("events.sos.pre-rp", "Pre RP")}</th>
                        <th>{$t("events.sos.sched-rp", "Sched RP")}</th>
                        <th>{$t("events.sos.delta-rp", "Delta RP")}</th>
                    {/if}
                </tr>
            </thead>
            <tbody>
                {#each sortedRows as row, idx}
                    <tr>
                        <td>{idx + 1}</td>
                        <td>
                            {row.teamNumber}
                            <span class="team-name">{row.teamName}</span>
                        </td>
                        <td>{row.eventRank ?? "-"}</td>
                        <td>{row.matchCount}</td>
                        <td>{formatValue(row.avgPartnerOpr)}</td>
                        <td>{formatValue(row.avgOpponentOpr)}</td>
                        <td>{formatValue(row.netOpr)}</td>
                        <td>{formatPercent(row.rankPercentile)}</td>
                        <td>{formatPercent(row.rpPercentile)}</td>
                        <td>{formatPercent(row.oprPercentile)}</td>
                        <td>{formatPercent(row.overallPercentile)}</td>
                        {#if showDetailed}
                            <td>{prettyPrintFloat(row.preSimAvgRank)}</td>
                            <td>{prettyPrintFloat(row.simAvgRank)}</td>
                            <td>{prettyPrintFloat(row.deltaRank)}</td>
                            <td>{prettyPrintFloat(row.preSimAvgRp)}</td>
                            <td>{prettyPrintFloat(row.simAvgRp)}</td>
                            <td>{prettyPrintFloat(row.deltaRp)}</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
        <p class="note">
            {$t(
                "events.sos.note",
                "Scores reflect how the published schedule compares to a balanced random schedule. Higher composite score means a tougher schedule."
            )}
        </p>
    </Card>
{:else}
    <Card>
        <p>
            {$t(
                "events.sos.no-data",
                "No SOS data yet. Run the simulation to compute schedule strength."
            )}
        </p>
    </Card>
{/if}

<style>
    h2 {
        margin-bottom: var(--sm-gap);
    }

    .subtitle {
        color: var(--secondary-text-color);
    }

    .controls {
        display: flex;
        flex-wrap: wrap;
        align-items: end;
        gap: var(--lg-gap);
        margin: var(--vl-gap) 0;
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

    .control-group.checkbox {
        flex-direction: row;
        align-items: center;
        gap: var(--sm-gap);
        padding-top: var(--lg-pad);
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

    .action-btn {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        padding: var(--md-pad) var(--lg-pad);
        background: var(--fg-color);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
        color: var(--text-color);
        cursor: pointer;
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

    .sos-table {
        width: 100%;
        border-collapse: collapse;
    }

    .sos-table th,
    .sos-table td {
        padding: var(--sm-pad);
        text-align: left;
        border-bottom: var(--border-width) solid var(--sep-color);
    }

    .team-name {
        color: var(--secondary-text-color);
        margin-left: var(--sm-gap);
        font-size: var(--sm-font-size);
    }

    .note {
        margin-top: var(--md-gap);
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    @media (max-width: 900px) {
        .controls {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>
