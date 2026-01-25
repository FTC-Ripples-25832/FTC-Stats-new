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

<div class="brutalist compare">
    <header class="hero">
        <div>
            <p class="kicker">Brutalist</p>
            <h1>Team Compare</h1>
            <p class="meta">Midwest Qualifier</p>
        </div>
        <button type="button">Save</button>
    </header>

    <section class="team-row">
        {#each teams as team}
            <div class="team-card">
                <span class="team-id">#{team.team}</span>
                <span class="team-name">{team.name}</span>
            </div>
        {/each}
    </section>

    <section class="block">
        <h2>Metrics</h2>
        {#each metrics as metric}
            <div class="row">
                <span class="metric">{metric.label}</span>
                <span class="value">{metric.left}</span>
                <span class="value">{metric.right}</span>
            </div>
        {/each}
    </section>
</div>

<style>
    .brutalist {
        background: #ffffff;
        color: #0b0b0b;
        border-radius: 0;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        border: 4px solid #0b0b0b;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 4px solid #0b0b0b;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-weight: 700;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.5);
        text-transform: uppercase;
    }

    .meta {
        margin: 0;
        font-weight: 600;
    }

    button {
        border: 4px solid #0b0b0b;
        padding: 10px 16px;
        background: #ffdb00;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        cursor: pointer;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .team-card {
        border: 4px solid #0b0b0b;
        padding: var(--lg-gap);
        display: grid;
        gap: 4px;
        background: #f5f5f5;
        font-weight: 700;
    }

    .team-name {
        color: #444444;
    }

    .block {
        border: 4px solid #0b0b0b;
        padding: var(--lg-gap);
        display: grid;
        gap: var(--md-gap);
    }

    .block h2 {
        margin: 0;
        text-transform: uppercase;
        font-size: var(--lg-font-size);
        border-bottom: 4px solid #0b0b0b;
        padding-bottom: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 120px 1fr 1fr;
        gap: var(--md-gap);
        align-items: center;
        font-weight: 700;
    }

    .metric {
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--xs-font-size);
    }

    .value {
        border: 3px solid #0b0b0b;
        padding: 6px 10px;
        text-align: center;
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
