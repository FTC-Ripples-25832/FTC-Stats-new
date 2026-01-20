<script lang="ts">
    const stats = [
        { label: "Matches played", value: "64 / 120" },
        { label: "Teams", value: "36" },
        { label: "Avg score", value: "178" },
        { label: "Auto avg", value: "61" },
    ];

    const standings = [
        { rank: 1, team: "11503", name: "Kinetic Tigers", record: "10-1-0", rp: 29 },
        { rank: 2, team: "7421", name: "Circuit Breakers", record: "9-2-0", rp: 27 },
        { rank: 3, team: "9064", name: "Voltage Vipers", record: "9-2-0", rp: 26 },
        { rank: 4, team: "5127", name: "Blue Comet", record: "8-3-0", rp: 24 },
        { rank: 5, team: "12398", name: "Polaris Prime", record: "8-3-0", rp: 23 },
    ];

    const matches = [
        { id: "Q-48", time: "10:42", red: "198", blue: "165", highlight: "Auto bonus hit" },
        { id: "Q-49", time: "10:50", red: "205", blue: "172", highlight: "Clean match" },
        { id: "Q-50", time: "10:58", red: "180", blue: "186", highlight: "Penalty swing" },
        { id: "Q-51", time: "11:06", red: "201", blue: "178", highlight: "Fast cycle" },
    ];
</script>

<div class="mock-page minimal">
    <section class="mock-panel hero">
        <div class="hero-copy">
            <p class="eyebrow">Event results concept</p>
            <h1>Midwest Qualifier</h1>
            <p class="mock-muted">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <div class="hero-actions">
            <button class="mock-button" type="button">Share</button>
            <button class="mock-button primary" type="button">Download results</button>
        </div>
    </section>

    <section class="stat-row">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="content-grid">
        <div class="mock-panel table-panel">
            <div class="panel-head">
                <h2>Standings</h2>
                <span class="mock-muted">Qualifiers</span>
            </div>
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
                            <td class="rank">#{row.rank}</td>
                            <td class="team">
                                <span class="team-id">{row.team}</span>
                                <span class="team-name">{row.name}</span>
                            </td>
                            <td>{row.record}</td>
                            <td class="strong">{row.rp}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="mock-panel list-panel">
            <div class="panel-head">
                <h2>Recent Matches</h2>
                <span class="mock-muted">Latest results</span>
            </div>
            <div class="match-list">
                {#each matches as match}
                    <div class="match-row">
                        <div class="match-id">{match.id}</div>
                        <div class="match-time">{match.time}</div>
                        <div class="score red">{match.red}</div>
                        <div class="score blue">{match.blue}</div>
                        <div class="match-note">{match.highlight}</div>
                    </div>
                {/each}
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
        flex-wrap: wrap;
        gap: var(--lg-gap);
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
        grid-template-columns: repeat(4, minmax(0, 1fr));
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
        letter-spacing: 0.14em;
        color: var(--secondary-text-color);
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--xl-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
        margin-bottom: var(--lg-gap);
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
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

    tbody tr:nth-child(even) {
        background: rgba(0, 0, 0, 0.02);
    }

    .rank {
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.9);
    }

    .team {
        display: grid;
        gap: 2px;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: var(--secondary-text-color);
    }

    .strong {
        font-weight: 700;
    }

    .match-list {
        display: grid;
        gap: var(--sm-gap);
    }

    .match-row {
        display: grid;
        grid-template-columns: 60px 60px 1fr 1fr 1.6fr;
        gap: var(--sm-gap);
        align-items: center;
        padding: var(--sm-gap);
        border: 1px solid var(--sep-color);
        border-radius: 8px;
        font-size: var(--sm-font-size);
        background: var(--fg-color);
    }

    .match-id {
        font-weight: 700;
    }

    .match-time {
        color: var(--secondary-text-color);
    }

    .score {
        font-weight: 700;
        text-align: center;
        padding: 4px 0;
        border-radius: 6px;
    }

    .score.red {
        background: rgba(var(--red-team-color-vs), 0.12);
        color: rgb(var(--red-team-color-vs));
    }

    .score.blue {
        background: rgba(var(--blue-team-color-vs), 0.12);
        color: rgb(var(--blue-team-color-vs));
    }

    .match-note {
        color: var(--secondary-text-color);
    }

    @media (max-width: 1000px) {
        .content-grid {
            grid-template-columns: 1fr;
        }

        .stat-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .stat-row {
            grid-template-columns: 1fr;
        }

        .match-row {
            grid-template-columns: 1fr 1fr;
        }

        .match-note {
            grid-column: span 2;
        }
    }
</style>
