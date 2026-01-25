<script lang="ts">
    const stats = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
    ];

    const matches = [
        { match: "Q-49", red: 205, blue: 172 },
        { match: "Q-50", red: 180, blue: 186 },
        { match: "Q-51", red: 198, blue: 178 },
    ];
</script>

<div class="flat event">
    <header class="hero">
        <div>
            <p class="eyebrow">Flat color blocks</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Jan 13, 2024</p>
        </div>
        <button type="button">Share</button>
    </header>

    <section class="stat-row">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <h2>Recent Results</h2>
        <div class="list">
            {#each matches as match}
                <div class="row">
                    <span class="match">{match.match}</span>
                    <span class="score red">{match.red}</span>
                    <span class="score blue">{match.blue}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .flat {
        background: #f2f2f2;
        color: #1b1b1b;
        border-radius: 16px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Inter", sans-serif;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: #fff2b0;
        padding: var(--lg-gap);
        border-radius: 12px;
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #5b5b5b;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .meta {
        margin: 0;
        color: #5b5b5b;
    }

    button {
        border: none;
        background: #1b1b1b;
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        cursor: pointer;
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat-card {
        background: #d6ecff;
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--sm-gap);
    }

    .stat-card:nth-child(2) {
        background: #ffd6f5;
    }

    .stat-card:nth-child(3) {
        background: #d7ffd6;
    }

    .stat-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #4a4a4a;
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .panel {
        background: #ffffff;
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--md-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .list {
        display: grid;
        gap: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 80px 1fr 1fr;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 8px;
        background: #f4f4f4;
        font-size: var(--sm-font-size);
    }

    .match {
        font-weight: 700;
    }

    .score {
        text-align: center;
        border-radius: 6px;
        padding: 4px 0;
        font-weight: 700;
    }

    .score.red {
        background: #ffbdbd;
    }

    .score.blue {
        background: #bfe0ff;
    }

    @media (max-width: 900px) {
        .stat-row {
            grid-template-columns: 1fr;
        }
    }
</style>
