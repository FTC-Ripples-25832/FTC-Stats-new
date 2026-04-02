<script lang="ts">
    import { CURRENT_SEASON, ALL_SEASONS } from "@ftc-stats/common";
    import type { TeamSeasonEpa, SeasonEpaStats } from "@ftc-stats/common";
    import type { Season } from "@ftc-stats/common";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import Select from "$lib/components/ui/form/Select.svelte";
    import { t } from "$lib/i18n";
    import { getHttpOrigin } from "$lib/apiOrigin";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import type * as HighchartsType from "highcharts";

    type HighchartsModule = typeof import("highcharts");

    let season: Season = CURRENT_SEASON;
    let division = "all";
    let rankings: TeamSeasonEpa[] = [];
    let seasonStats: SeasonEpaStats | null = null;
    let loading = true;
    let error: string | null = null;

    let chartContainer: HTMLDivElement;
    let chart: HighchartsType.Chart | null = null;

    // Sorting state
    let sortColumn: keyof TeamSeasonEpa | "rank" = "epa_total";
    let sortDirection: "asc" | "desc" = "desc";

    const divisionOptions = [
        { value: "all", name: "All Divisions" },
        { value: "franklin", name: "Franklin" },
        { value: "edison", name: "Edison" },
        { value: "jemison", name: "Jemison" },
        { value: "ochoa", name: "Ochoa" },
    ];

    $: totalTeams = rankings.length;
    $: regionsRepresented = new Set(
        rankings.map((r) => r.country ?? "Unknown").filter(Boolean)
    ).size;

    $: sortedRankings = sortRankings(rankings, sortColumn, sortDirection);

    function sortRankings(
        data: TeamSeasonEpa[],
        col: keyof TeamSeasonEpa | "rank",
        dir: "asc" | "desc"
    ): TeamSeasonEpa[] {
        const sorted = [...data];
        sorted.sort((a, b) => {
            let aVal: number | string | null;
            let bVal: number | string | null;

            if (col === "rank") {
                aVal = a.total_epa_rank;
                bVal = b.total_epa_rank;
            } else {
                aVal = a[col] as number | string | null;
                bVal = b[col] as number | string | null;
            }

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (typeof aVal === "string" && typeof bVal === "string") {
                return dir === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return dir === "asc"
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        });
        return sorted;
    }

    function toggleSort(col: keyof TeamSeasonEpa | "rank") {
        if (sortColumn === col) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = col;
            sortDirection = col === "name" ? "asc" : "desc";
        }
    }

    function epaColor(value: number | null, max: number): string {
        if (value == null) return "inherit";
        const ratio = Math.max(0, Math.min(1, value / max));
        if (ratio >= 0.7) return "var(--epa-high)";
        if (ratio >= 0.4) return "var(--epa-mid)";
        return "var(--epa-low)";
    }

    $: epaMax = rankings.reduce(
        (max, r) => Math.max(max, r.epa_total ?? 0),
        0
    );

    async function fetchData() {
        if (!browser) return;
        loading = true;
        error = null;

        try {
            const origin = getHttpOrigin();
            const [rankingsRes, statsRes] = await Promise.all([
                fetch(`${origin}/rest/v1/epa/rankings/${season}?limit=200`),
                fetch(`${origin}/rest/v1/epa/season/${season}`),
            ]);

            if (!rankingsRes.ok) throw new Error("Failed to fetch EPA rankings");
            if (!statsRes.ok) throw new Error("Failed to fetch season stats");

            rankings = await rankingsRes.json();
            seasonStats = await statsRes.json();
        } catch (e) {
            error = e instanceof Error ? e.message : "An error occurred";
            rankings = [];
            seasonStats = null;
        } finally {
            loading = false;
        }
    }

    async function loadHighcharts(): Promise<HighchartsModule | null> {
        if (!browser) return null;
        const highchartsModule = await import("highcharts");
        const Highcharts =
            (highchartsModule as { default?: HighchartsModule }).default ??
            highchartsModule;
        const highchartsMoreModule = await import("highcharts/highcharts-more");
        const HighchartsMore =
            (
                highchartsMoreModule as {
                    default?: (h: HighchartsModule) => void;
                }
            ).default ?? (highchartsMoreModule as (h: HighchartsModule) => void);
        if (typeof HighchartsMore === "function") {
            HighchartsMore(Highcharts);
        }
        return Highcharts;
    }

    async function renderChart() {
        if (!chartContainer || rankings.length === 0) return;
        const Highcharts = await loadHighcharts();
        if (!Highcharts) return;

        if (chart) {
            chart.destroy();
            chart = null;
        }

        const bubbleData = rankings
            .filter(
                (r) =>
                    r.epa_auto != null && r.epa_dc != null && r.epa_total != null
            )
            .map((r) => ({
                x: r.epa_auto!,
                y: r.epa_dc!,
                z: r.epa_total!,
                name: `${r.team_number}`,
                teamName: r.name ?? "Unknown",
            }));

        chart = Highcharts.chart(chartContainer, {
            chart: {
                type: "bubble",
                backgroundColor: "transparent",
                height: 500,
                zooming: {
                    type: "xy",
                },
            },
            title: {
                text: $t(
                    "worlds.chart.title",
                    "EPA Performance Landscape"
                ),
                style: {
                    color: "var(--text-color)",
                    fontSize: "18px",
                    fontWeight: "600",
                },
            },
            xAxis: {
                title: {
                    text: $t("worlds.chart.x", "Auto EPA"),
                    style: { color: "var(--text-color)" },
                },
                labels: {
                    style: { color: "var(--text-color)" },
                },
                gridLineColor: "var(--sep-color)",
                gridLineWidth: 1,
            },
            yAxis: {
                title: {
                    text: $t("worlds.chart.y", "DC EPA"),
                    style: { color: "var(--text-color)" },
                },
                labels: {
                    style: { color: "var(--text-color)" },
                },
                gridLineColor: "var(--sep-color)",
            },
            tooltip: {
                useHTML: true,
                backgroundColor: "var(--fg-color)",
                borderColor: "var(--sep-color)",
                style: {
                    color: "var(--text-color)",
                },
                formatter: function () {
                    const point = this.point as any;
                    return `
                        <div style="padding: 8px;">
                            <strong>${$t("common.team", "Team")} ${point.name}</strong><br/>
                            ${point.teamName}<br/><br/>
                            ${$t("worlds.chart.x", "Auto EPA")}: <strong>${point.x.toFixed(2)}</strong><br/>
                            ${$t("worlds.chart.y", "DC EPA")}: <strong>${point.y.toFixed(2)}</strong><br/>
                            ${$t("worlds.chart.total", "Total EPA")}: <strong>${point.z.toFixed(2)}</strong>
                        </div>
                    `;
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                bubble: {
                    minSize: 10,
                    maxSize: 40,
                    dataLabels: {
                        enabled: true,
                        format: "{point.name}",
                        style: {
                            color: "var(--text-color)",
                            textOutline: "none",
                            fontSize: "10px",
                        },
                        y: -15,
                    },
                    color: "rgba(245, 126, 37, 0.6)",
                    marker: {
                        fillOpacity: 0.6,
                        lineWidth: 1,
                        lineColor: "rgb(245, 126, 37)",
                    },
                },
            },
            series: [
                {
                    type: "bubble",
                    data: bubbleData as any,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    $: if (browser && season) {
        fetchData();
    }

    $: if (browser && rankings.length > 0 && chartContainer) {
        renderChart();
    }

    onMount(() => {
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    });
</script>

<Head
    title="Worlds Scouting | FTC Stats"
    description="EPA analytics and scouting data for FIRST Tech Challenge World Championship participants."
/>

<WidthProvider width={"1400px"}>
    <PageShell railWidth="320px">
        <div slot="rail" class="rail">
            <Card style="margin: 0;">
                <div class="rail-title">
                    <p class="eyebrow">{$t("worlds.eyebrow", "World Championship")}</p>
                    <h1>{$t("worlds.rail.title", "Filters")}</h1>
                </div>

                <div class="filter-group">
                    <label for="season-select">
                        {$t("form.season", "Season")}
                        <SeasonSelect bind:season nonForm id="season-select" />
                    </label>
                </div>

                <div class="filter-group">
                    <label for="division-select">
                        {$t("worlds.division", "Division")}
                        <Select
                            bind:value={division}
                            options={divisionOptions}
                            nonForm
                            name="division"
                            id="division-select"
                        />
                    </label>
                </div>
            </Card>

            <Card style="margin: 0; margin-top: var(--lg-gap);">
                <div class="rail-title">
                    <p class="eyebrow">{$t("worlds.summary", "Summary")}</p>
                </div>

                <div class="stat-cards">
                    <div class="stat-card">
                        <span class="stat-value">{totalTeams}</span>
                        <span class="stat-label">
                            {$t("worlds.total-teams", "Total Teams")}
                        </span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{regionsRepresented}</span>
                        <span class="stat-label">
                            {$t("worlds.regions", "Regions")}
                        </span>
                    </div>
                </div>

                {#if seasonStats}
                    <div class="stat-cards" style="margin-top: var(--md-gap);">
                        <div class="stat-card">
                            <span class="stat-value">
                                {seasonStats.epa_max?.toFixed(1) ?? "--"}
                            </span>
                            <span class="stat-label">
                                {$t("worlds.max-epa", "Max EPA")}
                            </span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">
                                {seasonStats.epa_p50?.toFixed(1) ?? "--"}
                            </span>
                            <span class="stat-label">
                                {$t("worlds.median-epa", "Median EPA")}
                            </span>
                        </div>
                    </div>
                {/if}
            </Card>
        </div>

        <div class="main-content">
            <div class="page-header">
                <h1>{$t("worlds.title", "Worlds Scouting")}</h1>
                <p class="description">
                    {$t(
                        "worlds.description",
                        "EPA analytics for World Championship participants. Compare teams across Auto, Driver-Controlled, and Endgame performance metrics."
                    )}
                </p>
            </div>

            {#if error}
                <Card style="margin: 0;">
                    <div class="error-state">
                        <p>{error}</p>
                    </div>
                </Card>
            {:else if loading}
                <Card style="margin: 0;">
                    <div class="loading-state">
                        <p>{$t("common.loading", "Loading...")}</p>
                    </div>
                </Card>
            {:else}
                <div class="chart-wrapper">
                    <div bind:this={chartContainer} class="chart-container"></div>
                    <p class="chart-note">
                        {$t(
                            "worlds.chart.note",
                            "Bubble size represents Total EPA. Click and drag to zoom. Double-click to reset."
                        )}
                    </p>
                </div>

                <Card style="margin: 0; margin-top: var(--lg-gap);">
                    <div class="table-header">
                        <h2>{$t("worlds.rankings", "EPA Rankings")}</h2>
                        <span class="team-count">
                            {totalTeams}
                            {$t("worlds.teams-shown", "teams")}
                        </span>
                    </div>

                    <div class="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        class="sortable"
                                        class:active={sortColumn === "rank"}
                                        on:click={() => toggleSort("rank")}
                                    >
                                        {$t("worlds.col.rank", "Rank")}
                                        {#if sortColumn === "rank"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable"
                                        class:active={sortColumn === "team_number"}
                                        on:click={() => toggleSort("team_number")}
                                    >
                                        {$t("worlds.col.team", "Team #")}
                                        {#if sortColumn === "team_number"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable name-col"
                                        class:active={sortColumn === "name"}
                                        on:click={() => toggleSort("name")}
                                    >
                                        {$t("worlds.col.name", "Name")}
                                        {#if sortColumn === "name"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable numeric"
                                        class:active={sortColumn === "epa_total"}
                                        on:click={() => toggleSort("epa_total")}
                                    >
                                        {$t("worlds.col.total-epa", "Total EPA")}
                                        {#if sortColumn === "epa_total"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable numeric"
                                        class:active={sortColumn === "epa_auto"}
                                        on:click={() => toggleSort("epa_auto")}
                                    >
                                        {$t("worlds.col.auto-epa", "Auto EPA")}
                                        {#if sortColumn === "epa_auto"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable numeric"
                                        class:active={sortColumn === "epa_dc"}
                                        on:click={() => toggleSort("epa_dc")}
                                    >
                                        {$t("worlds.col.dc-epa", "DC EPA")}
                                        {#if sortColumn === "epa_dc"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable numeric"
                                        class:active={sortColumn === "epa_endgame"}
                                        on:click={() => toggleSort("epa_endgame")}
                                    >
                                        {$t("worlds.col.endgame-epa", "Endgame EPA")}
                                        {#if sortColumn === "epa_endgame"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                    <th
                                        class="sortable numeric"
                                        class:active={sortColumn === "norm_epa"}
                                        on:click={() => toggleSort("norm_epa")}
                                    >
                                        {$t("worlds.col.norm-epa", "Norm EPA")}
                                        {#if sortColumn === "norm_epa"}
                                            <span class="sort-arrow">
                                                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                                            </span>
                                        {/if}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each sortedRankings as team, i (team.team_number)}
                                    <tr>
                                        <td class="rank-cell">
                                            {team.total_epa_rank ?? i + 1}
                                        </td>
                                        <td class="team-number">
                                            <a href="/teams/{team.team_number}">
                                                {team.team_number}
                                            </a>
                                        </td>
                                        <td class="name-col">
                                            {team.name ?? "--"}
                                        </td>
                                        <td
                                            class="numeric epa-value"
                                            style="color: {epaColor(team.epa_total, epaMax)}"
                                        >
                                            {team.epa_total?.toFixed(1) ?? "--"}
                                        </td>
                                        <td
                                            class="numeric epa-value"
                                            style="color: {epaColor(team.epa_auto, epaMax * 0.5)}"
                                        >
                                            {team.epa_auto?.toFixed(1) ?? "--"}
                                        </td>
                                        <td
                                            class="numeric epa-value"
                                            style="color: {epaColor(team.epa_dc, epaMax * 0.5)}"
                                        >
                                            {team.epa_dc?.toFixed(1) ?? "--"}
                                        </td>
                                        <td
                                            class="numeric epa-value"
                                            style="color: {epaColor(team.epa_endgame, epaMax * 0.3)}"
                                        >
                                            {team.epa_endgame?.toFixed(1) ?? "--"}
                                        </td>
                                        <td class="numeric epa-value">
                                            {team.norm_epa?.toFixed(3) ?? "--"}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </Card>
            {/if}
        </div>
    </PageShell>
</WidthProvider>

<style>
    /* -- Rail styles -- */
    .rail-title {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    .eyebrow {
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
        color: var(--theme-color);
    }

    .rail h1 {
        margin-top: var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    .filter-group {
        margin-bottom: var(--md-gap);
    }

    .filter-group label {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        font-size: var(--md-font-size);
        font-weight: 600;
    }

    .stat-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--md-gap);
    }

    .stat-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--md-pad);
        background: var(--bg-color);
        border: 1px solid var(--sep-color);
        border-radius: var(--card-radius);
        gap: var(--xs-gap);
    }

    .stat-value {
        font-size: var(--xl-font-size);
        font-weight: 700;
        color: var(--theme-color);
    }

    .stat-label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        text-align: center;
    }

    /* -- Main content styles -- */
    .main-content {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .page-header {
        margin-bottom: var(--sm-gap);
    }

    .page-header h1 {
        font-size: var(--xxl-font-size);
        margin-bottom: var(--sm-gap);
    }

    .description {
        color: var(--secondary-text-color);
        font-size: var(--md-font-size);
        line-height: 1.6;
    }

    /* -- Chart styles -- */
    .chart-wrapper {
        width: 100%;
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: var(--card-radius);
    }

    .chart-container {
        width: 100%;
        min-height: 500px;
    }

    .chart-note {
        margin-top: var(--md-gap);
        text-align: center;
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        font-style: italic;
    }

    /* -- Table styles -- */
    .table-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--md-gap);
    }

    .table-header h2 {
        font-size: var(--lg-font-size);
    }

    .team-count {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .table-scroll {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--md-font-size);
    }

    thead {
        position: sticky;
        top: 0;
        z-index: 1;
    }

    th {
        padding: var(--sm-pad) var(--md-pad);
        text-align: left;
        font-weight: 600;
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text-color);
        border-bottom: 2px solid var(--sep-color);
        background: var(--fg-color);
        white-space: nowrap;
        user-select: none;
    }

    th.sortable {
        cursor: pointer;
    }

    th.sortable:hover {
        color: var(--theme-color);
    }

    th.active {
        color: var(--theme-color);
    }

    .sort-arrow {
        font-size: 10px;
        margin-left: 4px;
    }

    th.numeric,
    td.numeric {
        text-align: right;
    }

    td {
        padding: var(--sm-pad) var(--md-pad);
        border-bottom: 1px solid var(--sep-color);
        white-space: nowrap;
    }

    tr:hover {
        background: var(--hover-color);
    }

    .rank-cell {
        font-weight: 600;
        color: var(--secondary-text-color);
        width: 4ch;
    }

    .team-number a {
        color: var(--theme-color);
        font-weight: 600;
        text-decoration: none;
    }

    .team-number a:hover {
        text-decoration: underline;
    }

    .name-col {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .epa-value {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    /* -- EPA color variables -- */
    :global(:root) {
        --epa-high: #4caf50;
        --epa-mid: var(--text-color);
        --epa-low: #f44336;
    }

    /* -- States -- */
    .loading-state,
    .error-state {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--xl-pad);
        color: var(--secondary-text-color);
    }

    .error-state {
        color: #f44336;
    }
</style>
