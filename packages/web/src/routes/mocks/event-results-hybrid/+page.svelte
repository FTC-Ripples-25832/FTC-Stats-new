<script lang="ts">
    const summary = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
    ];

    const results = [
        { match: "Finals 2", score: "214 - 189", note: "Auto surge" },
        { match: "Finals 1", score: "198 - 181", note: "Clean match" },
        { match: "Semi 3", score: "201 - 176", note: "Fast cycle" },
    ];

    const standings = [
        { rank: 1, team: "11503", rp: 29 },
        { rank: 2, team: "7421", rp: 27 },
        { rank: 3, team: "9064", rp: 26 },
    ];
</script>

<div class="hybrid-event">
    <header class="hero">
        <div>
            <p class="kicker">Event results - editorial x brutal</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Save recap</button>
    </header>

    <section class="summary">
        {#each summary as item}
            <div class="summary-item">
                <span class="label">{item.label}</span>
                <span class="value">{item.value}</span>
            </div>
        {/each}
    </section>

    <section class="grid">
        <div class="block standings">
            <h2>Standings</h2>
            {#each standings as row}
                <div class="row">
                    <span class="rank">#{row.rank}</span>
                    <span class="team">Team {row.team}</span>
                    <span class="rp">{row.rp} RP</span>
                </div>
            {/each}
        </div>

        <div class="block results">
            <h2>Playoff Results</h2>
            {#each results as result}
                <div class="result-row">
                    <span class="match">{result.match}</span>
                    <span class="score">{result.score}</span>
                    <span class="note">{result.note}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="callout">
        <p class="callout-label">Highlight</p>
        <p class="callout-text">
            Alliance 2 kept a steady lead through teleop, sealing the finals in two matches.
        </p>
    </section>
</div>

<style>
    .hybrid-event {
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
        letter-spacing: 0.18em;
        font-size: var(--xs-font-size);
    }

    .summary-item .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .block {
        border: 3px solid #1d1a16;
        padding: var(--lg-gap);
        background: #ffffff;
    }

    .block h2 {
        margin: 0 0 var(--md-gap);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--sm-font-size);
        font-family: "Inter", sans-serif;
    }

    .row,
    .result-row {
        display: grid;
        grid-template-columns: 60px 1fr auto;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        font-size: var(--sm-font-size);
    }

    .row:last-child,
    .result-row:last-child {
        border-bottom: none;
    }

    .rank {
        font-weight: 700;
    }

    .note {
        color: rgba(0, 0, 0, 0.6);
    }

    .callout {
        border: 3px solid #1d1a16;
        background: #f1e7d8;
        padding: var(--lg-gap);
    }

    .callout-label {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    .callout-text {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    @media (max-width: 900px) {
        .summary {
            grid-template-columns: 1fr;
        }

        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
