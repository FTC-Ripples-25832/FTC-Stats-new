<script lang="ts">
    import Card from "../../../lib/components/Card.svelte";
    import type { TeamSeasonEpa } from "@ftc-stats/common";
    import { t } from "$lib/i18n";

    export let epa: TeamSeasonEpa | null;

    function fmt(val: number | null | undefined, decimals = 1): string {
        if (val == null) return "—";
        return val.toFixed(decimals);
    }

    function ordinal(n: number | null | undefined): string {
        if (n == null) return "—";
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
</script>

{#if epa}
    <Card>
        <h2>{$t("teams.epa-stats", "EPA Stats")}</h2>
        <hr />

        <div class="table">
            <div class="header row-label" />
            <div class="header">Total</div>
            <div class="header">Auto</div>
            <div class="header">DC</div>
            <div class="header">Endgame</div>

            <div class="row-label">EPA</div>
            <div class="val highlight">{fmt(epa.epa_total)}</div>
            <div class="val">{fmt(epa.epa_auto)}</div>
            <div class="val">{fmt(epa.epa_dc)}</div>
            <div class="val">{fmt(epa.epa_endgame)}</div>

            <div class="row-label">{$t("teams.epa-rank", "EPA Rank")}</div>
            <div class="val">{ordinal(epa.total_epa_rank)}</div>
            <div class="val secondary">{ordinal(epa.country_epa_rank)} (country)</div>
            <div class="val secondary">{ordinal(epa.state_epa_rank)} (state)</div>
            <div class="val" />

            <div class="row-label">Norm EPA</div>
            <div class="val">{fmt(epa.norm_epa, 0)}</div>
            <div class="val secondary">
                {#if epa.epa_conf_low != null && epa.epa_conf_high != null}
                    CI: [{fmt(epa.epa_conf_low)}, {fmt(epa.epa_conf_high)}]
                {/if}
            </div>
            <div class="val" />
            <div class="val" />
        </div>
    </Card>
{/if}

<style>
    .table {
        display: grid;
        grid-template-columns: auto 1fr 1fr 1fr 1fr;
        gap: 2px var(--md-gap);
        align-items: center;
    }

    .header {
        font-weight: 600;
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        text-align: center;
        padding-bottom: var(--sm-gap);
    }

    .row-label {
        font-weight: 600;
        font-size: var(--sm-font-size);
        padding: var(--sm-gap) 0;
    }

    .val {
        text-align: center;
        font-size: var(--md-font-size);
        padding: var(--sm-gap) 0;
    }

    .val.highlight {
        font-weight: 700;
        color: var(--theme-color);
        font-size: var(--lg-font-size);
    }

    .val.secondary {
        font-size: var(--xs-font-size);
        color: var(--secondary-text-color);
    }

    hr {
        border: none;
        border-top: 1px solid var(--sep-color);
        margin: var(--sm-gap) 0;
    }
</style>
