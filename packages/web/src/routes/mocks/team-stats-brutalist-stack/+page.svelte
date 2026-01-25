<script lang="ts">
    const stats = [
        { label: "OPR", value: "192" },
        { label: "Auto avg", value: "68" },
        { label: "TeleOp avg", value: "94" },
        { label: "Endgame avg", value: "30" },
    ];

    const matches = [
        { id: "Q-48", result: "Win", score: "198-165" },
        { id: "Q-49", result: "Win", score: "205-172" },
        { id: "Q-50", result: "Loss", score: "180-186" },
    ];
</script>

<div class="brutal-stack">
    <header class="hero">
        <div>
            <p class="kicker">Team profile - brutal stack</p>
            <h1>Team 11503</h1>
            <p class="meta">Kinetic Tigers</p>
        </div>
        <button type="button">Add to list</button>
    </header>

    <section class="stack">
        {#each stats as stat}
            <div class="stack-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="block">
        <h2>Recent Matches</h2>
        {#each matches as match}
            <div class="row">
                <span class="match">{match.id}</span>
                <span class={`result ${match.result === "Win" ? "win" : "loss"}`}>
                    {match.result}
                </span>
                <span class="score">{match.score}</span>
            </div>
        {/each}
    </section>
</div>

<style>
    .brutal-stack {
        background: #ffffff;
        color: #0b0b0b;
        border-radius: 0;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        border: 4px solid #0b0b0b;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 4px solid #0b0b0b;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-weight: 700;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.5);
        text-transform: uppercase;
    }

    .meta {
        margin: 0;
        font-weight: 600;
    }

    button {
        border: 4px solid #0b0b0b;
        padding: 10px 16px;
        background: #ffdb00;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        cursor: pointer;
    }

    .stack {
        display: grid;
        gap: var(--md-gap);
    }

    .stack-card {
        border: 4px solid #0b0b0b;
        padding: var(--lg-gap);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f5f5f5;
        font-weight: 700;
    }

    .stack-card .label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: var(--xs-font-size);
    }

    .stack-card .value {
        font-size: var(--vl-font-size);
    }

    .block {
        border: 4px solid #0b0b0b;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--md-gap);
    }

    .block h2 {
        margin: 0;
        text-transform: uppercase;
        font-size: var(--lg-font-size);
        border-bottom: 4px solid #0b0b0b;
        padding-bottom: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        font-weight: 700;
    }

    .match {
        background: #0b0b0b;
        color: #ffffff;
        padding: 6px 8px;
        text-align: center;
    }

    .result {
        text-transform: uppercase;
    }

    .result.win {
        color: #1b8a44;
    }

    .result.loss {
        color: #d12c2c;
    }

    .score {
        padding: 6px 10px;
        border: 3px solid #0b0b0b;
        text-align: center;
    }
</style>
