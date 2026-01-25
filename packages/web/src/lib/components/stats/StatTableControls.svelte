<script lang="ts">
    import {
        NonRankStatColumn,
        RankTy,
        type StatData,
        StatSet,
        RANK_STATS,
        SortDir,
        type FilterGroup,
    } from "@ftc-stats/common";
    import { faEdit, faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";
    import ViewStatsModal from "./view-stats/ViewStatsModal.svelte";
    import ChooseStatsModal from "./choose-stats/ChooseStatsModal.svelte";
    import StatTable from "./StatTable.svelte";
    import Button from "../ui/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import FilterModal from "./filter/FilterModal.svelte";
    import Select from "../ui/form/Select.svelte";
    import ExportCsv from "./ExportCsv.svelte";
    import { t } from "$lib/i18n";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;
    export let rankTy: RankTy;
    export let showRank: boolean;
    export let includeSkipRankTys: boolean = false;

    export let shownStats: NonRankStatColumn<T>[];
    export let currentSort: { id: string; dir: SortDir };
    export let filter: FilterGroup | null;

    export let isDefaultStats: boolean;

    export let csv: { filename: string; title: string };

    let dispatch = createEventDispatcher();

    let viewStatsModalShown = false;
    let viewStatsData: StatData<T>;

    function rowClick(e: CustomEvent) {
        viewStatsModalShown = true;
        viewStatsData = e.detail;
    }

    let chooseStatsModalShown = false;
    let filtersShown = false;

    let skip: "skip" | "keep";
    let rankAfterFilters: "yes" | "no";

    function updateRankComponents(t: RankTy) {
        skip = t == RankTy.FilterSkip || t == RankTy.NoFilterSkip ? "skip" : "keep";
        rankAfterFilters = t == RankTy.Filter || t == RankTy.FilterSkip ? "yes" : "no";
    }

    function computeRankTy(s: "skip" | "keep", f: "yes" | "no") {
        if (f == "yes") {
            rankTy = s == "skip" ? RankTy.FilterSkip : RankTy.Filter;
        } else {
            rankTy = s == "skip" ? RankTy.NoFilterSkip : RankTy.NoFilter;
        }
    }

    $: updateRankComponents(rankTy);
    $: computeRankTy(skip, rankAfterFilters);

    $: rankFilterOptions = [
        { value: "no", name: $t("stats.rank.pre-filter", "Pre Filter Rank") },
        { value: "yes", name: $t("stats.rank.post-filter", "Post Filter Rank") },
    ];
    $: skipRankOptions = [
        { value: "skip", name: $t("stats.rank.best", "Rank Best Results") },
        { value: "keep", name: $t("stats.rank.all", "Rank All Results") },
    ];
</script>

<ViewStatsModal bind:shown={viewStatsModalShown} {stats} data={viewStatsData?.data} />
<ChooseStatsModal
    bind:shown={chooseStatsModalShown}
    selectedStats={shownStats.map((s) => s.id)}
    {stats}
    on:choose-stat={(e) => dispatch("toggle-show-stat", e.detail)}
/>
<FilterModal bind:shown={filtersShown} root={filter} {stats} on:new-filter />

<div class="controls" class:extras={!isDefaultStats || filter != null}>
    <Button icon={faEdit} on:click={() => (chooseStatsModalShown = true)}>
        {$t("stats.statistics", "Statistics")}
    </Button>
    {#if !isDefaultStats}
        <Button icon={faXmark} on:click={() => dispatch("reset-stats")}>
            {$t("stats.reset", "Reset Stats")}
        </Button>
    {/if}

    <Button icon={faFilter} on:click={() => (filtersShown = true)}>
        {$t("stats.filters", "Filters")}
    </Button>

    {#if filter != null}
        <Button icon={faXmark} on:click={() => dispatch("new-filter", null)}>
            {$t("stats.filters.clear", "Clear Filters")}
        </Button>
        <Select
            bind:value={rankAfterFilters}
            options={rankFilterOptions}
        />
    {/if}
    {#if includeSkipRankTys}
        <Select
            bind:value={skip}
            options={skipRankOptions}
        />
    {/if}
    <div>
        <ExportCsv {data} {shownStats} {csv} />
    </div>
</div>

<StatTable
    {data}
    stats={shownStats}
    {currentSort}
    {focusedTeam}
    rankStat={showRank ? RANK_STATS[rankTy] : null}
    on:change_sort
    on:move_column
    on:row_click={rowClick}
/>

<style>
    .controls {
        display: flex;
        align-items: center;
        justify-content: left;
        flex-wrap: wrap;
        gap: var(--md-gap);

        margin-bottom: var(--lg-gap);
    }

    .controls :last-child {
        margin-left: auto;
    }

    @media (max-width: 600px) {
        .controls.extras :last-child {
            margin-left: 0;
        }
    }

    .controls :global(select) {
        width: min-content;
        padding-top: calc(var(--md-pad) * 0.9);
        padding-bottom: calc(var(--md-pad) * 0.9);
        background-color: var(--form-bg-color);
    }

    .controls :global(select:hover) {
        background-color: var(--form-hover-bg-color);
    }
</style>
