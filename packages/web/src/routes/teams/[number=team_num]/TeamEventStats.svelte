<script lang="ts">
    import { faTrophy } from "@fortawesome/free-solid-svg-icons";
    import InfoIconRow from "$lib/components/InfoIconRow.svelte";
    import type { TeamQuery } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintFloat, prettyPrintOrdinal } from "$lib/printers/number";
    import { DESCRIPTORS, type Season } from "@ftc-stats/common";
    import { t } from "$lib/i18n";

    type Stats = NonNullable<TeamQuery["teamByNumber"]>["events"][number]["stats"];

    export let season: Season;
    export let remote: boolean;
    export let stats: Stats | undefined;

    const rpFormat = prettyPrintFloat;
    $: hasOpr = stats && "opr" in stats;
    $: hasAvg = stats && "avg" in stats;
    $: np = DESCRIPTORS[season].pensSubtract || remote ? "" : "np";
    $: placeLabel = $t("stats.place", "place");
    $: qualsLabel = $t("stats.quals", "quals");
    $: recordLabel = $t("stats.record-label", "W-L-T");
    $: rpLabel = $t("stats.rp", "RP");
</script>

{#if stats}
    <InfoIconRow icon={faTrophy}>
        <b>{prettyPrintOrdinal(stats.rank)}</b> {placeLabel} ({qualsLabel})
    </InfoIconRow>

    {#if "wins" in stats}
        <InfoIconRow>
            {recordLabel}: <b>{stats.wins}-{stats.losses}-{stats.ties}</b>
        </InfoIconRow>
    {/if}

    <InfoIconRow>
        {#if "rp" in stats}
            <b>{rpFormat(stats.rp)}</b> {rpLabel} {hasOpr || hasAvg ? " · " : ""}
        {/if}
        {#if "opr" in stats}
            {@const opr =
                "totalPoints" in stats.opr ? stats.opr.totalPoints : stats.opr.totalPointsNp}
            <b>{prettyPrintFloat(opr)}</b>
            {np}OPR {hasAvg ? " · " : ""}
        {/if}
        {#if "avg" in stats}
            {@const avg =
                "totalPoints" in stats.avg ? stats.avg.totalPoints : stats.avg.totalPointsNp}
            <b>{prettyPrintFloat(avg)}</b>
            {np}AVG
        {/if}
    </InfoIconRow>
{/if}
