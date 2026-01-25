<script lang="ts">
    const stats = [
        { label: "OPR", value: "192" },
        { label: "Auto avg", value: "68" },
        { label: "TeleOp avg", value: "94" },
        { label: "Endgame avg", value: "30" },
        { label: "Win rate", value: "82%" },
    ];

    const matches = [
        { match: "Q-48", result: "Win", score: "198-165" },
        { match: "Q-49", result: "Win", score: "205-172" },
        { match: "Q-50", result: "Loss", score: "180-186" },
        { match: "Q-51", result: "Win", score: "201-178" },
    ];
</script>

<div class="dense team">
    <header>
        <div>
            <h1>Team 11503 - Kinetic Tigers</h1>
            <p>Rank 1 - Midwest Qualifier</p>
        </div>
        <button type="button">Add to list</button>
    </header>

    <section class="stats">
        {#each stats as stat}
            <div class="stat">
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
                        <td>{match.score}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</div>

<style>
    .dense {
        background: #ffffff;
        color: #111111;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--lg-gap);
        font-size: var(--sm-font-size);
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--md-gap);
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: var(--md-gap);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    header p {
        margin: 0;
        color: #6b6b6b;
    }

    button {
        border: 1px solid #cfcfcf;
        background: #f8f8f8;
        padding: 6px 10px;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        cursor: pointer;
    }

    .stats {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat {
        border: 1px solid #e0e0e0;
        padding: var(--md-gap);
        display: grid;
        gap: 4px;
    }

    .stat .label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        color: #6b6b6b;
    }

    .stat .value {
        font-weight: 700;
    }

    .panel {
        border: 1px solid #e0e0e0;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 6px 4px;
        text-align: left;
        border-bottom: 1px solid #ededed;
    }

    th {
        text-transform: uppercase;
        font-size: var(--xs-font-size);
        letter-spacing: 0.12em;
        color: #6b6b6b;
    }

    @media (max-width: 900px) {
        .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
