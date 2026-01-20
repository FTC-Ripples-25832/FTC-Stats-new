<script lang="ts">
    const kpis = [
        { label: "Active teams", value: "1,284", note: "Across 31 regions" },
        { label: "Avg OPR", value: "154", note: "Top 10% up 6 pts" },
        { label: "High score", value: "231", note: "World record match" },
    ];

    const insights = [
        { title: "Auto specialists", desc: "12 teams hitting 90% auto reliability.", badge: "Auto" },
        { title: "Fast cyclers", desc: "Top cycle time dropped to 1.6s.", badge: "TeleOp" },
        { title: "Endgame swing", desc: "Defense teams +18% endgame swing.", badge: "Endgame" },
        { title: "Penalty control", desc: "Teams with < 5 avg penalties.", badge: "Discipline" },
    ];

    const teams = [
        { team: "11503", name: "Kinetic Tigers", opr: 192, auto: 68, trend: "+5" },
        { team: "7421", name: "Circuit Breakers", opr: 184, auto: 62, trend: "+2" },
        { team: "9064", name: "Voltage Vipers", opr: 179, auto: 64, trend: "+7" },
        { team: "5127", name: "Blue Comet", opr: 173, auto: 58, trend: "+1" },
    ];
</script>

<div class="mock-page stats-cards">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Stats cards concept</p>
            <h1>Insight Tiles</h1>
            <p class="mock-muted">
                Highlights, trends, and shortlists surfaced before you dive into the full tables.
            </p>
        </div>
        <button class="mock-button primary" type="button">Create short list</button>
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

    <section class="mock-panel insight-panel">
        <div class="panel-head">
            <h2>Stat Insights</h2>
            <div class="pill-row">
                <span class="pill active">All</span>
                <span class="pill">Auto</span>
                <span class="pill">TeleOp</span>
                <span class="pill">Endgame</span>
            </div>
        </div>
        <div class="insight-grid">
            {#each insights as item}
                <div class="insight-card">
                    <span class="badge">{item.badge}</span>
                    <h3>{item.title}</h3>
                    <p class="mock-muted">{item.desc}</p>
                </div>
            {/each}
        </div>
    </section>

    <section class="mock-panel team-panel">
        <div class="panel-head">
            <div>
                <h2>Top Teams</h2>
                <p class="mock-muted">Quick tiles for scout captain review.</p>
            </div>
            <button class="mock-button" type="button">View full table</button>
        </div>
        <div class="team-grid">
            {#each teams as team}
                <div class="team-card">
                    <div class="team-head">
                        <span class="team-id">#{team.team}</span>
                        <span class="trend">{team.trend}</span>
                    </div>
                    <div class="team-name">{team.name}</div>
                    <div class="team-metrics">
                        <div>
                            <span class="label">OPR</span>
                            <span class="value">{team.opr}</span>
                        </div>
                        <div>
                            <span class="label">Auto</span>
                            <span class="value">{team.auto}</span>
                        </div>
                    </div>
                </div>
            {/each}
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
            ),
            var(--fg-color);
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

    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .kpi-card {
        padding: var(--xl-gap);
        border-radius: 18px;
        background: linear-gradient(
            140deg,
            rgba(var(--theme-color-vs), 0.18),
            rgba(0, 0, 0, 0.02)
        );
        display: grid;
        gap: var(--sm-gap);
        border: 1px solid rgba(var(--theme-color-vs), 0.2);
    }

    .kpi-card .label {
        font-size: var(--sm-font-size);
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

    .insight-panel,
    .team-panel {
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

    .pill-row {
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

    .pill.active {
        background: rgba(var(--theme-color-vs), 0.2);
        color: rgba(var(--theme-color-vs), 0.9);
    }

    .insight-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .insight-card {
        padding: var(--lg-gap);
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.03);
        display: grid;
        gap: var(--sm-gap);
    }

    .insight-card h3 {
        margin: 0;
        font-size: var(--md-font-size);
    }

    .badge {
        width: fit-content;
        padding: 4px 10px;
        border-radius: var(--pill-border-radius);
        font-size: var(--xs-font-size);
        font-weight: 700;
        background: rgba(var(--theme-color-vs), 0.12);
        color: rgba(var(--theme-color-vs), 0.9);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .team-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .team-card {
        padding: var(--lg-gap);
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.03);
        display: grid;
        gap: var(--md-gap);
    }

    .team-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .team-id {
        font-weight: 700;
    }

    .trend {
        font-weight: 700;
        color: rgb(67, 160, 71);
    }

    .team-name {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .team-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--sm-gap);
    }

    .team-metrics .label {
        font-size: var(--xs-font-size);
        color: var(--secondary-text-color);
    }

    .team-metrics .value {
        font-weight: 700;
        font-size: var(--md-font-size);
    }

    @media (max-width: 1100px) {
        .kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .team-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .kpi-grid,
        .insight-grid,
        .team-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
