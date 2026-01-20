<script lang="ts">
    import { DESCRIPTORS, type Season } from "@ftc-stats/common";
    import Card from "$lib/components/Card.svelte";
    import BubbleChart from "$lib/components/charts/BubbleChart.svelte";
    import { prettyPrintFloat } from "$lib/printers/number";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";

    type TeamEntry = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];

    export let teams: TeamEntry[];
    export let season: Season;
    export let eventName: string;

    function getOprNumber(stats: any, key: string): number | null {
        if (!stats || !("opr" in stats) || !stats.opr) return null;
        const value = stats.opr?.[key];
        return typeof value == "number" ? value : null;
    }

    function getTotalOpr(stats: any, season: Season): number | null {
        if (!stats || !("opr" in stats) || !stats.opr) return null;
        const opr = stats.opr as Record<string, number | null | undefined>;
        if (DESCRIPTORS[season].pensSubtract || !("totalPointsNp" in opr)) {
            return typeof opr.totalPoints == "number" ? opr.totalPoints : null;
        }
        return typeof opr.totalPointsNp == "number" ? opr.totalPointsNp : opr.totalPoints ?? null;
    }

    $: bubbleTeams =
        teams
            ?.map((teamEvent) => {
                const totalOPR = getTotalOpr(teamEvent.stats, season);
                if (totalOPR == null) return null;
                const autoOPR = getOprNumber(teamEvent.stats, "autoPoints") ?? 0;
                const teleopOPR = getOprNumber(teamEvent.stats, "dcPoints") ?? 0;
                return {
                    teamNumber: teamEvent.teamNumber,
                    teamName: teamEvent.team?.name ?? `Team ${teamEvent.teamNumber}`,
                    autoOPR,
                    teleopOPR,
                    totalOPR,
                };
            })
            .filter((team): team is NonNullable<typeof team> => team != null) ?? [];

    $: topTeams = [...bubbleTeams].sort((a, b) => b.totalOPR - a.totalOPR).slice(0, 12);
</script>

<Card>
    <h2>Event Figures</h2>
    <p class="subtitle">
        OPR-based visuals for {eventName}. Auto vs. teleop OPR is plotted with bubble size set to
        total OPR.
    </p>
</Card>

{#if bubbleTeams.length > 0}
    <BubbleChart
        teams={bubbleTeams}
        xAxisLabel="Teleop OPR"
        yAxisLabel="Auto OPR"
        title={`${eventName} - Auto vs Teleop OPR`}
    />

    <Card>
        <h3>Top OPR Teams</h3>
        <table class="top-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Total OPR</th>
                    <th>Auto OPR</th>
                    <th>Teleop OPR</th>
                </tr>
            </thead>
            <tbody>
                {#each topTeams as team, idx}
                    <tr>
                        <td>{idx + 1}</td>
                        <td>
                            {team.teamNumber}
                            <span class="team-name">{team.teamName}</span>
                        </td>
                        <td>{prettyPrintFloat(team.totalOPR)}</td>
                        <td>{prettyPrintFloat(team.autoOPR)}</td>
                        <td>{prettyPrintFloat(team.teleopOPR)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </Card>
{:else}
    <Card>
        <p>No OPR data is available for this event yet.</p>
    </Card>
{/if}

<style>
    h2 {
        margin-bottom: var(--sm-gap);
    }

    .subtitle {
        color: var(--secondary-text-color);
    }

    h3 {
        margin-bottom: var(--md-gap);
    }

    .top-table {
        width: 100%;
        border-collapse: collapse;
    }

    .top-table th,
    .top-table td {
        padding: var(--sm-pad);
        text-align: left;
        border-bottom: 1px solid var(--sep-color);
    }

    .team-name {
        color: var(--secondary-text-color);
        margin-left: var(--sm-gap);
        font-size: var(--sm-font-size);
    }
</style>
