<script lang="ts">
    const stats = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
        { label: "Avg score", value: "178" },
    ];

    const finals = [
        { match: "Finals 2", red: 214, blue: 189 },
        { match: "Finals 1", red: 198, blue: 181 },
    ];
</script>

<div class="hybrid-poster">
    <header class="hero">
        <div>
            <p class="kicker">Event results - hybrid poster</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Save recap</button>
    </header>

    <section class="stat-grid">
        {#each stats as stat}
            <div class="stat-box">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="scoreboard">
        <h2>Finals Scoreboard</h2>
        <div class="score-grid">
            {#each finals as match}
                <div class="score-card">
                    <span class="match">{match.match}</span>
                    <div class="scores">
                        <span class="score red">{match.red}</span>
                        <span class="score blue">{match.blue}</span>
                    </div>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .hybrid-poster {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 12px;
        padding: calc(var(--xl-gap) * 1.2);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 4px solid #1d1a16;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 4px solid #1d1a16;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.22em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.8);
        text-transform: uppercase;
    }

    .meta {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 4px solid #1d1a16;
        background: #ffdb00;
        padding: 10px 16px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .stat-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
        font-family: "Inter", sans-serif;
    }

    .stat-box {
        border: 4px solid #1d1a16;
        background: #ffffff;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--sm-gap);
    }

    .stat-box .label {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
    }

    .stat-box .value {
        font-size: var(--vl-font-size);
        font-weight: 800;
    }

    .scoreboard {
        border: 4px solid #1d1a16;
        padding: var(--lg-gap);
        background: #ffffff;
    }

    .scoreboard h2 {
        margin: 0 0 var(--md-gap);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--sm-font-size);
        font-family: "Inter", sans-serif;
    }

    .score-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .score-card {
        border: 3px solid #1d1a16;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
        font-family: "Inter", sans-serif;
        font-weight: 700;
    }

    .match {
        text-transform: uppercase;
        font-size: var(--xs-font-size);
    }

    .scores {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--sm-gap);
    }

    .score {
        border: 3px solid #1d1a16;
        text-align: center;
        padding: 10px 0;
        font-size: var(--lg-font-size);
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

        .score-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .stat-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
