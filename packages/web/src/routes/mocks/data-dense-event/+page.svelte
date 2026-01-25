<script lang="ts">
    const stats = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Avg score", value: "178" },
        { label: "Top OPR", value: "192" },
    ];

    const standings = [
        { rank: 1, team: "11503", record: "10-1-0", rp: 29 },
        { rank: 2, team: "7421", record: "9-2-0", rp: 27 },
        { rank: 3, team: "9064", record: "9-2-0", rp: 26 },
        { rank: 4, team: "5127", record: "8-3-0", rp: 24 },
        { rank: 5, team: "12398", record: "8-3-0", rp: 23 },
    ];

    const matches = [
        { match: "Q-49", time: "10:50", red: 205, blue: 172 },
        { match: "Q-50", time: "10:58", red: 180, blue: 186 },
        { match: "Q-51", time: "11:06", red: 198, blue: 178 },
        { match: "Q-52", time: "11:14", red: 201, blue: 194 },
    ];
</script>

<div class="dense event">
    <header>
        <div>
            <h1>Midwest Qualifier</h1>
            <p>Des Moines, IA - Jan 13, 2024</p>
        </div>
        <div class="actions">
            <button type="button">Export CSV</button>
        </div>
    </header>

    <section class="stats">
        {#each stats as stat}
            <div class="stat">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="grid">
        <div class="panel">
            <h2>Standings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team</th>
                        <th>Record</th>
                        <th>RP</th>
                    </tr>
                </thead>
                <tbody>
                    {#each standings as row}
                        <tr>
                            <td>{row.rank}</td>
                            <td>{row.team}</td>
                            <td>{row.record}</td>
                            <td>{row.rp}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="panel">
            <h2>Recent Matches</h2>
            <table>
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>Time</th>
                        <th>Red</th>
                        <th>Blue</th>
                    </tr>
                </thead>
                <tbody>
                    {#each matches as match}
                        <tr>
                            <td>{match.match}</td>
                            <td>{match.time}</td>
                            <td>{match.red}</td>
                            <td>{match.blue}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
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
        grid-template-columns: repeat(4, minmax(0, 1fr));
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

    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--lg-gap);
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

        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
