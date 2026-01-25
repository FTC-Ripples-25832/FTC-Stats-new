<script lang="ts">
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

<div class="bi event">
    <header class="topbar">
        <div>
            <h1>Midwest Qualifier</h1>
            <p>Event Results - Enterprise BI</p>
        </div>
        <div class="controls">
            <button type="button">Export</button>
            <button type="button">Save view</button>
        </div>
    </header>

    <section class="panel">
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
    </section>

    <section class="panel">
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
</style>
