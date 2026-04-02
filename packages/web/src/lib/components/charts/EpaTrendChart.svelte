<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type * as HighchartsType from "highcharts";
    import { t } from "$lib/i18n";

    export let teamData: Array<{
        teamNumber: number;
        teamName: string;
        matches: Array<{
            matchId: string;
            eventCode: string;
            epaPre: number;
            epaPost: number;
        }>;
    }>;

    type HighchartsModule = typeof import("highcharts");
    let chartContainer: HTMLDivElement;
    let chart: HighchartsType.Chart | null = null;

    $: chartTitle = $t("charts.epa.trends.title", "Team EPA Progression");
    $: yAxisTitle = $t("charts.epa.trends.y", "EPA (Expected Points Added)");

    const teamColors = [
        "rgb(245, 126, 37)",
        "rgb(33, 150, 243)",
        "rgb(244, 67, 54)",
        "rgb(76, 175, 80)",
        "rgb(156, 39, 176)",
        "rgb(255, 152, 0)",
    ];

    async function loadHighcharts(): Promise<HighchartsModule | null> {
        if (!browser) return null;
        const highchartsModule = await import("highcharts");
        return (highchartsModule as { default?: HighchartsModule }).default ?? highchartsModule;
    }

    onMount(async () => {
        if (!chartContainer || teamData.length === 0) return;
        const Highcharts = await loadHighcharts();
        if (!Highcharts) return;

        const series = teamData.map((team, idx) => ({
            name: `${team.teamNumber} - ${team.teamName}`,
            data: team.matches.map((m, i) => ({
                x: i,
                y: m.epaPost,
                name: `${m.eventCode} ${m.matchId}`,
            })),
            color: teamColors[idx % teamColors.length],
            marker: { enabled: true, radius: 3 },
        }));

        chart = Highcharts.chart(chartContainer, {
            chart: { type: "line", backgroundColor: "transparent", height: 400 },
            title: {
                text: chartTitle,
                style: { color: "var(--text-color)", fontSize: "18px", fontWeight: "600" },
            },
            xAxis: {
                title: { text: "Match #", style: { color: "var(--text-color)" } },
                labels: { style: { color: "var(--text-color)" } },
                gridLineColor: "var(--sep-color)",
            },
            yAxis: {
                title: { text: yAxisTitle, style: { color: "var(--text-color)" } },
                labels: { style: { color: "var(--text-color)" } },
                gridLineColor: "var(--sep-color)",
            },
            tooltip: {
                shared: false,
                useHTML: true,
                backgroundColor: "var(--fg-color)",
                borderColor: "var(--sep-color)",
                style: { color: "var(--text-color)" },
                formatter: function () {
                    const point = this.point as any;
                    return `<div style="padding: 8px;">
                        <strong>${this.series.name}</strong><br/>
                        <strong>${point.name}</strong><br/>
                        EPA: <strong>${point.y?.toFixed(1)}</strong>
                    </div>`;
                },
            },
            legend: {
                enabled: true,
                itemStyle: { color: "var(--text-color)" },
                itemHoverStyle: { color: "var(--theme-color)" },
            },
            plotOptions: {
                line: { lineWidth: 2, states: { hover: { lineWidth: 3 } } },
            },
            series: series as any,
            credits: { enabled: false },
        });

        return () => {
            if (chart) chart.destroy();
        };
    });
</script>

<div class="chart-wrapper">
    <div bind:this={chartContainer} class="chart-container"></div>
</div>

<style>
    .chart-wrapper {
        width: 100%;
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: var(--card-radius);
    }
    .chart-container {
        width: 100%;
        min-height: 400px;
    }
</style>
