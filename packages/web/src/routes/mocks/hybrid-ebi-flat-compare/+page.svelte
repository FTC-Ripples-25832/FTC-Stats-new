<script lang="ts">
    const teams = [
        { team: "11503", name: "Kinetic Tigers", tone: "blue" },
        { team: "7421", name: "Circuit Breakers", tone: "pink" },
    ];

    const metrics = [
        { label: "OPR", left: 192, right: 184 },
        { label: "Auto avg", left: 68, right: 62 },
        { label: "TeleOp avg", left: 94, right: 90 },
        { label: "Endgame avg", left: 30, right: 32 },
    ];
</script>

<div class="hybrid compare">
    <header class="hero">
        <div>
            <p class="kicker">Hybrid editorial + BI + flat</p>
            <h1>Team Compare</h1>
            <p class="meta">Midwest Qualifier</p>
        </div>
        <button type="button">Save view</button>
    </header>

    <section class="team-row">
        {#each teams as team}
            <div class={`team-card ${team.tone}`}>
                <span class="team-id">#{team.team}</span>
                <span class="team-name">{team.name}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <h2>Metric Comparison</h2>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>{teams[0].team}</th>
                    <th>{teams[1].team}</th>
                </tr>
            </thead>
            <tbody>
                {#each metrics as metric}
                    <tr>
                        <td>{metric.label}</td>
                        <td class="num">{metric.left}</td>
                        <td class="num">{metric.right}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</div>

<style>
    .hybrid {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 16px;
        padding: calc(var(--xl-gap) * 1.1);
        display: grid;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 2px solid #1d1a16;
    }

    .hero {
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

    .meta {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 2px solid #1d1a16;
        background: #ffdb00;
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
        gap: var(--md-gap);
        font-family: "Inter", sans-serif;
    }

    .team-card {
        border: 2px solid #1d1a16;
        padding: var(--lg-gap);
        display: grid;
        gap: 4px;
        background: #ffffff;
        border-radius: 12px;
    }

    .team-card.blue {
        background: #d6ecff;
    }

    .team-card.pink {
        background: #ffd6f5;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: #4a4a4a;
    }

    .panel {
        border: 2px solid #1d1a16;
        padding: var(--md-gap);
        background: #ffffff;
        display: grid;
        gap: var(--sm-gap);
        font-family: "Inter", sans-serif;
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--sm-font-size);
    }

    th,
    td {
        padding: 8px 6px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        text-align: left;
    }

    th {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        color: #5b5b5b;
    }

    .num {
        font-family: "SFMono-Regular", "Menlo", "Monaco", monospace;
        text-align: right;
    }

    @media (max-width: 900px) {
        .team-row {
            grid-template-columns: 1fr;
        }
    }
</style>
