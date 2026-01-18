<script lang="ts">
    const kpis = [
        { label: "Active events", value: "42", delta: "+6 today", trend: "up" },
        { label: "Teams tracked", value: "1,284", delta: "+120 this week", trend: "up" },
        { label: "Watchlist alerts", value: "9", delta: "3 new", trend: "neutral" },
    ];

    const pulse = [68, 45, 82, 57, 91, 62, 74, 40, 66, 88, 53, 71];

    const queue = [
        { team: "11503", name: "Kinetic Tigers", status: "Queued", eta: "8 min" },
        { team: "7421", name: "Circuit Breakers", status: "Reviewing", eta: "12 min" },
        { team: "12398", name: "Voltage Vipers", status: "Ready", eta: "18 min" },
        { team: "9912", name: "Blue Comet", status: "Queued", eta: "25 min" },
    ];

    const movers = [
        { team: "14241", change: "+18", label: "Auto scoring" },
        { team: "9064", change: "+12", label: "Endgame" },
        { team: "5127", change: "+9", label: "Cycle time" },
    ];
</script>

<div class="mock-page">
    <section class="mock-panel hero">
        <div class="hero-copy">
            <p class="eyebrow">Dashboard concept</p>
            <h1>Command Center</h1>
            <p class="mock-muted">
                One place to track events, teams, and scouting focus. Built for fast scanning with clear
                signals and actionable next steps.
            </p>
            <div class="hero-actions">
                <button class="mock-button primary" type="button">Create watchlist</button>
                <button class="mock-button" type="button">Share dashboard</button>
            </div>
        </div>
        <div class="hero-kpis">
            {#each kpis as kpi}
                <div class="kpi-card">
                    <span class="label">{kpi.label}</span>
                    <span class="value">{kpi.value}</span>
                    <span class={`delta ${kpi.trend}`}>{kpi.delta}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="mock-panel toolbar">
        <div class="toolbar-row">
            <div class="chip-row">
                <button class="mock-chip active" type="button">Season 2024</button>
                <button class="mock-chip" type="button">Midwest</button>
                <button class="mock-chip" type="button">Qualifiers</button>
                <button class="mock-chip" type="button">Top 25%</button>
            </div>
            <div class="toolbar-actions">
                <button class="mock-button" type="button">Filter alerts</button>
                <button class="mock-button" type="button">Save view</button>
            </div>
        </div>
        <div class="search-row">
            <input class="mock-input" type="text" placeholder="Search team, event, or match" />
            <button class="mock-button primary" type="button">New scout task</button>
        </div>
    </section>

    <section class="content-grid">
        <div class="mock-panel panel span-2">
            <div class="panel-head">
                <div>
                    <h2>Live Match Pulse</h2>
                    <p class="mock-muted">Realtime momentum across watched events.</p>
                </div>
                <span class="chip muted">Last 30 mins</span>
            </div>
            <div class="pulse">
                {#each pulse as value}
                    <div class="pulse-bar" style="--value: {value}"></div>
                {/each}
            </div>
            <div class="pulse-footer">
                <div>
                    <span class="dot"></span>
                    <span class="mock-muted">Auto scoring spike</span>
                </div>
                <div>
                    <span class="dot neutral"></span>
                    <span class="mock-muted">Defense heavy</span>
                </div>
                <div>
                    <span class="dot warm"></span>
                    <span class="mock-muted">Endgame surge</span>
                </div>
            </div>
        </div>

        <div class="mock-panel panel">
            <div class="panel-head">
                <h2>Scout Queue</h2>
                <span class="chip muted">12 total</span>
            </div>
            <div class="queue">
                {#each queue as item}
                    <div class="queue-row">
                        <div>
                            <span class="team-id">#{item.team}</span>
                            <span class="team-name">{item.name}</span>
                        </div>
                        <div class="queue-meta">
                            <span class="status">{item.status}</span>
                            <span class="mock-muted">{item.eta}</span>
                        </div>
                    </div>
                {/each}
            </div>
            <button class="mock-button full" type="button">Open queue board</button>
        </div>

        <div class="mock-panel panel">
            <div class="panel-head">
                <h2>Top Movers</h2>
                <span class="chip muted">Last 6 matches</span>
            </div>
            <div class="movers">
                {#each movers as mover}
                    <div class="mover-row">
                        <div class="mover-team">Team {mover.team}</div>
                        <div class="mover-meta">
                            <span class="mover-change">+{mover.change}%</span>
                            <span class="mock-muted">{mover.label}</span>
                        </div>
                    </div>
                {/each}
            </div>
            <hr class="mock-divider" />
            <div class="trend-card">
                <p class="mock-muted">Priority focus</p>
                <h3>Auto reliability audit</h3>
                <p class="mock-muted">5 teams missing >20% of cycles</p>
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
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--xl-gap);
        align-items: center;
        background: linear-gradient(
            120deg,
            rgba(var(--theme-color-vs), 0.12),
            rgba(var(--theme-color-vs), 0.02)
        );
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.8);
        margin: 0 0 var(--sm-gap);
    }

    h1 {
        margin: 0;
        font-size: calc(var(--xl-font-size) * 1.3);
    }

    .hero-actions {
        display: flex;
        gap: var(--md-gap);
        margin-top: var(--lg-gap);
        flex-wrap: wrap;
    }

    .hero-kpis {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .kpi-card {
        background: var(--fg-color);
        border: 1px solid rgba(var(--theme-color-vs), 0.2);
        border-radius: 12px;
        padding: var(--lg-gap);
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        min-height: 110px;
    }

    .kpi-card .label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .kpi-card .value {
        font-size: var(--vl-font-size);
        font-weight: 700;
    }

    .kpi-card .delta {
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .kpi-card .delta.up {
        color: rgb(67, 160, 71);
    }

    .kpi-card .delta.neutral {
        color: var(--secondary-text-color);
    }

    .toolbar {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .toolbar-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
    }

    .chip-row {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .toolbar-actions {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .search-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--md-gap);
    }

    .content-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .panel {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        align-items: flex-start;
    }

    .chip.muted {
        padding: 4px 10px;
        border-radius: var(--pill-border-radius);
        font-size: var(--xs-font-size);
        background: rgba(0, 0, 0, 0.05);
        color: var(--secondary-text-color);
    }

    .span-2 {
        grid-column: span 2;
    }

    .pulse {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: var(--sm-gap);
        align-items: end;
        min-height: 140px;
    }

    .pulse-bar {
        height: calc(var(--value) * 1%);
        border-radius: 8px 8px 4px 4px;
        background: linear-gradient(
            180deg,
            rgba(var(--theme-color-vs), 0.7),
            rgba(var(--theme-color-vs), 0.2)
        );
    }

    .pulse-footer {
        display: flex;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        font-size: var(--sm-font-size);
    }

    .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 6px;
        background: rgba(var(--theme-color-vs), 0.7);
    }

    .dot.neutral {
        background: rgba(0, 0, 0, 0.3);
    }

    .dot.warm {
        background: rgba(252, 160, 22, 0.9);
    }

    .queue {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .queue-row {
        display: flex;
        justify-content: space-between;
        gap: var(--lg-gap);
        align-items: center;
        padding: var(--md-gap);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.03);
    }

    .team-id {
        font-weight: 700;
        margin-right: var(--sm-gap);
    }

    .team-name {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    .queue-meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
        text-align: right;
        font-size: var(--sm-font-size);
    }

    .status {
        font-weight: 600;
        color: rgba(var(--theme-color-vs), 0.9);
    }

    .mock-button.full {
        width: 100%;
    }

    .movers {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .mover-row {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        align-items: center;
        padding-bottom: var(--sm-gap);
        border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
    }

    .mover-team {
        font-weight: 600;
    }

    .mover-meta {
        text-align: right;
        font-size: var(--sm-font-size);
    }

    .mover-change {
        font-weight: 700;
        color: rgb(67, 160, 71);
        display: block;
    }

    .trend-card h3 {
        margin: 4px 0;
        font-size: var(--md-font-size);
    }

    @media (max-width: 1100px) {
        .hero {
            grid-template-columns: 1fr;
        }

        .hero-kpis {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .content-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .span-2 {
            grid-column: span 2;
        }
    }

    @media (max-width: 800px) {
        .hero-kpis {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .search-row {
            grid-template-columns: 1fr;
        }

        .content-grid {
            grid-template-columns: 1fr;
        }

        .span-2 {
            grid-column: span 1;
        }
    }
</style>
