<script lang="ts">
    import { prettyPrintOrdinal } from "$lib/printers/number";

    export let label: string;
    export let rank: number | null | undefined;
    export let count: number | null | undefined;
</script>

{#if rank != null && count != null && count > 0}
    <div class="card">
        <div class="rank">{prettyPrintOrdinal(rank)}</div>
        <div class="label">{label}</div>
        <div class="count">of {count}</div>
    </div>
{/if}

<style>
    .card {
        background: var(--theme-color);
        color: var(--team-text-color);
        border-radius: 10px;
        padding: var(--sm-pad);
        min-width: 120px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .rank {
        font-size: 1.4em;
        font-weight: 700;
    }

    .label {
        font-size: 0.9em;
    }

    .count {
        font-size: 0.8em;
        opacity: 0.9;
    }
</style>

