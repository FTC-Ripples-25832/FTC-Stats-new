<script lang="ts" context="module">
    export type Scores2022 = Extract<
        FullMatchFragment["scores"],
        { __typename: "MatchScores2022" }
    >;
</script>

<script lang="ts">
    import type { FullMatchFragment } from "../../../../graphql/generated/graphql-operations";
    import Modal from "../../../Modal.svelte";
    import type { SimpleTeamMatchParticipation } from "./HoverInfo.svelte";
    import { t } from "$lib/i18n";

    export let shown = false;
    export let matchDescription: string;
    export let scores: Scores2022;
    export let teams: SimpleTeamMatchParticipation[];

    let PowerPlayVis: any;

    async function load() {
        PowerPlayVis = (await import("./PowerPlayVis.svelte")).default;
    }

    $: shown && PowerPlayVis == undefined && load();

    let cones: "all" | "auto" = "all";
    $: layout = cones == "all" ? scores.dcConeLayout : scores.autoConeLayout;
    $: modalTitle = `${$t("common.match", "Match")} ${matchDescription} ${$t(
        "matches.cones",
        "Cones"
    )}`;
</script>

<Modal bind:shown titleText={modalTitle}>
    <form on:submit|preventDefault>
        <span>
            <input type="radio" bind:group={cones} id="auto" name="cones" value="auto" />
            <label for="auto">{$t("matches.cones.auto", "Auto Cones")}</label>
        </span>
        <span>
            <input type="radio" bind:group={cones} id="all" name="cones" value="all" />
            <label for="all">{$t("matches.cones.all", "All Cones")}</label>
        </span>
    </form>

    {#if PowerPlayVis}
        <svelte:component this={PowerPlayVis} {layout} {teams} />
    {:else}
        <div />
    {/if}
</Modal>

<style>
    form {
        display: flex;
        justify-content: center;
        gap: var(--xl-gap);
        align-items: center;
    }
    div {
        width: 1200px;
        max-width: calc(100vw - var(--lg-gap) * 4);
        max-height: calc(100vh - var(--lg-gap) * 20);
        aspect-ratio: 16 / 9;
        margin: auto;
        position: relative;
    }
</style>
