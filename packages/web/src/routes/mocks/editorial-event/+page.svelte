<script lang="ts">
    const summary = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Top score", value: "214" },
    ];

    const standings = [
        { rank: 1, team: "11503", record: "10-1-0" },
        { rank: 2, team: "7421", record: "9-2-0" },
        { rank: 3, team: "9064", record: "9-2-0" },
    ];

    const results = [
        { match: "Finals 2", score: "214 - 189" },
        { match: "Finals 1", score: "198 - 181" },
        { match: "Semi 3", score: "201 - 176" },
    ];
</script>

<div class="editorial event">
    <header class="masthead">
        <div>
            <p class="kicker">Editorial</p>
            <h1>Midwest Qualifier</h1>
            <p class="byline">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Share recap</button>
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
        <div class="panel">
            <h2>Final Standings</h2>
            {#each standings as row}
                <div class="row">
                    <span class="rank">{row.rank}</span>
                    <span class="team">Team {row.team}</span>
                    <span class="record">{row.record}</span>
                </div>
            {/each}
        </div>
        <div class="panel">
            <h2>Playoff Results</h2>
            {#each results as result}
                <div class="row">
                    <span class="match">{result.match}</span>
                    <span class="score">{result.score}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .editorial {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .masthead {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 2px solid #1d1a16;
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
        font-size: calc(var(--xl-font-size) * 1.6);
    }

    .byline {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 1px solid #1d1a16;
        background: transparent;
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
    }

    .summary-item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding-bottom: var(--md-gap);
    }

    .summary-item .label {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    .summary-item .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .panel {
        padding: var(--lg-gap);
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
    }

    .panel h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    .row {
        display: grid;
        grid-template-columns: 40px 1fr auto;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: var(--sm-font-size);
    }

    .row:last-child {
        border-bottom: none;
    }

    .rank,
    .match {
        font-weight: 700;
    }

    .record,
    .score {
        color: rgba(0, 0, 0, 0.6);
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
