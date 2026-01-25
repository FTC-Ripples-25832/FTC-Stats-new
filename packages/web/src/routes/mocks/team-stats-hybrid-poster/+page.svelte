<script lang="ts">
    const stats = [
        { label: "OPR", value: "192" },
        { label: "Auto avg", value: "68" },
        { label: "TeleOp avg", value: "94" },
        { label: "Endgame avg", value: "30" },
    ];

    const notes = [
        "Auto reliability sits at 92% across qualifiers.",
        "Cycle time improved by 0.2s since week 2.",
        "Prefers anchor scorer role with defense partner.",
    ];
</script>

<div class="hybrid-team-poster">
    <header class="hero">
        <div>
            <p class="kicker">Team profile - hybrid poster</p>
            <h1>Team 11503</h1>
            <p class="meta">Kinetic Tigers</p>
        </div>
        <button type="button">Add to list</button>
    </header>

    <section class="stat-stack">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="panel">
        <h2>Scout Notes</h2>
        <ul>
            {#each notes as note}
                <li>{note}</li>
            {/each}
        </ul>
    </section>
</div>

<style>
    .hybrid-team-poster {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 12px;
        padding: calc(var(--xl-gap) * 1.2);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 4px solid #1d1a16;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 4px solid #1d1a16;
        padding-bottom: var(--lg-gap);
    }

    .kicker {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.22em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.8);
        text-transform: uppercase;
    }

    .meta {
        margin: 0;
        font-size: var(--md-font-size);
    }

    button {
        border: 4px solid #1d1a16;
        background: #ffdb00;
        padding: 10px 16px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .stat-stack {
        display: grid;
        gap: var(--md-gap);
        font-family: "Inter", sans-serif;
    }

    .stat-card {
        border: 4px solid #1d1a16;
        background: #ffffff;
        padding: var(--lg-gap);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
    }

    .stat-card .label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: var(--xs-font-size);
    }

    .stat-card .value {
        font-size: var(--vl-font-size);
    }

    .panel {
        border: 4px solid #1d1a16;
        background: #ffffff;
        padding: var(--lg-gap);
    }

    .panel h2 {
        margin: 0 0 var(--md-gap);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: var(--sm-font-size);
        font-family: "Inter", sans-serif;
    }

    ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
        font-size: var(--md-font-size);
    }
</style>
