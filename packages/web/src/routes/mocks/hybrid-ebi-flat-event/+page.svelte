<script lang="ts">
    const stats = [
        { label: "Teams", value: "36", tone: "blue" },
        { label: "Matches", value: "120", tone: "pink" },
        { label: "Top score", value: "214", tone: "mint" },
        { label: "Avg score", value: "178", tone: "peach" },
    ];

    const standings = [
        { rank: 1, team: "11503", record: "10-1-0", rp: 29 },
        { rank: 2, team: "7421", record: "9-2-0", rp: 27 },
        { rank: 3, team: "9064", record: "9-2-0", rp: 26 },
        { rank: 4, team: "5127", record: "8-3-0", rp: 24 },
    ];

    const matches = [
        { match: "Q-49", time: "10:50", red: 205, blue: 172 },
        { match: "Q-50", time: "10:58", red: 180, blue: 186 },
        { match: "Q-51", time: "11:06", red: 198, blue: 178 },
    ];
</script>

<div class="hybrid event">
    <header class="hero">
        <div>
            <p class="kicker">Hybrid editorial + BI + flat</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Export</button>
    </header>

    <section class="stat-row">
        {#each stats as stat}
            <div class={`stat-card ${stat.tone}`}>
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
                            <td class="num">{row.rp}</td>
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
                            <td class="num">{match.red}</td>
                            <td class="num">{match.blue}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
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
        font-size: calc(var(--xl-font-size) * 1.5);
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

    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
        font-family: "Inter", sans-serif;
    }

    .panel {
        border: 2px solid #1d1a16;
        padding: var(--md-gap);
        background: #ffffff;
        display: grid;
        gap: var(--sm-gap);
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

        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
