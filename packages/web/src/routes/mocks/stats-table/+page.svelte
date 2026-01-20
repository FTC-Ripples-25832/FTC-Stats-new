<script lang="ts">
    const filters = ["Season 2024", "Midwest", "Qualifier", "Auto focus", "Top 30%"];

    const rows = [
        { rank: 1, team: "11503", name: "Kinetic Tigers", opr: 192, auto: 68, teleop: 94, endgame: 30, cons: "92%", trend: "+5" },
        { rank: 2, team: "7421", name: "Circuit Breakers", opr: 184, auto: 62, teleop: 90, endgame: 32, cons: "90%", trend: "+2" },
        { rank: 3, team: "9064", name: "Voltage Vipers", opr: 179, auto: 64, teleop: 82, endgame: 33, cons: "89%", trend: "+7" },
        { rank: 4, team: "5127", name: "Blue Comet", opr: 173, auto: 58, teleop: 86, endgame: 29, cons: "87%", trend: "+1" },
        { rank: 5, team: "12398", name: "Polaris Prime", opr: 170, auto: 55, teleop: 88, endgame: 27, cons: "86%", trend: "-1" },
        { rank: 6, team: "8112", name: "Mech Nova", opr: 166, auto: 53, teleop: 84, endgame: 29, cons: "85%", trend: "+3" },
    ];
</script>

<div class="mock-page stats-table">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Stats table concept</p>
            <h1>Team Stats Grid</h1>
            <p class="mock-muted">Dense, scannable layout for quick ranking review.</p>
        </div>
        <div class="hero-actions">
            <input class="mock-input search" type="text" placeholder="Search team or number" />
            <button class="mock-button primary" type="button">Export CSV</button>
        </div>
    </section>

    <section class="filters">
        <div class="filter-row">
            {#each filters as filter, i}
                <button class={`filter-chip ${i === 0 ? "active" : ""}`} type="button">{filter}</button>
            {/each}
        </div>
        <div class="filter-row compact">
            <button class="filter-chip" type="button">Show fielded teams</button>
            <button class="filter-chip" type="button">OPR</button>
            <button class="filter-chip" type="button">Sort: Auto</button>
        </div>
    </section>

    <section class="mock-panel table-panel">
        <div class="table-head">
            <h2>Ranking Table</h2>
            <p class="mock-muted">Live stats from 24 events.</p>
        </div>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team</th>
                        <th>OPR</th>
                        <th>Auto</th>
                        <th>TeleOp</th>
                        <th>Endgame</th>
                        <th>Consistency</th>
                        <th>Trend</th>
                    </tr>
                </thead>
                <tbody>
                    {#each rows as row}
                        <tr class={row.rank <= 3 ? "top" : ""}>
                            <td class="rank">#{row.rank}</td>
                            <td class="team">
                                <span class="team-id">{row.team}</span>
                                <span class="team-name">{row.name}</span>
                            </td>
                            <td class="strong">{row.opr}</td>
                            <td>{row.auto}</td>
                            <td>{row.teleop}</td>
                            <td>{row.endgame}</td>
                            <td class="pill">{row.cons}</td>
                            <td class={`trend ${row.trend.startsWith("-") ? "down" : "up"}`}>
                                {row.trend}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
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
        gap: var(--xl-gap);
        align-items: center;
        flex-wrap: wrap;
        background: linear-gradient(
            120deg,
            rgba(var(--theme-color-vs), 0.12),
            rgba(0, 0, 0, 0)
        );
    }

    .hero h1 {
        margin: 0;
        font-size: calc(var(--xl-font-size) * 1.1);
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.8);
    }

    .hero-actions {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
        align-items: center;
    }

    .search {
        width: min(320px, 100%);
    }

    .filters {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .filter-row {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
    }

    .filter-row.compact {
        font-size: var(--sm-font-size);
    }

    .filter-chip {
        border: 1px solid var(--sep-color);
        border-radius: 10px;
        padding: 6px 12px;
        background: var(--fg-color);
        font-size: var(--sm-font-size);
        font-weight: 600;
        cursor: pointer;
    }

    .filter-chip.active {
        background: rgba(var(--theme-color-vs), 0.12);
        border-color: rgba(var(--theme-color-vs), 0.4);
    }

    .table-panel {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .table-head h2 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    .table-wrap {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--sm-font-size);
        min-width: 720px;
    }

    thead th {
        text-align: left;
        font-weight: 700;
        padding: 10px 8px;
        border-bottom: 1px solid var(--sep-color);
        color: var(--secondary-text-color);
    }

    tbody td {
        padding: 12px 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    tbody tr.top {
        background: rgba(var(--theme-color-vs), 0.08);
    }

    tbody tr:hover {
        background: rgba(0, 0, 0, 0.03);
    }

    .rank {
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.9);
    }

    .team {
        display: flex;
        flex-direction: column;
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

    .pill {
        font-weight: 700;
        color: rgb(67, 160, 71);
    }

    .trend {
        font-weight: 700;
    }

    .trend.up {
        color: rgb(67, 160, 71);
    }

    .trend.down {
        color: rgb(244, 67, 54);
    }
</style>
