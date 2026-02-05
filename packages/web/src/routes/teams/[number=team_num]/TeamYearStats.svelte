<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import SeasonTrendChart from "$lib/components/charts/SeasonTrendChart.svelte";
    import type { TeamQuery } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintFloat, prettyPrintOrdinal } from "$lib/printers/number";
    import { t } from "$lib/i18n";

    type QuickStats = NonNullable<TeamQuery["teamByNumber"]>["quickStatsBySeason"][number];

    export let stats: QuickStats[] = [];

    $: rows = [...stats]
        .filter((s) => !!s && !!s.tot && s.count != null)
        .sort((a, b) => a.season - b.season);

    $: points = rows
        .filter((row) => row.tot?.value != null)
        .map((row) => ({
            season: row.season,
            value: row.tot.value,
        }));

    const percent = (rank: number | null | undefined, count: number | null | undefined) => {
        if (!rank || !count || count <= 1) return null;
        return Math.max(0, Math.min(100, (1 - (rank - 1) / (count - 1)) * 100));
    };

    $: chartTitle = $t("teams.stats.chart", "OPR Over Time");
    $: chartLabel = $t("stats.opr", "OPR");
    $: worldPercentileLabel = $t("teams.world-percentile", "World Percentile");
    $: tableTitle = $t("teams.stats.table", "Yearly Summary");
    $: seasonLabel = $t("common.season", "Season");
    $: oprLabel = $t("stats.opr", "OPR");
    $: rankLabel = $t("teams.world-rank", "World Rank");
    $: percentileLabel = worldPercentileLabel;

    $: worldPercentilePoints = rows
        .map((row) => {
            const pct = percent(row.tot?.rank, row.count);
            if (pct == null) return null;
            return { season: row.season, value: pct };
        })
        .filter((row): row is { season: number; value: number } => row != null);
</script>

<Card style="margin-top: var(--lg-gap);">
    <h2>{tableTitle}</h2>

    {#if points.length}
        <SeasonTrendChart
            title={chartTitle}
            yLabel={chartLabel}
            seriesName={chartLabel}
            {points}
            series={[
                { name: chartLabel, points, yAxis: 0, color: "var(--theme-color)" },
                {
                    name: worldPercentileLabel,
                    points: worldPercentilePoints,
                    yAxis: 1,
                    color: "var(--blue-team-text-color)",
                },
            ]}
            yAxes={[
                { title: chartLabel },
                { title: worldPercentileLabel, min: 0, max: 100, opposite: true },
            ]}
        />
    {/if}

    {#if rows.length}
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>{seasonLabel}</th>
                        <th>{oprLabel}</th>
                        <th>{rankLabel}</th>
                        <th>{percentileLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each rows as row}
                        {@const pct = percent(row.tot?.rank, row.count)}
                        <tr>
                            <td>{row.season}</td>
                            <td>
                                {row.tot?.value != null ? prettyPrintFloat(row.tot.value) : "-"}
                            </td>
                            <td>
                                {row.tot?.rank != null ? prettyPrintOrdinal(row.tot.rank) : "-"}
                            </td>
                            <td>{pct != null ? `${prettyPrintFloat(pct)}%` : "-"}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <p class="muted">{$t("teams.stats.none", "No multi-season stats available.")}</p>
    {/if}
</Card>

<style>
    h2 {
        margin-top: 0;
        margin-bottom: var(--md-gap);
    }

    .table-wrap {
        overflow-x: auto;
        margin-top: var(--md-gap);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: var(--sm-pad) var(--md-pad);
        border-bottom: 1px solid var(--sep-color);
        text-align: left;
        white-space: nowrap;
    }

    .muted {
        color: var(--secondary-text-color);
    }
</style>
