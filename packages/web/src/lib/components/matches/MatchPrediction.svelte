<script lang="ts">
    import { predictMatchFromScores, formatWinProbability } from "@ftc-stats/common";
    import { createTippy } from "svelte-tippy";
    import { tippyTheme } from "../nav/DarkModeToggle.svelte";
    import "tippy.js/dist/tippy.css";
    import { t } from "$lib/i18n";

    export let redScore: number;
    export let blueScore: number;
    export let label = "OPR";
    export let note = "";
    export let variance = 100;

    $: prediction = predictMatchFromScores(redScore, blueScore, variance);
    $: redProb = formatWinProbability(prediction.redWinProbability);
    $: blueProb = formatWinProbability(prediction.blueWinProbability);
    $: priorityNote = $t(
        "matches.predicted-scores.priority",
        "Model priority: XGB -> EPA -> OPR"
    );

    const tippy = createTippy({ placement: "top", delay: [500, 0] });
    $: tip = {
        content: `
            <div style="text-align: center;">
                <div style="margin-bottom: 4px;"><strong>${$t(
                    "matches.predicted-scores",
                    "Predicted Scores"
                )}</strong></div>
                <div style="margin-bottom: 4px; font-size: 0.85em; opacity: 0.7;">${label} · ${$t(
                    "matches.variance",
                    "Variance"
                )}: ${variance}</div>
                <div style="color: var(--red-team-text-color);">${$t(
                    "common.red",
                    "Red"
                )}: ${Math.round(prediction.predictedRedScore)}</div>
                <div style="color: var(--blue-team-text-color);">${$t(
                    "common.blue",
                    "Blue"
                )}: ${Math.round(prediction.predictedBlueScore)}</div>
                ${
                    note
                        ? `<div style=\"margin-top: 4px; font-size: 0.9em; opacity: 0.8;\">${note}</div>`
                        : ""
                }
                ${
                    priorityNote
                        ? `<div style=\"margin-top: 4px; font-size: 0.85em; opacity: 0.7;\">${priorityNote}</div>`
                        : ""
                }
            </div>
        `,
        allowHTML: true,
        theme: $tippyTheme,
    };
</script>

<div class="prediction" use:tippy={tip}>
    <div class="label">{label}</div>
    <div class="prob red" class:favorite={prediction.redWinProbability > 0.5}>
        {redProb}
    </div>
    <div class="separator">|</div>
    <div class="prob blue" class:favorite={prediction.blueWinProbability > 0.5}>
        {blueProb}
    </div>
</div>

<style>
    .prediction {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--sm-gap);
        font-size: 0.85em;
        cursor: help;
        flex-wrap: wrap;
    }

    .label {
        font-size: 0.75em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.6;
    }

    .prob {
        opacity: 0.6;
        transition: opacity 0.2s;
    }

    .prob.favorite {
        opacity: 1;
        font-weight: 600;
    }

    .prob.red.favorite {
        color: var(--red-team-text-color);
    }

    .prob.blue.favorite {
        color: var(--blue-team-text-color);
    }

    .separator {
        opacity: 0.4;
    }

    .prediction:hover .prob {
        opacity: 1;
    }
</style>
