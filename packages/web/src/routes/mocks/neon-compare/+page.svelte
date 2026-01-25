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

<div class="neon compare">
    <header class="hero">
        <div>
            <p class="eyebrow">Neon/Cyber</p>
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
    .neon {
        background: #0b0f1a;
        color: #e8ebff;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        border: 1px solid rgba(120, 140, 255, 0.2);
        box-shadow: 0 30px 80px rgba(4, 8, 20, 0.8);
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        color: rgba(140, 160, 255, 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.4);
    }

    .meta {
        margin: 0;
        color: rgba(232, 235, 255, 0.7);
    }

    button {
        border-radius: 999px;
        padding: 10px 18px;
        font-weight: 700;
        font-size: var(--sm-font-size);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        border: none;
        background: linear-gradient(90deg, #5268ff, #7b4dff);
        color: white;
        box-shadow: 0 12px 24px rgba(90, 100, 255, 0.4);
        cursor: pointer;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .team-card {
        padding: var(--lg-gap);
        border-radius: 14px;
        background: rgba(20, 26, 44, 0.8);
        border: 1px solid rgba(120, 140, 255, 0.25);
        display: grid;
        gap: 4px;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: rgba(190, 200, 255, 0.6);
    }

    .panel {
        padding: var(--lg-gap);
        border-radius: 18px;
        background: rgba(14, 18, 34, 0.9);
        border: 1px solid rgba(120, 140, 255, 0.2);
        display: grid;
        gap: var(--md-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(190, 200, 255, 0.7);
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
        color: rgba(190, 200, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
    }

    .bars {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .bar {
        --percent: calc(var(--value) / var(--max) * 100%);
        background: rgba(20, 26, 44, 0.8);
        border-radius: 999px;
        height: 26px;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(120, 140, 255, 0.25);
    }

    .bar::before {
        content: "";
        position: absolute;
        inset: 0;
        width: var(--percent);
        background: linear-gradient(90deg, #5268ff, #7b4dff);
    }

    .bar.right::before {
        background: linear-gradient(90deg, #3ddc97, #5bd18a);
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
