<script lang="ts">
    const stats = [
        { label: "OPR", value: "192" },
        { label: "Auto avg", value: "68" },
        { label: "TeleOp avg", value: "94" },
        { label: "Endgame avg", value: "30" },
        { label: "Consistency", value: "92%" },
    ];

    const history = [
        { match: "Q-48", result: "Win", score: "198-165", note: "Auto bonus" },
        { match: "Q-49", result: "Win", score: "205-172", note: "Clean match" },
        { match: "Q-50", result: "Loss", score: "180-186", note: "Penalties" },
        { match: "Q-51", result: "Win", score: "201-178", note: "Fast cycle" },
    ];
</script>

<div class="mock-page team-minimal">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Team page concept</p>
            <h1>Team 11503 - Kinetic Tigers</h1>
            <p class="mock-muted">Rank 1 - Midwest Qualifier</p>
        </div>
        <button class="mock-button primary" type="button">Add to watchlist</button>
    </section>

    <section class="stat-row">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="mock-panel performance">
        <div class="panel-head">
            <h2>Performance Mix</h2>
            <span class="mock-muted">Season average</span>
        </div>
        <div class="bar">
            <span class="auto"></span>
            <span class="teleop"></span>
            <span class="endgame"></span>
        </div>
        <div class="legend">
            <span><i class="dot auto"></i>Auto 34%</span>
            <span><i class="dot teleop"></i>TeleOp 46%</span>
            <span><i class="dot endgame"></i>Endgame 20%</span>
        </div>
    </section>

    <section class="mock-panel matches">
        <div class="panel-head">
            <h2>Recent Matches</h2>
            <button class="mock-button" type="button">View all</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Match</th>
                    <th>Result</th>
                    <th>Score</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                {#each history as match}
                    <tr>
                        <td class="match-id">{match.match}</td>
                        <td class={`result ${match.result === "Win" ? "win" : "loss"}`}>
                            {match.result}
                        </td>
                        <td>{match.score}</td>
                        <td class="note">{match.note}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
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
        border-left: 6px solid rgba(var(--theme-color-vs), 0.6);
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

    .stat-row {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat-card {
        padding: var(--lg-gap);
        border: 1px solid var(--sep-color);
        border-radius: 10px;
        background: var(--fg-color);
        display: grid;
        gap: var(--sm-gap);
    }

    .stat-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--secondary-text-color);
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .performance {
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

    .bar {
        height: 16px;
        display: flex;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.05);
    }

    .bar .auto {
        width: 34%;
        background: rgba(var(--theme-color-vs), 0.7);
    }

    .bar .teleop {
        width: 46%;
        background: rgba(var(--blue-team-color-vs), 0.6);
    }

    .bar .endgame {
        width: 20%;
        background: rgba(var(--green-stat-color-vs), 0.7);
    }

    .legend {
        display: flex;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;
    }

    .dot.auto {
        background: rgba(var(--theme-color-vs), 0.7);
    }

    .dot.teleop {
        background: rgba(var(--blue-team-color-vs), 0.6);
    }

    .dot.endgame {
        background: rgba(var(--green-stat-color-vs), 0.7);
    }

    .matches {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--sm-font-size);
    }

    thead th {
        text-align: left;
        padding: 10px 6px;
        border-bottom: 2px solid var(--sep-color);
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--xs-font-size);
    }

    tbody td {
        padding: 12px 6px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .match-id {
        font-weight: 700;
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

    .note {
        color: var(--secondary-text-color);
    }

    @media (max-width: 1100px) {
        .stat-row {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .stat-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
