<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type * as HighchartsType from "highcharts";

    export let teamData: Array<{
        teamNumber: number;
        teamName: string;
        events: Array<{
            eventName: string;
            opr: number;
            date: string;
        }>;
    }>;

    type HighchartsModule = typeof import("highcharts");
    let chartContainer: HTMLDivElement;
    let chart: HighchartsType.Chart | null = null;

    // Generate colors for teams (using theme colors)
    const teamColors = [
        "rgb(245, 126, 37)", // FIRST orange
        "rgb(33, 150, 243)", // Blue
        "rgb(244, 67, 54)", // Red
        "rgb(76, 175, 80)", // Green
        "rgb(156, 39, 176)", // Purple
        "rgb(255, 152, 0)", // Amber
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

        // Prepare series data
        const series = teamData.map((team, idx) => ({
            name: `${team.teamNumber} - ${team.teamName}`,
            data: team.events.map((event) => ({
                x: new Date(event.date).getTime(),
                y: event.opr,
                name: event.eventName,
            })),
            color: teamColors[idx % teamColors.length],
            marker: {
                enabled: true,
                radius: 4,
            },
        }));

        // Create chart
        chart = Highcharts.chart(chartContainer, {
            chart: {
                type: "line",
                backgroundColor: "transparent",
                height: 400,
            },
            title: {
                text: "Team OPR Trends",
                style: {
                    color: "var(--text-color)",
                    fontSize: "18px",
                    fontWeight: "600",
                },
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: "Event Date",
                    style: { color: "var(--text-color)" },
                },
                labels: {
                    style: { color: "var(--text-color)" },
                },
                gridLineColor: "var(--sep-color)",
            },
            yAxis: {
                title: {
                    text: "OPR (Offensive Power Rating)",
                    style: { color: "var(--text-color)" },
                },
                labels: {
                    style: { color: "var(--text-color)" },
                },
                gridLineColor: "var(--sep-color)",
            },
            tooltip: {
                shared: false,
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
                            <strong>${this.series.name}</strong><br/>
                            <strong>${point.name}</strong><br/>
                            OPR: <strong>${point.y.toFixed(2)}</strong><br/>
                            ${Highcharts.dateFormat("%b %e, %Y", this.x as number)}
                        </div>
                    `;
                },
            },
            legend: {
                enabled: true,
                itemStyle: {
                    color: "var(--text-color)",
                },
                itemHoverStyle: {
                    color: "var(--theme-color)",
                },
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3,
                        },
                    },
                },
            },
            series: series as any,
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
</div>

<style>
    .chart-wrapper {
        width: 100%;
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;
    }

    .chart-container {
        width: 100%;
        min-height: 400px;
    }
</style>
