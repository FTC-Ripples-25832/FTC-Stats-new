<script lang="ts">
    const stats = [
        { label: "OPR", value: "192", tone: "blue" },
        { label: "Auto avg", value: "68", tone: "pink" },
        { label: "TeleOp avg", value: "94", tone: "mint" },
        { label: "Endgame avg", value: "30", tone: "peach" },
    ];

    const matches = [
        { match: "Q-48", result: "Win", score: "198-165" },
        { match: "Q-49", result: "Win", score: "205-172" },
        { match: "Q-50", result: "Loss", score: "180-186" },
    ];
</script>

<div class="hybrid team">
    <header class="hero">
        <div>
            <p class="kicker">Hybrid editorial + BI + flat</p>
            <h1>Team 11503</h1>
            <p class="meta">Kinetic Tigers - Rank 1 Midwest</p>
        </div>
        <button type="button">Add to list</button>
    </header>

    <section class="stat-row">
        {#each stats as stat}
            <div class={`stat-card ${stat.tone}`}>
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
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
    .hybrid {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 16px;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 2px solid #1d1a16;
    }

    .hero {
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
        font-size: calc(var(--xl-font-size) * 1.4);
    }

    .meta {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 2px solid #1d1a16;
        background: #ffdb00;
        padding: 8px 14px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
        font-family: "Inter", sans-serif;
    }

    .stat-card {
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: 4px;
        border: 2px solid #1d1a16;
        background: #ffffff;
    }

    .stat-card.blue {
        background: #d6ecff;
    }

    .stat-card.pink {
        background: #ffd6f5;
    }

    .stat-card.mint {
        background: #d7ffd6;
    }

    .stat-card.peach {
        background: #ffe1c7;
    }

    .stat-card .label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        color: #4a4a4a;
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .panel {
        border: 2px solid #1d1a16;
        padding: var(--md-gap);
        background: #ffffff;
        display: grid;
        gap: var(--sm-gap);
        font-family: "Inter", sans-serif;
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--sm-font-size);
    }

    th,
    td {
        padding: 8px 6px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        text-align: left;
    }

    th {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        color: #5b5b5b;
    }

    .num {
        font-family: "SFMono-Regular", "Menlo", "Monaco", monospace;
        text-align: right;
    }

    @media (max-width: 900px) {
        .stat-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
