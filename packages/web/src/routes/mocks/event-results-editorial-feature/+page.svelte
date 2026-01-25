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
        { rank: 4, team: "5127", record: "8-3-0" },
    ];

    const highlights = [
        "Alliance 2 claims finals in two straight matches.",
        "Auto averages climbed 12 points across the final block.",
        "Defense-heavy semis kept scores below 170.",
    ];

    const results = [
        { match: "Finals 2", score: "214 - 189", note: "Auto surge" },
        { match: "Finals 1", score: "198 - 181", note: "Clean match" },
        { match: "Semi 3", score: "201 - 176", note: "Fast cycle" },
        { match: "Semi 2", score: "184 - 170", note: "Defense hold" },
    ];
</script>

<div class="editorial-feature">
    <header class="masthead">
        <div>
            <p class="kicker">Event results - editorial feature</p>
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

    <section class="layout">
        <article class="story">
            <h2>Event Overview</h2>
            <p>
                The Midwest Qualifier delivered a fast-paced finals run with consistent autonomous points and
                sharp endgame execution. Alliance 2 maintained a small lead throughout both finals matches.
            </p>
            <p>
                The winning lineup leaned on reliable auto cycles, while defense-heavy semifinal rounds
                compressed scoring windows.
            </p>
            <div class="callout">
                <p class="callout-label">Highlight</p>
                <p class="callout-text">Team 11503 achieved a 92% auto success rate across qualifiers.</p>
            </div>
        </article>

        <aside class="sidebar">
            <div class="panel standings">
                <h3>Final Standings</h3>
                {#each standings as row}
                    <div class="standing-row">
                        <span class="rank">{row.rank}</span>
                        <div>
                            <span class="team">Team {row.team}</span>
                            <span class="record">{row.record}</span>
                        </div>
                    </div>
                {/each}
            </div>

            <div class="panel highlights">
                <h3>Notes</h3>
                <ul>
                    {#each highlights as note}
                        <li>{note}</li>
                    {/each}
                </ul>
            </div>
        </aside>
    </section>

    <section class="panel results">
        <div class="panel-head">
            <h3>Playoff Results</h3>
            <span>Finals to semis</span>
        </div>
        <div class="results-grid">
            {#each results as result}
                <div class="result-row">
                    <span class="match">{result.match}</span>
                    <span class="score">{result.score}</span>
                    <span class="note">{result.note}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .editorial-feature {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
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

    .layout {
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

    .callout {
        border: 2px solid #1d1a16;
        background: #f1e7d8;
        padding: var(--lg-gap);
        margin-top: var(--lg-gap);
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

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel {
        padding: var(--lg-gap);
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
    }

    .panel h3 {
        margin: 0 0 var(--md-gap);
        font-size: var(--md-font-size);
    }

    .standing-row {
        display: grid;
        grid-template-columns: 40px 1fr;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: var(--sm-font-size);
    }

    .standing-row:last-child {
        border-bottom: none;
    }

    .rank {
        font-weight: 700;
    }

    .team {
        font-weight: 600;
        display: block;
    }

    .record {
        color: rgba(0, 0, 0, 0.6);
        font-size: var(--sm-font-size);
    }

    ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
    }

    .results {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
    }

    .results-grid {
        display: grid;
        gap: var(--sm-gap);
    }

    .result-row {
        display: grid;
        grid-template-columns: 120px 1fr auto;
        gap: var(--md-gap);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding: var(--sm-gap) 0;
        font-size: var(--sm-font-size);
    }

    .result-row:last-child {
        border-bottom: none;
    }

    .match {
        font-weight: 700;
    }

    .note {
        color: rgba(0, 0, 0, 0.6);
    }

    @media (max-width: 1000px) {
        .summary {
            grid-template-columns: 1fr;
        }

        .layout {
            grid-template-columns: 1fr;
        }
    }
</style>
