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

<div class="bi compare">
    <header class="topbar">
        <div>
            <h1>Team Compare</h1>
            <p>Enterprise BI</p>
        </div>
        <div class="controls">
            <button type="button">Export</button>
            <button type="button">Save view</button>
        </div>
    </header>

    <section class="panel team-row">
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
                        <td class="num">{metric.left}</td>
                        <td class="num">{metric.right}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</div>

<style>
    .bi {
        background: #f4f6f9;
        color: #111827;
        padding: var(--xl-gap);
        border-radius: 12px;
        display: grid;
        gap: var(--lg-gap);
        border: 1px solid #d8dde6;
        font-size: var(--sm-font-size);
    }

    .topbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--md-gap);
        padding-bottom: var(--md-gap);
        border-bottom: 1px solid #d8dde6;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    .topbar p {
        margin: 0;
        color: #6b7280;
    }

    .controls {
        display: flex;
        gap: var(--sm-gap);
    }

    button {
        border: 1px solid #c5ccd8;
        background: #ffffff;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        cursor: pointer;
    }

    .panel {
        background: #ffffff;
        border: 1px solid #d8dde6;
        border-radius: 8px;
        padding: var(--md-gap);
        display: grid;
        gap: var(--sm-gap);
    }

    h2 {
        margin: 0;
        font-size: var(--md-font-size);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #374151;
    }

    .team-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .team-card {
        border: 1px solid #e5e7eb;
        padding: var(--md-gap);
        border-radius: 6px;
        display: grid;
        gap: 4px;
    }

    .team-id {
        font-weight: 700;
    }

    .team-name {
        color: #6b7280;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 8px 6px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
    }

    th {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #6b7280;
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
