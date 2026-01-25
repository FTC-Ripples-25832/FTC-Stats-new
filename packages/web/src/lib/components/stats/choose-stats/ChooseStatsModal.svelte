<script lang="ts">
    import ChooseStatsSection from "./ChooseStatsSection.svelte";
    import Modal from "../../Modal.svelte";
    import type { StatSet } from "@ftc-stats/common";
    import { t } from "$lib/i18n";

    type T = $$Generic;

    export let selectedStats: string[];
    export let stats: StatSet<T>;
    export let shown = false;
</script>

<Modal bind:shown titleText={$t("stats.choose-title", "Choose Statistics")}>
    {#each stats.sections as section}
        <ChooseStatsSection {selectedStats} {stats} {section} on:choose-stat />
    {/each}
</Modal>
