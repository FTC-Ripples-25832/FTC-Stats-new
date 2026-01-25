<script lang="ts">
    const stats = [
        { label: "Matches", value: "64 / 120", change: "+8 today" },
        { label: "Teams", value: "36", change: "4 divisions" },
        { label: "Avg score", value: "178", change: "+6" },
    ];

    const standings = [
        { rank: 1, team: "11503", rp: 29 },
        { rank: 2, team: "7421", rp: 27 },
        { rank: 3, team: "9064", rp: 26 },
    ];

    const matches = [
        { match: "Q-49", time: "10:50", red: 205, blue: 172 },
        { match: "Q-50", time: "10:58", red: 180, blue: 186 },
        { match: "Q-51", time: "11:06", red: 198, blue: 178 },
    ];
</script>

<div class="dashboard event">
    <header class="hero">
        <div>
            <p class="eyebrow">Dashboard modern</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Share</button>
    </header>

    <section class="stat-row">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
                <span class="note">{stat.change}</span>
            </div>
        {/each}
    </section>

    <section class="grid">
        <div class="panel">
            <div class="panel-head">
                <h2>Standings</h2>
                <button type="button">View all</button>
            </div>
            <div class="list">
                {#each standings as row}
                    <div class="row">
                        <span class="rank">#{row.rank}</span>
                        <span class="team">Team {row.team}</span>
                        <span class="rp">{row.rp} RP</span>
                    </div>
                {/each}
            </div>
        </div>
        <div class="panel">
            <div class="panel-head">
                <h2>Recent Matches</h2>
                <button type="button">Full schedule</button>
            </div>
            <div class="list">
                {#each matches as match}
                    <div class="row">
                        <span class="match">{match.match}</span>
                        <span class="time">{match.time}</span>
                        <span class="score red">{match.red}</span>
                        <span class="score blue">{match.blue}</span>
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>

<style>
    .dashboard {
        background: #f5f7fb;
        border-radius: 18px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--xl-gap);
        color: #1b1f2a;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: linear-gradient(120deg, #e6ecff, #ffffff);
        border-radius: 16px;
        padding: var(--lg-gap);
        box-shadow: 0 12px 24px rgba(16, 24, 40, 0.08);
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #667085;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.1);
    }

    .meta {
        margin: 0;
        color: #667085;
    }

    button {
        border: none;
        background: #2d6bff;
        color: white;
        padding: 10px 16px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .stat-card {
        background: #ffffff;
        border-radius: 14px;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--sm-gap);
        box-shadow: 0 10px 20px rgba(16, 24, 40, 0.08);
    }

    .stat-card .label {
        font-size: var(--sm-font-size);
        color: #667085;
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .stat-card .note {
        font-size: var(--sm-font-size);
        color: #2d6bff;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .panel {
        background: #ffffff;
        border-radius: 16px;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--md-gap);
        box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--md-font-size);
    }

    .panel-head button {
        background: #eef2ff;
        color: #2d6bff;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: var(--xs-font-size);
    }

    .list {
        display: grid;
        gap: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: var(--sm-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 10px;
        background: #f7f8fc;
        font-size: var(--sm-font-size);
    }

    .rank,
    .match {
        font-weight: 700;
    }

    .time {
        color: #667085;
    }

    .score {
        font-weight: 700;
        text-align: center;
        min-width: 40px;
        border-radius: 8px;
        padding: 4px 0;
    }

    .score.red {
        background: rgba(244, 67, 54, 0.12);
        color: #d32f2f;
    }

    .score.blue {
        background: rgba(33, 150, 243, 0.12);
        color: #1976d2;
    }

    @media (max-width: 900px) {
        .stat-row {
            grid-template-columns: 1fr;
        }

        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
