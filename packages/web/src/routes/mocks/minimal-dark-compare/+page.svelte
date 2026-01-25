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

<div class="dark compare">
    <header>
        <div>
            <p class="eyebrow">Minimal dark</p>
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
        <h2>Metric Comparison</h2>
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
    .dark {
        background: #0f1117;
        color: #e6e8ee;
        border-radius: 16px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--lg-gap);
        border: 1px solid #1f2430;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--md-gap);
        border-bottom: 1px solid #1f2430;
        padding-bottom: var(--md-gap);
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #8b93a7;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    .meta {
        margin: 0;
        color: #8b93a7;
    }

    button {
        border: 1px solid #2a3142;
        background: transparent;
        color: #e6e8ee;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        cursor: pointer;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .team-card {
        border: 1px solid #1f2430;
        border-radius: 10px;
        padding: var(--md-gap);
        display: grid;
        gap: 4px;
        background: #131722;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: #8b93a7;
    }

    .panel {
        border: 1px solid #1f2430;
        border-radius: 12px;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
        background: #131722;
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
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
        color: #8b93a7;
    }

    .bars {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .bar {
        --percent: calc(var(--value) / var(--max) * 100%);
        background: #0f1117;
        border-radius: 999px;
        height: 26px;
        position: relative;
        overflow: hidden;
        border: 1px solid #1f2430;
    }

    .bar::before {
        content: "";
        position: absolute;
        inset: 0;
        width: var(--percent);
        background: #7aa2ff;
    }

    .bar.right::before {
        background: #5bd18a;
    }

    .bar span {
        position: relative;
        z-index: 1;
        padding-left: 8px;
        line-height: 26px;
        font-weight: 700;
        font-size: var(--xs-font-size);
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
