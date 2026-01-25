<script lang="ts">
    const stats = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
    ];

    const results = [
        { match: "Q-49", red: 205, blue: 172 },
        { match: "Q-50", red: 180, blue: 186 },
        { match: "Q-51", red: 198, blue: 178 },
    ];
</script>

<div class="brutalist event">
    <header class="hero">
        <div>
            <p class="kicker">Brutalist</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Jan 13, 2024</p>
        </div>
        <button type="button">Download</button>
    </header>

    <section class="stat-grid">
        {#each stats as stat}
            <div class="stat-box">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="block">
        <h2>Recent Results</h2>
        {#each results as match}
            <div class="row">
                <span class="match">{match.match}</span>
                <span class="score red">{match.red}</span>
                <span class="score blue">{match.blue}</span>
            </div>
        {/each}
    </section>
</div>

<style>
    .brutalist {
        background: #ffffff;
        color: #0b0b0b;
        border-radius: 0;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
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
        grid-template-columns: 80px 1fr 1fr;
        gap: var(--md-gap);
        align-items: center;
        font-weight: 700;
    }

    .match {
        background: #0b0b0b;
        color: #ffffff;
        padding: 6px 8px;
        text-align: center;
    }

    .score {
        border: 3px solid #0b0b0b;
        text-align: center;
        padding: 6px 0;
    }

    .score.red {
        background: #ff5a5a;
    }

    .score.blue {
        background: #57a0ff;
    }

    @media (max-width: 700px) {
        .stat-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
