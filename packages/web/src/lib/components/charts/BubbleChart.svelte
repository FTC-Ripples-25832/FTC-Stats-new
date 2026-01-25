<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type * as HighchartsType from "highcharts";
    import { t } from "$lib/i18n";

    export let teams: Array<{
        teamNumber: number;
        teamName: string;
        autoOPR: number;
        teleopOPR: number;
        totalOPR: number;
    }>;

    export let xAxisLabel: string | null = null;
    export let yAxisLabel: string | null = null;
    export let title: string | null = null;

    $: resolvedXAxisLabel = xAxisLabel ?? $t("charts.opr.teleop", "Teleop OPR");
    $: resolvedYAxisLabel = yAxisLabel ?? $t("charts.opr.auto", "Auto OPR");
    $: resolvedTitle = title ?? $t("charts.opr.comparison", "Team Performance Comparison");
    $: teamLabel = $t("common.team", "Team");
    $: totalOprLabel = $t("charts.opr.total", "Total OPR");
    $: chartNote = $t(
        "charts.bubble.note",
        "Bubble size represents total OPR. Click and drag to zoom. Double-click to reset."
    );

    let chartContainer: HTMLDivElement;
    type HighchartsModule = typeof import("highcharts");
    let chart: HighchartsType.Chart | null = null;

    async function loadHighcharts(): Promise<HighchartsModule | null> {
        if (!browser) return null;
        const highchartsModule = await import("highcharts");
        const Highcharts =
            (highchartsModule as { default?: HighchartsModule }).default ?? highchartsModule;
        const highchartsMoreModule = await import("highcharts/highcharts-more");
        const HighchartsMore =
            (highchartsMoreModule as { default?: (h: HighchartsModule) => void }).default ??
            (highchartsMoreModule as (h: HighchartsModule) => void);
        if (typeof HighchartsMore === "function") {
            HighchartsMore(Highcharts);
        }
        return Highcharts;
    }

    onMount(async () => {
        if (!chartContainer || teams.length === 0) return;
        const Highcharts = await loadHighcharts();
        if (!Highcharts) return;

        // Prepare bubble data
        const bubbleData = teams.map((team) => ({
            x: team.teleopOPR,
            y: team.autoOPR,
            z: team.totalOPR,
            name: `${team.teamNumber}`,
            teamName: team.teamName,
        }));

        // Create chart
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
                text: resolvedTitle,
                style: {
                    color: "var(--text-color)",
                    fontSize: "18px",
                    fontWeight: "600",
                },
            },
            xAxis: {
                title: {
                    text: resolvedXAxisLabel,
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
                    text: resolvedYAxisLabel,
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
                            <strong>${teamLabel} ${point.name}</strong><br/>
                            ${point.teamName}<br/><br/>
                            ${resolvedXAxisLabel}: <strong>${point.x.toFixed(2)}</strong><br/>
                            ${resolvedYAxisLabel}: <strong>${point.y.toFixed(2)}</strong><br/>
                            ${totalOprLabel}: <strong>${point.z.toFixed(2)}</strong>
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
                    color: "rgba(245, 126, 37, 0.6)", // FIRST orange with transparency
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

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    });
</script>

<div class="chart-wrapper">
    <div bind:this={chartContainer} class="chart-container"></div>
    <p class="chart-note">
        {chartNote}
    </p>
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
        min-height: 500px;
    }

    .chart-note {
        margin-top: var(--md-gap);
        text-align: center;
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        font-style: italic;
    }
</style>
