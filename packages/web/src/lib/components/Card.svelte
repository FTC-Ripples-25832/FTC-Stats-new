<script lang="ts">
    import { getContext } from "svelte";
    import { REQUESTED_WIDTH } from "./WidthProvider.svelte";
    import type { Readable } from "svelte/store";

    export let style = "";
    export let vis = true;

    let requestedWidth: Readable<string> = getContext(REQUESTED_WIDTH);
</script>

<div style:--requested-width={$requestedWidth} {style} class:vis>
    <slot />
</div>

<style>
    div {
        margin: var(--lg-gap) auto;
        margin-bottom: var(--vl-gap);

        --side-gap: var(--lg-gap);

        position: relative;
        width: 100%;
        max-width: min(var(--requested-width), calc(100% - 2 * var(--side-gap)));
        min-width: 0;
    }

    .vis {
        background-color: var(--fg-color);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
        position: relative;

        padding: calc(var(--lg-pad) * 1.1);
        padding-left: calc(var(--lg-pad) * 1.1 + 6px);
    }

    .vis::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 6px;
        background: var(--theme-color);
    }

    @media (max-width: 550px) {
        div {
            --side-gap: var(--md-gap);
        }
    }
</style>
