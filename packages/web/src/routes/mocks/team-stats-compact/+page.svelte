<script lang="ts">
    const summary = [
        { label: "Rank", value: "1" },
        { label: "Region", value: "Midwest" },
        { label: "Win rate", value: "82%" },
        { label: "Auto", value: "92%" },
    ];

    const metrics = [
        { label: "OPR", value: "192", delta: "+5" },
        { label: "Auto avg", value: "68", delta: "+4" },
        { label: "TeleOp avg", value: "94", delta: "+2" },
        { label: "Endgame avg", value: "30", delta: "+1" },
        { label: "Penalty avg", value: "4", delta: "-1" },
        { label: "Cycle time", value: "1.8s", delta: "-0.2s" },
    ];

    const matches = [
        { id: "Q-48", opponent: "7421 / 9064", result: "Win", score: "198-165" },
        { id: "Q-49", opponent: "8112 / 5127", result: "Win", score: "205-172" },
        { id: "Q-50", opponent: "9012 / 6024", result: "Loss", score: "180-186" },
        { id: "Q-51", opponent: "7734 / 11704", result: "Win", score: "201-178" },
    ];
</script>

<div class="mock-page compact">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Team page concept</p>
            <h1>Team 11503 - Kinetic Tigers</h1>
            <p class="mock-muted">Compact layout with sticky summary and quick stats.</p>
        </div>
        <div class="hero-actions">
            <button class="mock-button" type="button">Share</button>
            <button class="mock-button primary" type="button">Add to list</button>
        </div>
    </section>

    <section class="split">
        <aside class="mock-panel summary">
            <div class="summary-head">
                <h2>Snapshot</h2>
                <span class="rating">92</span>
            </div>
            <div class="summary-list">
                {#each summary as item}
                    <div class="summary-row">
                        <span class="label">{item.label}</span>
                        <span class="value">{item.value}</span>
                    </div>
                {/each}
            </div>
            <button class="mock-button full" type="button">Open notes</button>
        </aside>

        <div class="main">
            <div class="mock-panel metrics">
                <div class="panel-head">
                    <h2>Key Metrics</h2>
                    <span class="mock-muted">Season average</span>
                </div>
                <div class="metric-grid">
                    {#each metrics as metric}
                        <div class="metric-card">
                            <span class="label">{metric.label}</span>
                            <div class="value-row">
                                <span class="value">{metric.value}</span>
                                <span class="delta">{metric.delta}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="mock-panel results">
                <div class="panel-head">
                    <h2>Match Results</h2>
                    <button class="mock-button" type="button">Full schedule</button>
                </div>
                <div class="result-list">
                    {#each matches as match}
                        <div class="result-row">
                            <div>
                                <span class="match-id">{match.id}</span>
                                <span class="opponent">vs {match.opponent}</span>
                            </div>
                            <span class={`result ${match.result === "Win" ? "win" : "loss"}`}>
                                {match.result}
                            </span>
                            <span class="score">{match.score}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .mock-page {
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: linear-gradient(
            120deg,
            rgba(var(--theme-color-vs), 0.15),
            rgba(0, 0, 0, 0)
        );
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.1);
    }

    .hero-actions {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .split {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: var(--xl-gap);
    }

    .summary {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .summary-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .summary-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .rating {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(var(--theme-color-vs), 0.15);
        font-weight: 700;
    }

    .summary-list {
        display: grid;
        gap: var(--md-gap);
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: var(--sm-font-size);
        padding-bottom: var(--sm-gap);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .summary-row .label {
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--xs-font-size);
    }

    .summary-row .value {
        font-weight: 600;
    }

    .mock-button.full {
        width: 100%;
    }

    .main {
        display: grid;
        gap: var(--xl-gap);
    }

    .metrics,
    .results {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .metric-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .metric-card {
        padding: var(--md-gap);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.03);
        display: grid;
        gap: var(--sm-gap);
    }

    .metric-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--secondary-text-color);
    }

    .value-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: var(--sm-font-size);
    }

    .value-row .value {
        font-weight: 700;
        font-size: var(--md-font-size);
    }

    .value-row .delta {
        color: rgba(var(--theme-color-vs), 0.8);
        font-weight: 600;
        font-size: var(--sm-font-size);
    }

    .result-list {
        display: grid;
        gap: var(--sm-gap);
    }

    .result-row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--md-gap);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.03);
        font-size: var(--sm-font-size);
    }

    .match-id {
        font-weight: 700;
        margin-right: var(--sm-gap);
    }

    .opponent {
        color: var(--secondary-text-color);
    }

    .result {
        font-weight: 700;
    }

    .result.win {
        color: rgb(67, 160, 71);
    }

    .result.loss {
        color: rgb(244, 67, 54);
    }

    .score {
        font-weight: 700;
    }

    @media (max-width: 1000px) {
        .split {
            grid-template-columns: 1fr;
        }

        .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .metric-grid {
            grid-template-columns: 1fr;
        }

        .result-row {
            grid-template-columns: 1fr;
        }
    }
</style>
