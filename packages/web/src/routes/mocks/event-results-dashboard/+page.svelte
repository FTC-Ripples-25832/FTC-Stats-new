<script lang="ts">
    const schedule = [
        { time: "9:00 AM", label: "Driver meeting" },
        { time: "9:45 AM", label: "Qualifiers block 1" },
        { time: "12:15 PM", label: "Lunch break" },
        { time: "1:00 PM", label: "Qualifiers block 2" },
        { time: "3:00 PM", label: "Playoffs" },
    ];

    const nowPlaying = {
        id: "Q-52",
        red: ["11503", "5127", "12398"],
        blue: ["7421", "9064", "8112"],
        redScore: 201,
        blueScore: 194,
    };

    const results = [
        { id: "Q-49", red: 205, blue: 172, note: "Auto bonus hit" },
        { id: "Q-50", red: 180, blue: 186, note: "Penalty swing" },
        { id: "Q-51", red: 198, blue: 178, note: "Fast cycle" },
    ];
</script>

<div class="mock-page dashboard">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Event results concept</p>
            <h1>Midwest Qualifier Dashboard</h1>
            <p class="mock-muted">Live scoreboard and schedule control in one view.</p>
        </div>
        <div class="hero-actions">
            <button class="mock-button" type="button">Open queue</button>
            <button class="mock-button primary" type="button">Push update</button>
        </div>
    </section>

    <section class="split">
        <aside class="mock-panel schedule">
            <div class="panel-head">
                <h2>Schedule</h2>
                <span class="mock-muted">Today</span>
            </div>
            <div class="schedule-list">
                {#each schedule as item, i}
                    <div class={`schedule-row ${i === 1 ? "active" : ""}`}>
                        <span class="time">{item.time}</span>
                        <span class="label">{item.label}</span>
                    </div>
                {/each}
            </div>
        </aside>

        <div class="main">
            <div class="mock-panel scoreboard">
                <div class="panel-head">
                    <h2>Now Playing {nowPlaying.id}</h2>
                    <span class="mock-muted">Field 1</span>
                </div>
                <div class="score-row">
                    <div class="alliance red">
                        <span class="tag">Red</span>
                        <div class="teams">
                            {#each nowPlaying.red as team}
                                <span>{team}</span>
                            {/each}
                        </div>
                        <div class="score">{nowPlaying.redScore}</div>
                    </div>
                    <div class="alliance blue">
                        <span class="tag">Blue</span>
                        <div class="teams">
                            {#each nowPlaying.blue as team}
                                <span>{team}</span>
                            {/each}
                        </div>
                        <div class="score">{nowPlaying.blueScore}</div>
                    </div>
                </div>
                <div class="score-footer">
                    <span class="pill">Auto ready</span>
                    <span class="pill">TeleOp 1:12</span>
                    <span class="pill">Endgame 0:18</span>
                </div>
            </div>

            <div class="mock-panel results">
                <div class="panel-head">
                    <h2>Recent Results</h2>
                    <button class="mock-button" type="button">Open full list</button>
                </div>
                <div class="result-list">
                    {#each results as match}
                        <div class="result-row">
                            <span class="match-id">{match.id}</span>
                            <div class="result-score">
                                <span class="red">{match.red}</span>
                                <span class="dash">-</span>
                                <span class="blue">{match.blue}</span>
                            </div>
                            <span class="note">{match.note}</span>
                        </div>
                    {/each}
                </div>
            </div>
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
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: linear-gradient(
            120deg,
            rgba(var(--blue-team-color-vs), 0.2),
            rgba(var(--theme-color-vs), 0.08)
        );
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--blue-team-color-vs), 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.15);
    }

    .hero-actions {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .split {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: var(--xl-gap);
    }

    .schedule {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
        background: rgba(0, 0, 0, 0.02);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        align-items: center;
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .schedule-list {
        display: grid;
        gap: var(--md-gap);
    }

    .schedule-row {
        display: grid;
        gap: 4px;
        padding: var(--md-gap);
        border-radius: 10px;
        background: var(--fg-color);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .schedule-row.active {
        border-color: rgba(var(--theme-color-vs), 0.4);
        background: rgba(var(--theme-color-vs), 0.1);
    }

    .schedule-row .time {
        font-weight: 700;
        font-size: var(--sm-font-size);
    }

    .schedule-row .label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .main {
        display: grid;
        gap: var(--xl-gap);
    }

    .scoreboard {
        display: grid;
        gap: var(--lg-gap);
    }

    .score-row {
        display: grid;
        gap: var(--md-gap);
    }

    .alliance {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--lg-gap);
        border-radius: 14px;
        font-size: var(--sm-font-size);
    }

    .alliance.red {
        background: rgba(var(--red-team-color-vs), 0.12);
    }

    .alliance.blue {
        background: rgba(var(--blue-team-color-vs), 0.12);
    }

    .tag {
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
    }

    .teams {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
        color: var(--secondary-text-color);
    }

    .score {
        font-weight: 700;
        font-size: var(--vl-font-size);
    }

    .score-footer {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
    }

    .pill {
        padding: 6px 12px;
        border-radius: var(--pill-border-radius);
        background: rgba(0, 0, 0, 0.05);
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .results {
        display: grid;
        gap: var(--lg-gap);
    }

    .result-list {
        display: grid;
        gap: var(--sm-gap);
    }

    .result-row {
        display: grid;
        grid-template-columns: 80px 1fr 1.4fr;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--md-gap);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.03);
        font-size: var(--sm-font-size);
    }

    .match-id {
        font-weight: 700;
    }

    .result-score {
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .result-score .red {
        color: rgb(var(--red-team-color-vs));
    }

    .result-score .blue {
        color: rgb(var(--blue-team-color-vs));
    }

    .note {
        color: var(--secondary-text-color);
    }

    @media (max-width: 1000px) {
        .split {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 700px) {
        .result-row {
            grid-template-columns: 1fr;
        }
    }
</style>
