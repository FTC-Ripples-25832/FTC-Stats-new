<script lang="ts">
    const metrics = [
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

<div class="editorial-split">
    <header class="masthead">
        <div>
            <p class="kicker">Team profile - editorial split</p>
            <h1>Team 11503</h1>
            <p class="subhead">Kinetic Tigers</p>
        </div>
        <button type="button">Add to list</button>
    </header>

    <section class="split">
        <article class="text">
            <h2>Overview</h2>
            <p>
                Team 11503 is known for fast cycle flow and dependable auto placement. The drive team keeps
                penalties low while maintaining endgame success.
            </p>
            <p>
                Pairing them with a defense anchor yields the best alliance output.
            </p>
        </article>
        <aside class="stats">
            {#each metrics as metric}
                <div class="stat-row">
                    <span class="label">{metric.label}</span>
                    <span class="value">{metric.value}</span>
                </div>
            {/each}
        </aside>
    </section>

    <section class="panel matches">
        <h2>Recent Matches</h2>
        {#each matches as match}
            <div class="match-row">
                <span class="match">{match.id}</span>
                <span class={`result ${match.result === "Win" ? "win" : "loss"}`}>{match.result}</span>
                <span class="score">{match.score}</span>
            </div>
        {/each}
    </section>
</div>

<style>
    .editorial-split {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .masthead {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 2px solid #1d1a16;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.5);
    }

    .subhead {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    button {
        border: 1px solid #1d1a16;
        background: transparent;
        padding: 8px 14px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .split {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--xl-gap);
    }

    .text h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    .text p {
        font-size: var(--md-font-size);
        line-height: 1.6;
    }

    .stats {
        border-left: 2px solid #1d1a16;
        padding-left: var(--lg-gap);
        display: grid;
        gap: var(--sm-gap);
        font-family: "Inter", sans-serif;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding-bottom: var(--sm-gap);
        font-size: var(--sm-font-size);
    }

    .stat-row .label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        color: rgba(0, 0, 0, 0.6);
    }

    .stat-row .value {
        font-weight: 700;
    }

    .panel {
        padding: var(--lg-gap);
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
    }

    .panel h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--md-font-size);
    }

    .match-row {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: var(--sm-font-size);
    }

    .match-row:last-child {
        border-bottom: none;
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

    @media (max-width: 900px) {
        .split {
            grid-template-columns: 1fr;
        }

        .stats {
            border-left: none;
            padding-left: 0;
        }
    }
</style>
