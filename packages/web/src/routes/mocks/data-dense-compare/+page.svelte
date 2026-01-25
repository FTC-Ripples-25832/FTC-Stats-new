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
        { label: "Penalty avg", left: 4, right: 6 },
    ];
</script>

<div class="dense compare">
    <header>
        <div>
            <h1>Compare Teams</h1>
            <p>Midwest Qualifier</p>
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
                        <td>{metric.left}</td>
                        <td>{metric.right}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</div>

<style>
    .dense {
        background: #ffffff;
        color: #111111;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: var(--xl-gap);
        display: grid;
        gap: var(--lg-gap);
        font-size: var(--sm-font-size);
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--md-gap);
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: var(--md-gap);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    header p {
        margin: 0;
        color: #6b6b6b;
    }

    button {
        border: 1px solid #cfcfcf;
        background: #f8f8f8;
        padding: 6px 10px;
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
        border: 1px solid #e0e0e0;
        padding: var(--md-gap);
        display: grid;
        gap: 4px;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: #6b6b6b;
    }

    .panel {
        border: 1px solid #e0e0e0;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 6px 4px;
        text-align: left;
        border-bottom: 1px solid #ededed;
    }

    th {
        text-transform: uppercase;
        font-size: var(--xs-font-size);
        letter-spacing: 0.12em;
        color: #6b6b6b;
    }

    @media (max-width: 900px) {
        .team-row {
            grid-template-columns: 1fr;
        }
    }
</style>
