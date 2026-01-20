<script lang="ts">
    const badges = ["Auto 92%", "Cycle 1.8s", "Endgame 4/5", "Defense A"];

    const kpis = [
        { label: "OPR", value: "192", note: "+5 this week" },
        { label: "Win rate", value: "82%", note: "10-1-0" },
        { label: "Auto avg", value: "68", note: "Top 5%" },
    ];

    const highlights = [
        "High auto reliability with center spike.",
        "Best when paired with a defense anchor.",
        "Consistent endgame climb rate.",
    ];

    const events = [
        { name: "Midwest Qualifier", result: "1st", record: "10-1-0" },
        { name: "Central League", result: "2nd", record: "8-3-0" },
    ];
</script>

<div class="mock-page team-cards">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Team page concept</p>
            <h1>Team 11503 - Kinetic Tigers</h1>
            <p class="mock-muted">Profile with highlights and stat cards.</p>
            <div class="badge-row">
                {#each badges as badge}
                    <span class="badge">{badge}</span>
                {/each}
            </div>
        </div>
        <button class="mock-button primary" type="button">Compare teams</button>
    </section>

    <section class="kpi-grid">
        {#each kpis as kpi}
            <div class="kpi-card">
                <span class="label">{kpi.label}</span>
                <span class="value">{kpi.value}</span>
                <span class="note">{kpi.note}</span>
            </div>
        {/each}
    </section>

    <section class="mock-panel content-grid">
        <div class="highlight-card">
            <div class="panel-head">
                <h2>Scout Highlights</h2>
                <span class="mock-muted">Latest notes</span>
            </div>
            <ul>
                {#each highlights as item}
                    <li>{item}</li>
                {/each}
            </ul>
        </div>
        <div class="event-card">
            <div class="panel-head">
                <h2>Event Results</h2>
                <button class="mock-button" type="button">Full history</button>
            </div>
            <div class="event-list">
                {#each events as event}
                    <div class="event-row">
                        <div>
                            <span class="event-name">{event.name}</span>
                            <span class="mock-muted">{event.record}</span>
                        </div>
                        <span class="result">{event.result}</span>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <section class="mock-panel trend-panel">
        <div class="panel-head">
            <h2>Match Trend</h2>
            <span class="mock-muted">Last 6 matches</span>
        </div>
        <div class="trend-bars">
            <span style="--value: 82"></span>
            <span style="--value: 74"></span>
            <span style="--value: 90"></span>
            <span style="--value: 68"></span>
            <span style="--value: 86"></span>
            <span style="--value: 79"></span>
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
        flex-wrap: wrap;
        gap: var(--lg-gap);
        background: radial-gradient(
            circle at top left,
            rgba(var(--theme-color-vs), 0.2),
            rgba(0, 0, 0, 0)
        );
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .badge-row {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
        margin-top: var(--md-gap);
    }

    .badge {
        padding: 6px 12px;
        border-radius: var(--pill-border-radius);
        background: rgba(var(--theme-color-vs), 0.12);
        color: rgba(var(--theme-color-vs), 0.9);
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .kpi-card {
        padding: var(--xl-gap);
        border-radius: 18px;
        background: var(--fg-color);
        border: 1px solid rgba(var(--theme-color-vs), 0.2);
        display: grid;
        gap: var(--sm-gap);
        box-shadow: 0 18px 28px rgba(0, 0, 0, 0.05);
    }

    .kpi-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--secondary-text-color);
    }

    .kpi-card .value {
        font-size: calc(var(--xl-font-size) * 1.1);
        font-weight: 700;
    }

    .kpi-card .note {
        font-size: var(--sm-font-size);
        color: rgba(var(--theme-color-vs), 0.85);
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--xl-gap);
    }

    .highlight-card,
    .event-card {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
        color: var(--secondary-text-color);
    }

    .event-list {
        display: grid;
        gap: var(--md-gap);
    }

    .event-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--md-gap);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.03);
    }

    .event-name {
        font-weight: 600;
        display: block;
        margin-bottom: 2px;
    }

    .result {
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.9);
    }

    .trend-panel {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .trend-bars {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: var(--sm-gap);
        align-items: end;
        min-height: 120px;
    }

    .trend-bars span {
        height: calc(var(--value) * 1%);
        border-radius: 8px 8px 4px 4px;
        background: linear-gradient(
            180deg,
            rgba(var(--theme-color-vs), 0.7),
            rgba(var(--theme-color-vs), 0.2)
        );
    }

    @media (max-width: 1100px) {
        .kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .content-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 700px) {
        .kpi-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
