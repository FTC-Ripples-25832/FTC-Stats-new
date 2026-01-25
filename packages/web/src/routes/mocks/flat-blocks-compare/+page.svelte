<script lang="ts">
    const teams = [
        { team: "11503", name: "Kinetic Tigers" },
        { team: "7421", name: "Circuit Breakers" },
    ];

    const metrics = [
        { label: "OPR", left: 192, right: 184 },
        { label: "Auto avg", left: 68, right: 62 },
        { label: "TeleOp avg", left: 94, right: 90 },
        { label: "Endgame avg", left: 30, right: 32 },
    ];
</script>

<div class="flat compare">
    <header class="hero">
        <div>
            <p class="eyebrow">Flat color blocks</p>
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
        {#each metrics as metric}
            <div class="row">
                <span class="metric">{metric.label}</span>
                <span class="value left">{metric.left}</span>
                <span class="value right">{metric.right}</span>
            </div>
        {/each}
    </section>
</div>

<style>
    .flat {
        background: #f2f2f2;
        color: #1b1b1b;
        border-radius: 16px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Inter", sans-serif;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        background: #fff2b0;
        padding: var(--lg-gap);
        border-radius: 12px;
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        color: #5b5b5b;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .meta {
        margin: 0;
        color: #5b5b5b;
    }

    button {
        border: none;
        background: #1b1b1b;
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        cursor: pointer;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .team-card {
        background: #d6ecff;
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: 4px;
    }

    .team-card:nth-child(2) {
        background: #ffd6f5;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: #4a4a4a;
    }

    .panel {
        background: #ffffff;
        padding: var(--lg-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--md-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .row {
        display: grid;
        grid-template-columns: 120px 1fr 1fr;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid #e0e0e0;
        font-size: var(--sm-font-size);
    }

    .row:last-child {
        border-bottom: none;
    }

    .metric {
        font-weight: 700;
    }

    .value {
        text-align: center;
        padding: 6px 0;
        border-radius: 6px;
        font-weight: 700;
    }

    .value.left {
        background: #ffbdbd;
    }

    .value.right {
        background: #bfe0ff;
    }

    @media (max-width: 900px) {
        .team-row {
            grid-template-columns: 1fr;
        }

        .row {
            grid-template-columns: 1fr;
        }
    }
</style>
