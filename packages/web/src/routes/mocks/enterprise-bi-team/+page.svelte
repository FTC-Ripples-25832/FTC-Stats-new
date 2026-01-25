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

<div class="bi team">
    <header class="topbar">
        <div>
            <h1>Team 11503 - Kinetic Tigers</h1>
            <p>Team Profile - Enterprise BI</p>
        </div>
        <div class="controls">
            <button type="button">Export</button>
            <button type="button">Add to list</button>
        </div>
    </header>

    <section class="panel">
        <h2>Key Metrics</h2>
        <div class="metric-grid">
            {#each stats as stat}
                <div class="metric">
                    <span class="label">{stat.label}</span>
                    <span class="value">{stat.value}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="panel">
        <h2>Recent Matches</h2>
        <table>
            <thead>
                <tr>
                    <th>Match</th>
                    <th>Result</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {#each matches as match}
                    <tr>
                        <td>{match.match}</td>
                        <td>{match.result}</td>
                        <td class="num">{match.score}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</div>

<style>
    .bi {
        background: #f4f6f9;
        color: #111827;
        padding: var(--xl-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--lg-gap);
        border: 1px solid #d8dde6;
        font-size: var(--sm-font-size);
    }

    .topbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--md-gap);
        padding-bottom: var(--md-gap);
        border-bottom: 1px solid #d8dde6;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    .topbar p {
        margin: 0;
        color: #6b7280;
    }

    .controls {
        display: flex;
        gap: var(--sm-gap);
    }

    button {
        border: 1px solid #c5ccd8;
        background: #ffffff;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        cursor: pointer;
    }

    .panel {
        background: #ffffff;
        border: 1px solid #d8dde6;
        border-radius: 8px;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #374151;
    }

    .metric-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .metric {
        border: 1px solid #e5e7eb;
        padding: var(--md-gap);
        border-radius: 6px;
        display: grid;
        gap: 4px;
    }

    .metric .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #6b7280;
    }

    .metric .value {
        font-weight: 700;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 8px 6px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
    }

    th {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #6b7280;
    }

    .num {
        font-family: "SFMono-Regular", "Menlo", "Monaco", monospace;
        text-align: right;
    }

    @media (max-width: 900px) {
        .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
