<script lang="ts">
    const stats = [
        { label: "OPR", value: "192", note: "+5" },
        { label: "Auto avg", value: "68", note: "+4" },
        { label: "TeleOp avg", value: "94", note: "+2" },
        { label: "Endgame avg", value: "30", note: "+1" },
    ];

    const matches = [
        { match: "Q-48", result: "Win", score: "198-165" },
        { match: "Q-49", result: "Win", score: "205-172" },
        { match: "Q-50", result: "Loss", score: "180-186" },
    ];
</script>

<div class="dashboard team">
    <header class="hero">
        <div>
            <p class="eyebrow">Dashboard modern</p>
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
                <span class="note">{stat.note}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <div class="panel-head">
            <h2>Recent Matches</h2>
            <button type="button">Full history</button>
        </div>
        <div class="list">
            {#each matches as match}
                <div class="row">
                    <span class="match">{match.match}</span>
                    <span class={`result ${match.result === "Win" ? "win" : "loss"}`}>{match.result}</span>
                    <span class="score">{match.score}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .dashboard {
        background: #f5f7fb;
        border-radius: 18px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--xl-gap);
        color: #1b1f2a;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: linear-gradient(120deg, #e6ecff, #ffffff);
        border-radius: 16px;
        padding: var(--lg-gap);
        box-shadow: 0 12px 24px rgba(16, 24, 40, 0.08);
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #667085;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.1);
    }

    .meta {
        margin: 0;
        color: #667085;
    }

    button {
        border: none;
        background: #2d6bff;
        color: white;
        padding: 10px 16px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .stat-card {
        background: #ffffff;
        border-radius: 14px;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--sm-gap);
        box-shadow: 0 10px 20px rgba(16, 24, 40, 0.08);
    }

    .stat-card .label {
        font-size: var(--sm-font-size);
        color: #667085;
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .stat-card .note {
        font-size: var(--sm-font-size);
        color: #2d6bff;
    }

    .panel {
        background: #ffffff;
        border-radius: 16px;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--md-gap);
        box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--md-font-size);
    }

    .panel-head button {
        background: #eef2ff;
        color: #2d6bff;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: var(--xs-font-size);
    }

    .list {
        display: grid;
        gap: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: var(--sm-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 10px;
        background: #f7f8fc;
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
