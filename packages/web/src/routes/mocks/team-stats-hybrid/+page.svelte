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

<div class="hybrid-team">
    <header class="hero">
        <div>
            <p class="kicker">Team profile - editorial x brutal</p>
            <h1>Team 11503</h1>
            <p class="meta">Kinetic Tigers</p>
        </div>
        <button type="button">Save profile</button>
    </header>

    <section class="split">
        <article class="story">
            <h2>Scout Notes</h2>
            <ul>
                {#each notes as note}
                    <li>{note}</li>
                {/each}
            </ul>
        </article>
        <aside class="stats">
            {#each stats as stat}
                <div class="stat-card">
                    <span class="label">{stat.label}</span>
                    <span class="value">{stat.value}</span>
                </div>
            {/each}
        </aside>
    </section>
</div>

<style>
    .hybrid-team {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 12px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        font-family: "Georgia", "Times New Roman", serif;
        border: 3px solid #1d1a16;
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: var(--lg-gap);
        flex-wrap: wrap;
        border-bottom: 3px solid #1d1a16;
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
        border: 3px solid #1d1a16;
        background: #ffdb00;
        padding: 8px 14px;
        font-family: "Inter", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        cursor: pointer;
    }

    .split {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--xl-gap);
    }

    .story h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    .story ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
        font-size: var(--md-font-size);
    }

    .stats {
        display: grid;
        gap: var(--md-gap);
        font-family: "Inter", sans-serif;
    }

    .stat-card {
        border: 3px solid #1d1a16;
        background: #ffffff;
        padding: var(--md-gap);
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
        font-size: var(--lg-font-size);
    }

    @media (max-width: 900px) {
        .split {
            grid-template-columns: 1fr;
        }
    }
</style>
