<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type * as HighchartsType from "highcharts";

    export let title = "";
    export let yLabel = "";
    export let seriesName = "";
    export let points: Array<{ season: number; value: number }> = [];
    export let series:
        | Array<{
              name: string;
              points: Array<{ season: number; value: number | null }>;
              color?: string;
              yAxis?: number;
          }>
        | null = null;
    export let yAxes:
        | Array<{ title: string; min?: number; max?: number; opposite?: boolean }>
        | null = null;

    type HighchartsModule = typeof import("highcharts");
    let chartContainer: HTMLDivElement;
    let chart: HighchartsType.Chart | null = null;
    const defaultColors = [
        "var(--theme-color)",
        "var(--blue-team-text-color)",
        "var(--red-team-text-color)",
    ];

    $: resolvedSeries =
        series && series.length
            ? series
            : [
                  {
                      name: seriesName,
                      points,
                      color: defaultColors[0],
                      yAxis: 0,
                  },
              ];

    $: resolvedAxes =
        yAxes && yAxes.length ? yAxes : [{ title: yLabel }];

    async function loadHighcharts(): Promise<HighchartsModule | null> {
        if (!browser) return null;
        const highchartsModule = await import("highcharts");
        return (highchartsModule as { default?: HighchartsModule }).default ?? highchartsModule;
    }

    async function renderChart() {
        if (!chartContainer) return;
        const Highcharts = await loadHighcharts();
        if (!Highcharts) return;

        const seasons = Array.from(
            new Set(resolvedSeries.flatMap((s) => s.points.map((p) => p.season)))
        ).sort((a, b) => a - b);
        const categories = seasons.map((s) => s.toString());

        const chartSeries = resolvedSeries.map((s, index) => {
            const bySeason = new Map(s.points.map((p) => [p.season, p.value]));
            return {
                name: s.name,
                data: seasons.map((season) => bySeason.get(season) ?? null),
                color: s.color ?? defaultColors[index % defaultColors.length],
                yAxis: s.yAxis ?? 0,
                marker: { enabled: true, radius: 4 },
            } as any;
        });

        const chartAxes = resolvedAxes.map((axis) => ({
            title: {
                text: axis.title,
                style: { color: "var(--text-color)" },
            },
            labels: {
                style: { color: "var(--text-color)" },
            },
            gridLineColor: "var(--sep-color)",
            min: axis.min,
            max: axis.max,
            opposite: axis.opposite ?? false,
        }));

        if (!chart) {
            chart = Highcharts.chart(chartContainer, {
                chart: {
                    type: "line",
                    backgroundColor: "transparent",
                    height: 360,
                },
                title: {
                    text: title,
                    style: {
                        color: "var(--text-color)",
                        fontSize: "18px",
                        fontWeight: "600",
                    },
                },
                xAxis: {
                    categories,
                    title: {
                        text: "Season",
                        style: { color: "var(--text-color)" },
                    },
                    labels: {
                        style: { color: "var(--text-color)" },
                    },
                    gridLineColor: "var(--sep-color)",
                },
                yAxis: chartAxes.length > 1 ? chartAxes : chartAxes[0],
                tooltip: {
                    shared: false,
                    backgroundColor: "var(--fg-color)",
                    borderColor: "var(--sep-color)",
                    style: {
                        color: "var(--text-color)",
                    },
                },
                legend: {
                    enabled: chartSeries.length > 1,
                },
                series: chartSeries,
                credits: { enabled: false },
            });
            return;
        }

        chart.update(
            {
                xAxis: {
                    categories,
                    title: {
                        text: "Season",
                        style: { color: "var(--text-color)" },
                    },
                    labels: {
                        style: { color: "var(--text-color)" },
                    },
                    gridLineColor: "var(--sep-color)",
                },
                yAxis: chartAxes.length > 1 ? chartAxes : chartAxes[0],
                series: chartSeries,
                legend: { enabled: chartSeries.length > 1 },
            },
            true,
            true
        );
    }

    onMount(() => {
        renderChart();
        return () => {
            chart?.destroy();
            chart = null;
        };
    });

    $: if (browser && chart) {
        renderChart();
    }
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
        min-height: 360px;
    }
</style>
