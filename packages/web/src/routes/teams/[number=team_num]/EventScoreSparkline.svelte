<script lang="ts">
    import type { FullMatchFragment } from "$lib/graphql/generated/graphql-operations";
    import { getAllianceScoreForTeam } from "./team-metrics";

    export let matches: FullMatchFragment[] = [];
    export let teamNumber: number;

    $: scores = matches
        .map((m) => ({
            time: m.actualStartTime ?? m.scheduledStartTime ?? "",
            score: getAllianceScoreForTeam(m, teamNumber),
        }))
        .filter((m) => m.score != null)
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .map((m) => m.score as number);

    $: min = scores.length ? Math.min(...scores) : 0;
    $: max = scores.length ? Math.max(...scores) : 0;
    $: range = Math.max(1, max - min);

    const width = 120;
    const height = 32;

    $: points = scores.map((score, i) => {
        const x = scores.length === 1 ? width / 2 : (i / (scores.length - 1)) * width;
        const y = height - ((score - min) / range) * height;
        return `${x},${y}`;
    });
</script>

{#if scores.length >= 2}
    <svg class="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline fill="none" stroke="var(--theme-color)" stroke-width="2" points={points} />
    </svg>
{:else if scores.length === 1}
    <div class="single">{scores[0]}</div>
{:else}
    <div class="empty">—</div>
{/if}

<style>
    .sparkline {
        width: 120px;
        height: 32px;
    }

    .single,
    .empty {
        width: 120px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        font-size: 0.85em;
    }
</style>

