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

<div class="neon team">
    <header class="hero">
        <div>
            <p class="eyebrow">Neon/Cyber</p>
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
    .neon {
        background: #0b0f1a;
        color: #e8ebff;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        border: 1px solid rgba(120, 140, 255, 0.2);
        box-shadow: 0 30px 80px rgba(4, 8, 20, 0.8);
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        color: rgba(140, 160, 255, 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.4);
    }

    .meta {
        margin: 0;
        color: rgba(232, 235, 255, 0.7);
    }

    button {
        border-radius: 999px;
        padding: 10px 18px;
        font-weight: 700;
        font-size: var(--sm-font-size);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        border: none;
        background: linear-gradient(90deg, #5268ff, #7b4dff);
        color: white;
        box-shadow: 0 12px 24px rgba(90, 100, 255, 0.4);
        cursor: pointer;
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat-card {
        padding: var(--lg-gap);
        border-radius: 14px;
        background: rgba(20, 26, 44, 0.8);
        border: 1px solid rgba(120, 140, 255, 0.25);
        display: grid;
        gap: var(--sm-gap);
    }

    .stat-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: rgba(190, 200, 255, 0.6);
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .panel {
        padding: var(--lg-gap);
        border-radius: 18px;
        background: rgba(14, 18, 34, 0.9);
        border: 1px solid rgba(120, 140, 255, 0.2);
        display: grid;
        gap: var(--md-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(190, 200, 255, 0.7);
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
        border-radius: 12px;
        background: rgba(20, 26, 44, 0.7);
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
        color: #5bd18a;
    }

    .result.loss {
        color: #ff8aa5;
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
