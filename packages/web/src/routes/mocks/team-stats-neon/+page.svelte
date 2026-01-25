<script lang="ts">
    const metrics = [
        { label: "OPR", value: "192", delta: "+5" },
        { label: "Auto avg", value: "68", delta: "+4" },
        { label: "TeleOp avg", value: "94", delta: "+2" },
        { label: "Endgame avg", value: "30", delta: "+1" },
    ];

    const matches = [
        { id: "Q-48", score: "198-165", result: "Win" },
        { id: "Q-49", score: "205-172", result: "Win" },
        { id: "Q-50", score: "180-186", result: "Loss" },
    ];
</script>

<div class="neon-team">
    <section class="hero">
        <div>
            <p class="eyebrow">Team profile - neon ops</p>
            <h1>Team 11503</h1>
            <p class="meta">Kinetic Tigers - Midwest Qualifier</p>
        </div>
        <div class="hero-actions">
            <button class="ghost" type="button">Ping scout</button>
            <button class="primary" type="button">Add to list</button>
        </div>
    </section>

    <section class="rail">
        <div class="rating">
            <span class="label">Rating</span>
            <span class="value">92</span>
        </div>
        <div class="tags">
            <span>Auto 92%</span>
            <span>Cycle 1.8s</span>
            <span>Endgame 4/5</span>
        </div>
    </section>

    <section class="grid">
        <div class="panel metrics">
            <div class="panel-head">
                <h2>Key Metrics</h2>
                <span class="chip">Season avg</span>
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

        <div class="panel history">
            <div class="panel-head">
                <h2>Recent Matches</h2>
                <span class="chip">Last 3</span>
            </div>
            <div class="match-list">
                {#each matches as match}
                    <div class={`match-row ${match.result === "Win" ? "win" : "loss"}`}>
                        <span class="match-id">{match.id}</span>
                        <span class="score">{match.score}</span>
                        <span class="result">{match.result}</span>
                    </div>
                {/each}
            </div>
            <div class="pulse">
                <span>Auto</span>
                <span class="bar"></span>
                <span>TeleOp</span>
                <span class="bar"></span>
                <span>Endgame</span>
            </div>
        </div>
    </section>
</div>

<style>
    .neon-team {
        background: #0b0f1a;
        color: #e8ebff;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        border: 1px solid rgba(120, 140, 255, 0.2);
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

    .hero-actions {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .hero-actions button {
        border-radius: 999px;
        padding: 10px 18px;
        font-weight: 700;
        font-size: var(--sm-font-size);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        border: 1px solid rgba(120, 140, 255, 0.4);
        background: transparent;
        color: inherit;
        cursor: pointer;
    }

    .hero-actions .primary {
        background: linear-gradient(90deg, #5268ff, #7b4dff);
        border: none;
        color: white;
        box-shadow: 0 12px 24px rgba(90, 100, 255, 0.4);
    }

    .rail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        padding: var(--lg-gap);
        border-radius: 18px;
        background: rgba(20, 26, 44, 0.8);
        border: 1px solid rgba(120, 140, 255, 0.25);
    }

    .rating .label {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        color: rgba(190, 200, 255, 0.6);
    }

    .rating .value {
        font-size: var(--vl-font-size);
        font-weight: 700;
    }

    .tags {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba(190, 200, 255, 0.7);
    }

    .grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--xl-gap);
    }

    .panel {
        padding: var(--xl-gap);
        border-radius: 18px;
        background: rgba(14, 18, 34, 0.9);
        border: 1px solid rgba(120, 140, 255, 0.2);
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

    .chip {
        padding: 6px 12px;
        border-radius: 999px;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba(190, 200, 255, 0.7);
        border: 1px solid rgba(120, 140, 255, 0.35);
    }

    .metric-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .metric-card {
        padding: var(--md-gap);
        border-radius: 12px;
        background: rgba(20, 26, 44, 0.8);
        display: grid;
        gap: var(--sm-gap);
    }

    .metric-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: rgba(190, 200, 255, 0.6);
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
        color: rgba(120, 140, 255, 0.9);
        font-weight: 700;
        font-size: var(--sm-font-size);
    }

    .match-list {
        display: grid;
        gap: var(--sm-gap);
    }

    .match-row {
        display: grid;
        grid-template-columns: 70px 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 12px;
        background: rgba(20, 26, 44, 0.7);
        font-size: var(--sm-font-size);
    }

    .match-row.win {
        border: 1px solid rgba(90, 255, 160, 0.4);
    }

    .match-row.loss {
        border: 1px solid rgba(255, 90, 118, 0.4);
    }

    .match-id {
        font-weight: 700;
    }

    .result {
        font-weight: 700;
    }

    .pulse {
        display: grid;
        grid-template-columns: auto 1fr auto 1fr auto;
        gap: var(--sm-gap);
        align-items: center;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(190, 200, 255, 0.7);
    }

    .pulse .bar {
        height: 6px;
        border-radius: 999px;
        background: linear-gradient(90deg, #5268ff, #7b4dff);
        box-shadow: 0 0 12px rgba(100, 120, 255, 0.6);
    }

    @media (max-width: 1100px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 700px) {
        .metric-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
