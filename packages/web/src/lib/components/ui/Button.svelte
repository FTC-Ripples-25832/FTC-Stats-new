<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition | null = null;
    export let style = "";
    export let fw = false;
    export let disabled: string | null = null;
    export let title: string = "";
</script>

<button on:click {style} disabled={!!disabled} title={disabled ?? title}>
    <Fa {icon} {fw} />
    <slot />
</button>

<style>
    button {
        font-size: inherit;
        font-family: inherit;
        font-weight: 600;
        color: inherit;

        background: var(--fg-color);

        padding: calc(var(--md-pad) * 0.9) calc(var(--md-pad) * 2);

        border: none;
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
        text-transform: uppercase;
        letter-spacing: 0.06em;

        white-space: nowrap;
        cursor: pointer;
    }

    button:hover:not(:disabled) {
        background: var(--theme-soft-color);
        box-shadow: 4px 4px 0 var(--sep-color);
    }

    button:active:not(:disabled) {
        background: var(--form-click-bg-color);
    }

    button:disabled {
        opacity: var(--form-disabled-opacity);
        cursor: not-allowed;
    }
</style>
