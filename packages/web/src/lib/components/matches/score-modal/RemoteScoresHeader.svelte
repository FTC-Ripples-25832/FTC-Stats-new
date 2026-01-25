<script lang="ts">
    import type { RemoteScoresTy } from "../MatchScore.svelte";
    import { t } from "$lib/i18n";

    export let scores: RemoteScoresTy;
    export let teamNumber: number;
</script>

<tr>
    <td />
    <td class="score">
        {$t("common.team", "Team")} {teamNumber} <br /> <b>{scores.totalPoints}</b>
    </td>
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

    .score {
        background: var(--table-header-bg);
        border-bottom: var(--border-width) solid var(--sep-color);
    }
</style>
