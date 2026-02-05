<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import InfoIconRow from "$lib/components/InfoIconRow.svelte";
    import { faChartBar, faMedal } from "@fortawesome/free-solid-svg-icons";
    import type { TeamQuery } from "$lib/graphql/generated/graphql-operations";
    import { DESCRIPTORS, type Season } from "@ftc-stats/common";
    import { t } from "$lib/i18n";
    import OprBreakdownChips from "./OprBreakdownChips.svelte";
    import RankCard from "./RankCard.svelte";

    type TeamData = NonNullable<TeamQuery["teamByNumber"]>;

    export let team: TeamData;
    export let season: Season;

    const npSuffix = (season: Season) => (DESCRIPTORS[season].pensSubtract ? "" : "NP");

    $: events = team.events ?? [];
    $: record = events.reduce(
        (acc, event) => {
            const stats = event.stats as any;
            if (stats && "wins" in stats && stats.wins != null) {
                acc.wins += stats.wins ?? 0;
                acc.losses += stats.losses ?? 0;
                acc.ties += stats.ties ?? 0;
            }
            return acc;
        },
        { wins: 0, losses: 0, ties: 0 }
    );
    $: matchesPlayed = record.wins + record.losses + record.ties;

    $: summaryLabel = $t("teams.summary", "Season Summary");
    $: breakdownLabel = $t("teams.opr-breakdown", "OPR Breakdown");
    $: recordLabel = $t("teams.record", "Record");
    $: oprLabel = $t("stats.opr", "OPR");
    $: worldLabel = $t("teams.rank.world", "Worldwide");
    $: countryLabel = team.location.country || $t("teams.rank.country", "Country");
    $: stateLabel = team.location.state || $t("teams.rank.state", "State");

    $: quickStats = team.quickStats;
    $: locationStats = team.locationQuickStats;

    $: worldStats = locationStats?.world ?? quickStats;
    $: countryStats = locationStats?.country ?? null;
    $: stateStats = locationStats?.state ?? null;
</script>

<Card style="margin-bottom: var(--lg-gap);">
    <h2>{summaryLabel}</h2>

    {#if matchesPlayed > 0}
        <InfoIconRow icon={faMedal}>
            {recordLabel}: <b>{record.wins}-{record.losses}-{record.ties}</b>
        </InfoIconRow>
    {/if}

    {#if quickStats}
        <InfoIconRow icon={faChartBar}>
            {breakdownLabel} ({npSuffix(season)}{oprLabel})
        </InfoIconRow>
        <OprBreakdownChips
            auto={quickStats.auto.value}
            teleop={quickStats.dc.value}
            endgame={quickStats.eg.value}
            total={quickStats.tot.value}
        />
    {/if}

    {#if worldStats}
        <div class="rank-row">
            <RankCard label={worldLabel} rank={worldStats.tot?.rank} count={worldStats.count} />
            {#if countryStats}
                <RankCard
                    label={countryLabel}
                    rank={countryStats.tot?.rank}
                    count={countryStats.count}
                />
            {/if}
            {#if stateStats}
                <RankCard label={stateLabel} rank={stateStats.tot?.rank} count={stateStats.count} />
            {/if}
        </div>
    {/if}

    {#if !quickStats && matchesPlayed == 0}
        <p class="muted">
            {$t("teams.summary.none", "No season stats available yet.")}
        </p>
    {/if}
</Card>

<style>
    h2 {
        margin-top: 0;
        margin-bottom: var(--md-gap);
    }

    .rank-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--md-gap);
        margin-top: var(--md-gap);
    }

    .muted {
        color: var(--secondary-text-color);
    }
</style>
