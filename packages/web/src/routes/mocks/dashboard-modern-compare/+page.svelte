<script lang="ts">
    const teams = [
        { team: "11503", name: "Kinetic Tigers" },
        { team: "7421", name: "Circuit Breakers" },
    ];

    const metrics = [
        { label: "OPR", left: 192, right: 184, max: 220 },
        { label: "Auto avg", left: 68, right: 62, max: 80 },
        { label: "TeleOp avg", left: 94, right: 90, max: 110 },
        { label: "Endgame avg", left: 30, right: 32, max: 40 },
    ];
</script>

<div class="dashboard compare">
    <header class="hero">
        <div>
            <p class="eyebrow">Dashboard modern</p>
            <h1>Team Compare</h1>
            <p class="meta">Midwest Qualifier</p>
        </div>
        <button type="button">Save view</button>
    </header>

    <section class="team-row">
        {#each teams as team}
            <div class="team-card">
                <span class="team-id">#{team.team}</span>
                <span class="team-name">{team.name}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <div class="panel-head">
            <h2>Metric Comparison</h2>
            <button type="button">Normalize</button>
        </div>
        <div class="metric-list">
            {#each metrics as metric}
                <div class="metric-row">
                    <span class="label">{metric.label}</span>
                    <div class="bars">
                        <div class="bar left" style={`--value: ${metric.left}; --max: ${metric.max}`}>
                            <span>{metric.left}</span>
                        </div>
                        <div class="bar right" style={`--value: ${metric.right}; --max: ${metric.max}`}>
                            <span>{metric.right}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .dashboard {
        background: #f5f7fb;
        border-radius: 18px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--xl-gap);
        color: #1b1f2a;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: linear-gradient(120deg, #e6ecff, #ffffff);
        border-radius: 16px;
        padding: var(--lg-gap);
        box-shadow: 0 12px 24px rgba(16, 24, 40, 0.08);
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #667085;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.1);
    }

    .meta {
        margin: 0;
        color: #667085;
    }

    button {
        border: none;
        background: #2d6bff;
        color: white;
        padding: 10px 16px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .team-card {
        background: #ffffff;
        border-radius: 14px;
        padding: var(--lg-gap);
        display: grid;
        gap: 4px;
        box-shadow: 0 10px 20px rgba(16, 24, 40, 0.08);
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: #667085;
    }

    .panel {
        background: #ffffff;
        border-radius: 16px;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--md-gap);
        box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--md-font-size);
    }

    .panel-head button {
        background: #eef2ff;
        color: #2d6bff;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: var(--xs-font-size);
    }

    .metric-list {
        display: grid;
        gap: var(--md-gap);
    }

    .metric-row {
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: var(--md-gap);
        align-items: center;
        font-size: var(--sm-font-size);
    }

    .label {
        font-weight: 600;
        color: #667085;
    }

    .bars {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .bar {
        --percent: calc(var(--value) / var(--max) * 100%);
        background: #f1f4f9;
        border-radius: 999px;
        height: 28px;
        position: relative;
        overflow: hidden;
    }

    .bar::before {
        content: "";
        position: absolute;
        inset: 0;
        width: var(--percent);
        background: linear-gradient(90deg, #2d6bff, #7aa4ff);
    }

    .bar.right::before {
        background: linear-gradient(90deg, #1b8a44, #65c87a);
    }

    .bar span {
        position: relative;
        z-index: 1;
        padding-left: 10px;
        line-height: 28px;
        font-weight: 700;
    }

    @media (max-width: 900px) {
        .team-row {
            grid-template-columns: 1fr;
        }

        .metric-row {
            grid-template-columns: 1fr;
        }

        .bars {
            grid-template-columns: 1fr;
        }
    }
</style>
