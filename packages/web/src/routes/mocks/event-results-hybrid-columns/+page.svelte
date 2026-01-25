<script lang="ts">
    const summary = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
    ];

    const standings = [
        { rank: 1, team: "11503", rp: 29 },
        { rank: 2, team: "7421", rp: 27 },
        { rank: 3, team: "9064", rp: 26 },
    ];

    const results = [
        { match: "Finals 2", score: "214 - 189" },
        { match: "Finals 1", score: "198 - 181" },
        { match: "Semi 3", score: "201 - 176" },
    ];
</script>

<div class="hybrid-columns">
    <header class="hero">
        <div>
            <p class="kicker">Event results - hybrid columns</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Export</button>
    </header>

    <section class="summary">
        {#each summary as item}
            <div class="summary-item">
                <span class="label">{item.label}</span>
                <span class="value">{item.value}</span>
            </div>
        {/each}
    </section>

    <section class="columns">
        <article class="story">
            <h2>Overview</h2>
            <p>
                Finals closed with a strong auto showing and consistent endgame execution. Alliance 2 kept
                the lead through teleop and sealed the match with a clean finish.
            </p>
            <p>
                Defense-heavy semifinal rounds kept scores tight, highlighting cycle efficiency and low
                penalties.
            </p>
        </article>

        <aside class="blocks">
            <div class="block">
                <h3>Standings</h3>
                {#each standings as row}
                    <div class="row">
                        <span class="rank">#{row.rank}</span>
                        <span class="team">Team {row.team}</span>
                        <span class="rp">{row.rp} RP</span>
                    </div>
                {/each}
            </div>
            <div class="block">
                <h3>Playoff Scores</h3>
                {#each results as result}
                    <div class="row">
                        <span class="match">{result.match}</span>
                        <span class="score">{result.score}</span>
                    </div>
                {/each}
            </div>
        </aside>
    </section>
</div>

<style>
    .hybrid-columns {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 12px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 3px solid #1d1a16;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 3px solid #1d1a16;
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
        font-size: calc(var(--xl-font-size) * 1.4);
    }

    .meta {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 3px solid #1d1a16;
        background: #ffdb00;
        padding: 8px 14px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
        font-family: "Inter", sans-serif;
    }

    .summary-item {
        border: 3px solid #1d1a16;
        padding: var(--md-gap);
        background: #ffffff;
    }

    .summary-item .label {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
    }

    .summary-item .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .columns {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--xl-gap);
    }

    .story h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    .story p {
        font-size: var(--md-font-size);
        line-height: 1.6;
    }

    .blocks {
        display: grid;
        gap: var(--lg-gap);
        font-family: "Inter", sans-serif;
    }

    .block {
        border: 3px solid #1d1a16;
        padding: var(--md-gap);
        background: #ffffff;
    }

    .block h3 {
        margin: 0 0 var(--md-gap);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--xs-font-size);
    }

    .row {
        display: grid;
        grid-template-columns: 70px 1fr auto;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        font-size: var(--sm-font-size);
    }

    .row:last-child {
        border-bottom: none;
    }

    .rank,
    .match {
        font-weight: 700;
    }

    .score {
        font-weight: 700;
        text-align: right;
    }

    @media (max-width: 900px) {
        .summary {
            grid-template-columns: 1fr;
        }

        .columns {
            grid-template-columns: 1fr;
        }
    }
</style>
