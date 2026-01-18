<script lang="ts">
    import { predictMatchSimple, formatWinProbability } from "@ftc-stats/common";
    import { createTippy } from "svelte-tippy";
    import { tippyTheme } from "../nav/DarkModeToggle.svelte";
    import "tippy.js/dist/tippy.css";

    export let redOPR1: number;
    export let redOPR2: number;
    export let blueOPR1: number;
    export let blueOPR2: number;

    $: prediction = predictMatchSimple(redOPR1, redOPR2, blueOPR1, blueOPR2);
    $: redProb = formatWinProbability(prediction.redWinProbability);
    $: blueProb = formatWinProbability(prediction.blueWinProbability);

    const tippy = createTippy({ placement: "top", delay: [500, 0] });
    $: tip = {
        content: `
            <div style="text-align: center;">
                <div style="margin-bottom: 4px;"><strong>Predicted Scores</strong></div>
                <div style="color: var(--red-team-text-color);">Red: ${Math.round(prediction.predictedRedScore)}</div>
                <div style="color: var(--blue-team-text-color);">Blue: ${Math.round(prediction.predictedBlueScore)}</div>
                <div style="margin-top: 4px; font-size: 0.9em; opacity: 0.8;">Based on team OPR</div>
            </div>
        `,
        allowHTML: true,
        theme: $tippyTheme,
    };
</script>

<div class="prediction" use:tippy={tip}>
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
