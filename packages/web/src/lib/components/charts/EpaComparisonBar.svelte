<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type * as HighchartsType from "highcharts";
    import { t } from "$lib/i18n";

    export let teams: Array<{
        teamNumber: number;
        teamName: string;
        epaTotal: number;
        epaAuto: number;
        epaDc: number;
        epaEndgame: number;
    }>;

    export let title: string = "EPA Comparison";

    type HighchartsModule = typeof import("highcharts");
    let chartContainer: HTMLDivElement;
    let chart: HighchartsType.Chart | null = null;

    const componentColors = {
        total: "rgb(245, 126, 37)",
        auto: "rgb(33, 150, 243)",
        dc: "rgb(76, 175, 80)",
        endgame: "rgb(156, 39, 176)",
    };

    async function loadHighcharts(): Promise<HighchartsModule | null> {
        if (!browser) return null;
        const highchartsModule = await import("highcharts");
        return (highchartsModule as { default?: HighchartsModule }).default ?? highchartsModule;
    }

    onMount(async () => {
        if (!chartContainer || teams.length === 0) return;
        const Highcharts = await loadHighcharts();
        if (!Highcharts) return;

        const categories = teams.map((t) => `${t.teamNumber}`);

        chart = Highcharts.chart(chartContainer, {
            chart: { type: "bar", backgroundColor: "transparent", height: Math.max(300, teams.length * 80 + 100) },
            title: {
                text: title,
                style: { color: "var(--text-color)", fontSize: "18px", fontWeight: "600" },
            },
            xAxis: {
                categories,
                title: { text: null },
                labels: { style: { color: "var(--text-color)" } },
                gridLineColor: "var(--sep-color)",
            },
            yAxis: {
                min: 0,
                title: { text: $t("charts.epa.value", "EPA Value"), style: { color: "var(--text-color)" } },
                labels: { style: { color: "var(--text-color)" } },
                gridLineColor: "var(--sep-color)",
            },
            tooltip: {
                shared: true,
                useHTML: true,
                backgroundColor: "var(--fg-color)",
                borderColor: "var(--sep-color)",
                style: { color: "var(--text-color)" },
            },
            legend: {
                enabled: true,
                itemStyle: { color: "var(--text-color)" },
                itemHoverStyle: { color: "var(--theme-color)" },
            },
            plotOptions: {
                bar: { groupPadding: 0.1, pointPadding: 0.05, borderWidth: 0 },
            },
            series: [
                { name: "Total", data: teams.map((t) => t.epaTotal), color: componentColors.total },
                { name: "Auto", data: teams.map((t) => t.epaAuto), color: componentColors.auto },
                { name: "DC", data: teams.map((t) => t.epaDc), color: componentColors.dc },
                { name: "Endgame", data: teams.map((t) => t.epaEndgame), color: componentColors.endgame },
            ] as any,
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
        min-height: 300px;
    }
</style>
