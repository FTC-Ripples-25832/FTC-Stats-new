<script lang="ts">
    const stats = [
        { label: "OPR", value: "192" },
        { label: "Auto avg", value: "68" },
        { label: "TeleOp avg", value: "94" },
        { label: "Endgame avg", value: "30" },
    ];

    const matches = [
        { match: "Q-48", result: "Win", score: "198-165" },
        { match: "Q-49", result: "Win", score: "205-172" },
        { match: "Q-50", result: "Loss", score: "180-186" },
    ];
</script>

<div class="flat team">
    <header class="hero">
        <div>
            <p class="eyebrow">Flat color blocks</p>
            <h1>Team 11503</h1>
            <p class="meta">Kinetic Tigers - Rank 1 Midwest</p>
        </div>
        <button type="button">Add to list</button>
    </header>

    <section class="stat-row">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <h2>Recent Matches</h2>
        <div class="list">
            {#each matches as match}
                <div class="row">
                    <span class="match">{match.match}</span>
                    <span class={`result ${match.result === "Win" ? "win" : "loss"}`}>
                        {match.result}
                    </span>
                    <span class="score">{match.score}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .flat {
        background: #f2f2f2;
        color: #1b1b1b;
        border-radius: 16px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Inter", sans-serif;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: #fff2b0;
        padding: var(--lg-gap);
        border-radius: 12px;
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #5b5b5b;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .meta {
        margin: 0;
        color: #5b5b5b;
    }

    button {
        border: none;
        background: #1b1b1b;
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        cursor: pointer;
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat-card {
        background: #d6ecff;
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--sm-gap);
    }

    .stat-card:nth-child(2) {
        background: #ffd6f5;
    }

    .stat-card:nth-child(3) {
        background: #d7ffd6;
    }

    .stat-card:nth-child(4) {
        background: #ffe1c7;
    }

    .stat-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #4a4a4a;
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .panel {
        background: #ffffff;
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--md-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .list {
        display: grid;
        gap: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 8px;
        background: #f4f4f4;
        font-size: var(--sm-font-size);
    }

    .match {
        font-weight: 700;
    }

    .result {
        font-weight: 700;
        text-transform: uppercase;
    }

    .result.win {
        color: #1b8a44;
    }

    .result.loss {
        color: #d12c2c;
    }

    .score {
        font-weight: 700;
    }

    @media (max-width: 900px) {
        .stat-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
