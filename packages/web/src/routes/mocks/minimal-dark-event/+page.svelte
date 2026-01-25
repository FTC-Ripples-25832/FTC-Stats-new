<script lang="ts">
    const stats = [
        { label: "Teams", value: "36" },
        { label: "Matches", value: "120" },
        { label: "Avg score", value: "178" },
        { label: "Top OPR", value: "192" },
    ];

    const standings = [
        { rank: 1, team: "11503", rp: 29 },
        { rank: 2, team: "7421", rp: 27 },
        { rank: 3, team: "9064", rp: 26 },
    ];
</script>

<div class="dark event">
    <header>
        <div>
            <p class="eyebrow">Minimal dark</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <button type="button">Export</button>
    </header>

    <section class="stats">
        {#each stats as stat}
            <div class="stat">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <h2>Standings</h2>
        <div class="list">
            {#each standings as row}
                <div class="row">
                    <span class="rank">#{row.rank}</span>
                    <span class="team">Team {row.team}</span>
                    <span class="rp">{row.rp} RP</span>
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

    .stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat {
        border: 1px solid #1f2430;
        border-radius: 10px;
        padding: var(--md-gap);
        display: grid;
        gap: 4px;
    }

    .stat .label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        color: #8b93a7;
    }

    .stat .value {
        font-weight: 700;
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

    .list {
        display: grid;
        gap: var(--sm-gap);
    }

    .row {
        display: grid;
        grid-template-columns: 60px 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 8px;
        background: #0f1117;
        font-size: var(--sm-font-size);
    }

    .rank {
        color: #7aa2ff;
        font-weight: 700;
    }

    .team {
        color: #c5cad8;
    }

    .rp {
        font-weight: 700;
    }

    @media (max-width: 900px) {
        .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
