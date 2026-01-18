<script lang="ts">
    const metrics = [
        { label: "Matches played", value: "64 / 120" },
        { label: "Avg cycle time", value: "1:42" },
        { label: "Ranking refresh", value: "2 min" },
    ];

    const timeline = [
        { time: "8:30 AM", label: "Field opens", status: "done" },
        { time: "9:00 AM", label: "Driver meeting", status: "done" },
        { time: "9:45 AM", label: "Qualification block 1", status: "live" },
        { time: "12:15 PM", label: "Lunch break", status: "upcoming" },
        { time: "1:00 PM", label: "Qualification block 2", status: "upcoming" },
    ];

    const matches = [
        {
            id: "Q-32",
            status: "On deck",
            time: "10:42 AM",
            red: ["11503", "7421", "12089"],
            blue: ["9120", "9064", "6024"],
        },
        {
            id: "Q-33",
            status: "Next",
            time: "10:50 AM",
            red: ["8112", "5149", "4021"],
            blue: ["10321", "6322", "11892"],
        },
    ];

    const alerts = [
        "Field 2 running 4 minutes behind schedule.",
        "Updated inspection checklist posted to pit board.",
        "Queue gate 3 now open for block 1.",
    ];
</script>

<div class="mock-page">
    <section class="mock-panel hero">
        <div class="hero-main">
            <p class="eyebrow">Event ops concept</p>
            <h1>Midwest Qualifier - Event Flow</h1>
            <p class="mock-muted">
                A match-day view for field crews and scouts. Highlights schedule flow, live match cards,
                and pit alerts in one screen.
            </p>
        </div>
        <div class="hero-metrics">
            {#each metrics as metric}
                <div class="metric-card">
                    <span class="label">{metric.label}</span>
                    <span class="value">{metric.value}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="content-grid">
        <div class="mock-panel panel timeline">
            <div class="panel-head">
                <h2>Schedule Timeline</h2>
                <span class="chip muted">Live now</span>
            </div>
            <div class="timeline-list">
                {#each timeline as item}
                    <div class={`timeline-row ${item.status}`}>
                        <div class="status-dot"></div>
                        <div>
                            <div class="time">{item.time}</div>
                            <div class="label">{item.label}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="mock-panel panel now-playing">
            <div class="panel-head">
                <div>
                    <h2>Now Playing</h2>
                    <p class="mock-muted">Live match cards for quick scanning.</p>
                </div>
                <button class="mock-button" type="button">Open full queue</button>
            </div>
            <div class="match-stack">
                {#each matches as match}
                    <div class="match-card">
                        <div class="match-head">
                            <span class="match-id">{match.id}</span>
                            <span class="match-status">{match.status}</span>
                            <span class="match-time">{match.time}</span>
                        </div>
                        <div class="alliances">
                            <div class="alliance red">
                                <span class="tag">Red</span>
                                <div class="teams">
                                    {#each match.red as team}
                                        <span>{team}</span>
                                    {/each}
                                </div>
                            </div>
                            <div class="alliance blue">
                                <span class="tag">Blue</span>
                                <div class="teams">
                                    {#each match.blue as team}
                                        <span>{team}</span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <section class="mock-panel panel alerts">
        <div class="panel-head">
            <div>
                <h2>Pit Alerts</h2>
                <p class="mock-muted">Operational updates and queue changes.</p>
            </div>
            <div class="pill-row">
                <span class="mock-chip active">Ops</span>
                <span class="mock-chip">Judging</span>
                <span class="mock-chip">Robot</span>
            </div>
        </div>
        <ul class="alerts-list">
            {#each alerts as alert}
                <li>{alert}</li>
            {/each}
        </ul>
    </section>
</div>

<style>
    .mock-page {
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
    }

    .hero {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: var(--xl-gap);
        background: linear-gradient(
            120deg,
            rgba(var(--blue-team-color-vs), 0.18),
            rgba(var(--theme-color-vs), 0.05)
        );
        align-items: center;
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--blue-team-color-vs), 0.75);
        margin: 0 0 var(--sm-gap);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.15);
    }

    .hero-metrics {
        display: grid;
        gap: var(--md-gap);
    }

    .metric-card {
        border-radius: 12px;
        padding: var(--lg-gap);
        background: var(--fg-color);
        border: 1px solid rgba(var(--blue-team-color-vs), 0.2);
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .metric-card .label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .metric-card .value {
        font-size: var(--vl-font-size);
        font-weight: 700;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: var(--xl-gap);
    }

    .panel {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        align-items: center;
    }

    .panel h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .chip.muted {
        padding: 4px 10px;
        border-radius: var(--pill-border-radius);
        font-size: var(--xs-font-size);
        background: rgba(0, 0, 0, 0.05);
        color: var(--secondary-text-color);
    }

    .timeline-list {
        display: grid;
        gap: var(--lg-gap);
    }

    .timeline-row {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--md-gap);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.03);
    }

    .timeline-row .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.2);
    }

    .timeline-row.done .status-dot {
        background: rgb(67, 160, 71);
    }

    .timeline-row.live {
        border: 1px solid rgba(var(--theme-color-vs), 0.4);
        background: rgba(var(--theme-color-vs), 0.08);
    }

    .timeline-row.live .status-dot {
        background: rgba(var(--theme-color-vs), 0.9);
    }

    .timeline-row .time {
        font-weight: 700;
        font-size: var(--sm-font-size);
    }

    .timeline-row .label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .match-stack {
        display: grid;
        gap: var(--lg-gap);
    }

    .match-card {
        border-radius: 14px;
        padding: var(--lg-gap);
        background: rgba(0, 0, 0, 0.03);
        display: grid;
        gap: var(--md-gap);
    }

    .match-head {
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: var(--md-gap);
        align-items: center;
    }

    .match-id {
        font-weight: 700;
    }

    .match-status {
        padding: 4px 10px;
        border-radius: var(--pill-border-radius);
        background: rgba(var(--theme-color-vs), 0.2);
        font-size: var(--xs-font-size);
        font-weight: 700;
    }

    .match-time {
        text-align: right;
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .alliances {
        display: grid;
        gap: var(--md-gap);
    }

    .alliance {
        border-radius: 10px;
        padding: var(--md-gap);
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--md-gap);
        align-items: center;
        font-size: var(--sm-font-size);
    }

    .alliance.red {
        background: rgba(var(--red-team-color-vs), 0.12);
    }

    .alliance.blue {
        background: rgba(var(--blue-team-color-vs), 0.12);
    }

    .tag {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
    }

    .teams {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .alerts {
        gap: var(--lg-gap);
    }

    .pill-row {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .alerts-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
        color: var(--secondary-text-color);
    }

    @media (max-width: 1100px) {
        .hero {
            grid-template-columns: 1fr;
        }

        .content-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
