<script lang="ts">
    import type { SortDir, StatColumn, StatData } from "@ftc-stats/common";
    import StatHeader from "./StatHeader.svelte";
    import StatRow from "./StatRow.svelte";
    import { t } from "$lib/i18n";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let focusedTeam: number | null;

    export let stats: StatColumn<T>[];
    export let currentSort: { id: string; dir: SortDir };
    export let rankStat: StatColumn<T> | null;
</script>

<table class:no-data={stats.length == 0}>
    {#if stats.length}
        <StatHeader {stats} {currentSort} {rankStat} on:change_sort on:move_column />
    {/if}

    {#if !stats.length}
        <tbody>
            <tr class="no-data">
                <td colspan="999">
                    <b>{$t("stats.choose", "Choose statistics.")}</b>
                </td>
            </tr>
        </tbody>
    {:else if !data.length}
        <tbody>
            <tr class="no-data">
                <td colspan="999">
                    <b>{$t("stats.no-items", "No items match your current filters.")}</b>
                </td>
            </tr>
        </tbody>
    {:else}
        <tbody>
            {#each data as dataRow}
                <StatRow data={dataRow} {stats} {focusedTeam} {rankStat} on:row_click />
            {/each}
        </tbody>
    {/if}
</table>

<style>
    table {
        border-spacing: 0;
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);
        background-color: var(--fg-color);

        display: block;
        min-width: 100%;
        width: min-content;
        max-width: 100%;
        overflow-x: auto;

        position: relative;
    }

    table :global(th),
    table :global(td) {
        border-right: var(--border-width) solid var(--sep-color);
    }

    table :global(tr) > :global(:last-child) {
        border-right: none;
    }

    table :global(tbody tr) {
        border-bottom: var(--border-width) solid var(--sep-color);
    }

    table :global(tbody tr:last-child) {
        border-bottom: none;
    }

    table :global(thead) {
        border-top-left-radius: var(--card-radius);
        border-top-right-radius: var(--card-radius);
    }
    table :global(thead:not(.sticking) th:first-child) {
        border-top-left-radius: var(--card-radius);
    }
    table :global(thead:not(.sticking) th:last-child) {
        border-top-right-radius: var(--card-radius);
    }

    table tbody,
    table tbody :global(tr:last-child) {
        border-bottom-left-radius: var(--card-radius);
        border-bottom-right-radius: var(--card-radius);
    }
    table tbody :global(tr:last-child td:first-child) {
        border-bottom-left-radius: var(--card-radius);
    }
    table tbody :global(tr:last-child td:last-child) {
        border-bottom-right-radius: var(--card-radius);
    }

    tbody > :global(:nth-child(even)) {
        background-color: var(--zebra-stripe-color);
    }

    .no-data b {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--lg-pad);
        width: 100%;
    }
</style>
