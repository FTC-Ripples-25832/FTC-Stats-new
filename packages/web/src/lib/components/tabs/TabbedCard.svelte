<script lang="ts" context="module">
    export const TAB_CONTEXT = {};
</script>

<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Card from "../Card.svelte";
    import Fa from "svelte-fa";

    export let tabs: [icon: IconDefinition, name: string, id: string, shown: boolean][];
    $: shownTabs = tabs.filter((n) => n[3]);

    export let selectedTab: string;
    let selectedTabStore = writable(selectedTab);
    $: $selectedTabStore = selectedTab;
    setContext(TAB_CONTEXT, selectedTabStore);

    $: if (!shownTabs.some((t) => t[2] == selectedTab) && shownTabs.length)
        selectedTab = shownTabs[0][2];
</script>

{#if shownTabs.length}
    <Card vis={false}>
        <div class="tab-layout">
            <div class="tabs">
                {#each shownTabs as [icon, name, id]}
                    <a
                        class="tab"
                        class:selected={id == selectedTab}
                        on:click|preventDefault={() => (selectedTab = id)}
                        href={id}
                    >
                        <Fa {icon} scale="0.75x" />
                        <span class="maybe-hide"> {name} </span>
                    </a>
                {/each}
            </div>

            <div class="card">
                <slot />
            </div>
        </div>
    </Card>
{:else}
    <slot name="empty" />
{/if}

<style>
    .tab-layout {
        display: grid;
        grid-template-columns: minmax(200px, 240px) minmax(0, 1fr);
        gap: var(--lg-gap);
        align-items: start;
    }

    .tabs {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        align-items: stretch;
    }

    .tab {
        font-size: var(--sm-font-size);
        font-weight: 700;
        color: var(--text-color);
        text-transform: uppercase;
        letter-spacing: 0.08em;

        padding: var(--md-pad);

        border-radius: var(--card-radius);
        border: var(--border-width) solid var(--sep-color);
        background: var(--fg-color);

        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
    }

    .tab:hover {
        text-decoration: none;
        background: var(--theme-soft-color);
        color: var(--text-color);
    }

    .tab.selected {
        background: var(--theme-color);
        color: var(--theme-text-color);
        border-color: var(--theme-color);
        box-shadow: 4px 4px 0 var(--sep-color);
    }

    .card {
        background-color: var(--fg-color);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);

        padding: var(--lg-pad);
    }

    @media (max-width: 900px) {
        .tab-layout {
            grid-template-columns: 1fr;
        }

        .tabs {
            flex-direction: row;
            flex-wrap: wrap;
        }
    }

    @media (max-width: 650px) {
        .tab:not(.selected) .maybe-hide {
            display: none;
        }
    }
</style>
