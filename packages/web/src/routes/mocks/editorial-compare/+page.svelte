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

<div class="editorial compare">
    <header class="masthead">
        <div>
            <p class="kicker">Editorial</p>
            <h1>Team Comparison</h1>
            <p class="byline">Midwest Qualifier</p>
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
                <span class="value">{metric.left}</span>
                <span class="value">{metric.right}</span>
            </div>
        {/each}
    </section>
</div>

<style>
    .editorial {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .masthead {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 2px solid #1d1a16;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.4);
    }

    .byline {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 1px solid #1d1a16;
        background: transparent;
        padding: 8px 14px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .team-card {
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
        padding: var(--md-gap);
        display: grid;
        gap: 4px;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: rgba(0, 0, 0, 0.6);
    }

    .panel {
        padding: var(--lg-gap);
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
    }

    .panel h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    .row {
        display: grid;
        grid-template-columns: 140px 1fr 1fr;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: var(--sm-font-size);
    }

    .row:last-child {
        border-bottom: none;
    }

    .metric {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
        color: rgba(0, 0, 0, 0.6);
    }

    .value {
        font-weight: 700;
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
