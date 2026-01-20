<script lang="ts">
    const teams = [
        { team: "11503", name: "Kinetic Tigers", role: "Anchor scorer", rating: "92" },
        { team: "7421", name: "Circuit Breakers", role: "Auto specialist", rating: "88" },
    ];

    const metrics = [
        { label: "OPR", left: 192, right: 184, max: 220 },
        { label: "Auto points", left: 68, right: 62, max: 80 },
        { label: "TeleOp points", left: 94, right: 90, max: 110 },
        { label: "Endgame points", left: 30, right: 32, max: 40 },
        { label: "Penalty avg", left: 4, right: 6, max: 10, reverse: true },
        { label: "Consistency", left: 92, right: 90, max: 100 },
    ];

    const highlights = [
        "Team 11503 leads in auto consistency and cycle pace.",
        "Team 7421 wins endgame efficiency with higher climb rate.",
        "Both teams are top 10% in defensive reliability.",
    ];
</script>

<div class="mock-page stats-compare">
    <section class="mock-panel hero">
        <div>
            <p class="eyebrow">Compare view concept</p>
            <h1>Side-by-Side Team Compare</h1>
            <p class="mock-muted">
                Designed for alliance selection: quick deltas, clear strengths, and visual matchups.
            </p>
        </div>
        <button class="mock-button primary" type="button">Save matchup</button>
    </section>

    <section class="team-row">
        {#each teams as team}
            <div class="team-card">
                <div class="team-header">
                    <div>
                        <span class="team-id">#{team.team}</span>
                        <h2>{team.name}</h2>
                    </div>
                    <span class="rating">{team.rating}</span>
                </div>
                <p class="mock-muted">Role: {team.role}</p>
                <div class="badge-row">
                    <span class="badge">Auto</span>
                    <span class="badge">Cycle</span>
                    <span class="badge">Endgame</span>
                </div>
            </div>
        {/each}
    </section>

    <section class="mock-panel compare-panel">
        <div class="panel-head">
            <h2>Stat Breakdown</h2>
            <span class="pill">Last 12 matches</span>
        </div>
        <div class="compare-grid">
            {#each metrics as metric}
                <div class="compare-row">
                    <span class="metric-label">{metric.label}</span>
                    <div class="bars">
                        <div
                            class={`bar left ${metric.reverse ? "reverse" : ""}`}
                            style={`--value: ${metric.left}; --max: ${metric.max}`}
                        >
                            <span>{metric.left}</span>
                        </div>
                        <div
                            class={`bar right ${metric.reverse ? "reverse" : ""}`}
                            style={`--value: ${metric.right}; --max: ${metric.max}`}
                        >
                            <span>{metric.right}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <section class="mock-panel insights">
        <div class="panel-head">
            <h2>Scout Highlights</h2>
            <button class="mock-button" type="button">Open notes</button>
        </div>
        <ul>
            {#each highlights as item}
                <li>{item}</li>
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: linear-gradient(
            120deg,
            rgba(var(--blue-team-color-vs), 0.16),
            rgba(var(--red-team-color-vs), 0.12)
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

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .team-card {
        padding: var(--xl-gap);
        border-radius: 18px;
        background: var(--fg-color);
        border: 1px solid rgba(0, 0, 0, 0.06);
        display: grid;
        gap: var(--md-gap);
    }

    .team-header {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        align-items: center;
    }

    .team-id {
        font-weight: 700;
        font-size: var(--sm-font-size);
    }

    .team-card h2 {
        margin: 4px 0 0;
        font-size: var(--lg-font-size);
    }

    .rating {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(var(--theme-color-vs), 0.15);
        font-weight: 700;
    }

    .badge-row {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
    }

    .badge {
        padding: 6px 12px;
        border-radius: var(--pill-border-radius);
        background: rgba(0, 0, 0, 0.05);
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .compare-panel,
    .insights {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .pill {
        padding: 6px 12px;
        border-radius: var(--pill-border-radius);
        background: rgba(0, 0, 0, 0.05);
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .compare-grid {
        display: grid;
        gap: var(--lg-gap);
    }

    .compare-row {
        display: grid;
        grid-template-columns: 160px 1fr;
        gap: var(--lg-gap);
        align-items: center;
    }

    .metric-label {
        font-weight: 600;
        font-size: var(--sm-font-size);
    }

    .bars {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .bar {
        --percent: calc(var(--value) / var(--max) * 100%);
        height: 36px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
    }

    .bar::before {
        content: "";
        position: absolute;
        inset: 0;
        width: var(--percent);
        background: linear-gradient(
            90deg,
            rgba(var(--theme-color-vs), 0.65),
            rgba(var(--theme-color-vs), 0.25)
        );
    }

    .bar.reverse::before {
        background: linear-gradient(
            90deg,
            rgba(244, 67, 54, 0.55),
            rgba(244, 67, 54, 0.2)
        );
    }

    .bar.right::before {
        background: linear-gradient(
            90deg,
            rgba(var(--blue-team-color-vs), 0.6),
            rgba(var(--blue-team-color-vs), 0.25)
        );
    }

    .bar.right.reverse::before {
        background: linear-gradient(
            90deg,
            rgba(244, 67, 54, 0.55),
            rgba(244, 67, 54, 0.2)
        );
    }

    .bar span {
        position: relative;
        z-index: 1;
        padding: 0 12px;
        font-weight: 700;
        line-height: 36px;
        font-size: var(--sm-font-size);
    }

    .insights ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
        color: var(--secondary-text-color);
    }

    @media (max-width: 900px) {
        .team-row {
            grid-template-columns: 1fr;
        }

        .compare-row {
            grid-template-columns: 1fr;
        }

        .bars {
            grid-template-columns: 1fr;
        }
    }
</style>
