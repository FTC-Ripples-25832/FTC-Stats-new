<script lang="ts">
    import type { TradScoresTy } from "../MatchScore.svelte";
    import { t } from "$lib/i18n";

    export let scores: TradScoresTy;
</script>

<tr>
    <td />
    <td class="score red">{$t("common.red", "Red")} <br /> <b>{scores.red.totalPoints}</b></td>
    <td class="score blue">{$t("common.blue", "Blue")} <br /> <b>{scores.blue.totalPoints}</b></td>
</tr>

<style>
    td {
        display: block;
        padding: var(--md-pad);
    }

    .score {
        padding-top: var(--sm-pad);
        padding-bottom: var(--sm-pad);

        text-align: center;
        color: var(--text-color);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: var(--sm-font-size);
    }

    b {
        font-weight: 900;
    }

    .red {
        background: var(--red-team-bg-color);
    }
    .blue {
        background: var(--blue-team-bg-color);
    }
</style>
