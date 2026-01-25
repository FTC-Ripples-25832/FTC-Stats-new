<script lang="ts">
    import ViewStatsSection from "./ViewStatsSection.svelte";
    import Modal from "../../Modal.svelte";
    import type { StatSet } from "@ftc-stats/common";
    import { t } from "$lib/i18n";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let shown = false;
</script>

<Modal bind:shown titleText={$t("stats.statistics", "Statistics")}>
    {#each stats.sections as section}
        <ViewStatsSection {data} {stats} {section} />
    {/each}
</Modal>
