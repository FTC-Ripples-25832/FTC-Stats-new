<script lang="ts">
    import { prettyPrintFloat } from "$lib/printers/number";
    import { t } from "$lib/i18n";

    export let auto: number | null | undefined = null;
    export let teleop: number | null | undefined = null;
    export let endgame: number | null | undefined = null;
    export let total: number | null | undefined = null;

    $: autoLabel = $t("stats.opr.auto-short", "Auto");
    $: teleopLabel = $t("stats.opr.teleop-short", "Teleop");
    $: endgameLabel = $t("stats.opr.endgame-short", "Endgame");
    $: totalLabel = $t("common.total", "Total");
</script>

<div class="chips">
    {#if auto != null}
        <span class="chip auto">
            {autoLabel}: <strong>{prettyPrintFloat(auto)}</strong>
        </span>
    {/if}
    {#if teleop != null}
        <span class="chip teleop">
            {teleopLabel}: <strong>{prettyPrintFloat(teleop)}</strong>
        </span>
    {/if}
    {#if endgame != null}
        <span class="chip endgame">
            {endgameLabel}: <strong>{prettyPrintFloat(endgame)}</strong>
        </span>
    {/if}
    {#if total != null}
        <span class="chip total">
            {totalLabel}: <strong>{prettyPrintFloat(total)}</strong>
        </span>
    {/if}
</div>

<style>
    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sm-gap);
        align-items: center;
    }

    .chip {
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 0.85em;
        color: white;
        display: inline-flex;
        gap: 4px;
    }

    .chip.auto {
        background: var(--blue-team-color);
    }

    .chip.teleop {
        background: var(--orange-team-color, #f57e25);
    }

    .chip.endgame {
        background: var(--green-team-color, #4caf50);
    }

    .chip.total {
        background: var(--theme-color);
    }
</style>

