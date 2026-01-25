<script lang="ts">
    const stats = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
        { label: "Avg score", value: "178" },
    ];

    const matches = [
        { id: "Q-49", red: 205, blue: 172 },
        { id: "Q-50", red: 180, blue: 186 },
        { id: "Q-51", red: 198, blue: 178 },
        { id: "Q-52", red: 201, blue: 194 },
    ];

    const standings = [
        { rank: 1, team: "11503", rp: 29 },
        { rank: 2, team: "7421", rp: 27 },
        { rank: 3, team: "9064", rp: 26 },
        { rank: 4, team: "5127", rp: 24 },
    ];
</script>

<div class="brutal-grid">
    <header class="hero">
        <div>
            <p class="kicker">Event results - brutal grid</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Jan 13, 2024</p>
        </div>
        <button type="button">Print</button>
    </header>

    <section class="stat-grid">
        {#each stats as stat}
            <div class="stat-box">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="grid">
        <div class="block">
            <h2>Standings</h2>
            {#each standings as row}
                <div class="row">
                    <span class="rank">#{row.rank}</span>
                    <span class="team">Team {row.team}</span>
                    <span class="rp">{row.rp} RP</span>
                </div>
            {/each}
        </div>

        <div class="block">
            <h2>Score Wall</h2>
            <div class="score-wall">
                {#each matches as match}
                    <div class="score-card">
                        <span class="match">{match.id}</span>
                        <div class="score-row">
                            <span class="score red">{match.red}</span>
                            <span class="score blue">{match.blue}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>

<style>
    .brutal-grid {
        background: #ffffff;
        color: #0b0b0b;
        border-radius: 0;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        border: 4px solid #0b0b0b;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 4px solid #0b0b0b;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-weight: 700;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.5);
        text-transform: uppercase;
    }

    .meta {
        margin: 0;
        font-weight: 600;
    }

    button {
        border: 4px solid #0b0b0b;
        padding: 10px 16px;
        background: #ffdb00;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        cursor: pointer;
    }

    .stat-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat-box {
        border: 4px solid #0b0b0b;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--sm-gap);
        background: #f5f5f5;
    }

    .stat-box .label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: var(--xs-font-size);
    }

    .stat-box .value {
        font-size: var(--vl-font-size);
        font-weight: 800;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .block {
        border: 4px solid #0b0b0b;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--md-gap);
    }

    .block h2 {
        margin: 0;
        text-transform: uppercase;
        font-size: var(--lg-font-size);
        border-bottom: 4px solid #0b0b0b;
        padding-bottom: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 60px 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        font-weight: 700;
    }

    .rank {
        background: #0b0b0b;
        color: #ffffff;
        padding: 6px 8px;
        text-align: center;
    }

    .score-wall {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .score-card {
        border: 4px solid #0b0b0b;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
    }

    .match {
        text-transform: uppercase;
        font-weight: 700;
        font-size: var(--xs-font-size);
    }

    .score-row {
        display: flex;
        gap: var(--sm-gap);
    }

    .score {
        flex: 1;
        text-align: center;
        padding: 8px 0;
        border: 3px solid #0b0b0b;
        font-weight: 700;
    }

    .score.red {
        background: #ff5a5a;
    }

    .score.blue {
        background: #57a0ff;
    }

    @media (max-width: 900px) {
        .stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .stat-grid {
            grid-template-columns: 1fr;
        }

        .score-wall {
            grid-template-columns: 1fr;
        }
    }
</style>
