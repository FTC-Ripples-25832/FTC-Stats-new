<script lang="ts">
    const highlights = [
        { label: "Champion", value: "Team 11503", note: "Alliance 2" },
        { label: "Final score", value: "214 - 189", note: "Finals Match 2" },
        { label: "Top OPR", value: "Team 7421", note: "OPR 184" },
    ];

    const matchCards = [
        {
            id: "Finals 2",
            time: "3:18 PM",
            red: ["11503", "5127", "12398"],
            blue: ["7421", "9064", "8112"],
            redScore: 214,
            blueScore: 189,
        },
        {
            id: "Finals 1",
            time: "3:02 PM",
            red: ["11503", "5127", "12398"],
            blue: ["7421", "9064", "8112"],
            redScore: 198,
            blueScore: 181,
        },
        {
            id: "Semi 3",
            time: "2:42 PM",
            red: ["11503", "5127", "12398"],
            blue: ["6024", "9012", "7734"],
            redScore: 201,
            blueScore: 176,
        },
    ];

    const awards = [
        { name: "Inspire Award", team: "11503" },
        { name: "Control Award", team: "7421" },
        { name: "Design Award", team: "9064" },
    ];
</script>

<div class="mock-page cards">
    <section class="mock-panel hero">
        <div class="hero-copy">
            <p class="eyebrow">Event results concept</p>
            <h1>Midwest Qualifier - Results</h1>
            <p class="mock-muted">A celebratory, card-based results view.</p>
        </div>
        <button class="mock-button primary" type="button">Share recap</button>
    </section>

    <section class="highlight-grid">
        {#each highlights as item}
            <div class="highlight-card">
                <span class="label">{item.label}</span>
                <span class="value">{item.value}</span>
                <span class="note">{item.note}</span>
            </div>
        {/each}
    </section>

    <section class="mock-panel match-panel">
        <div class="panel-head">
            <h2>Playoff Matches</h2>
            <button class="mock-button" type="button">View full bracket</button>
        </div>
        <div class="match-grid">
            {#each matchCards as match}
                <div class="match-card">
                    <div class="match-head">
                        <span class="match-id">{match.id}</span>
                        <span class="match-time">{match.time}</span>
                    </div>
                    <div class="alliance red">
                        <span class="score">{match.redScore}</span>
                        <div class="teams">
                            {#each match.red as team}
                                <span>{team}</span>
                            {/each}
                        </div>
                    </div>
                    <div class="alliance blue">
                        <span class="score">{match.blueScore}</span>
                        <div class="teams">
                            {#each match.blue as team}
                                <span>{team}</span>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <section class="mock-panel awards">
        <div class="panel-head">
            <h2>Awards</h2>
            <span class="mock-muted">Top honors</span>
        </div>
        <div class="award-grid">
            {#each awards as award}
                <div class="award-card">
                    <span class="award-name">{award.name}</span>
                    <span class="award-team">Team {award.team}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .mock-page {
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
    }

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--lg-gap);
        background: linear-gradient(
            120deg,
            rgba(var(--theme-color-vs), 0.2),
            rgba(var(--blue-team-color-vs), 0.08)
        );
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .highlight-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .highlight-card {
        border-radius: 18px;
        padding: var(--xl-gap);
        background: var(--fg-color);
        box-shadow: 0 18px 30px rgba(0, 0, 0, 0.05);
        display: grid;
        gap: var(--sm-gap);
    }

    .highlight-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--secondary-text-color);
    }

    .highlight-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .highlight-card .note {
        color: rgba(var(--theme-color-vs), 0.85);
        font-size: var(--sm-font-size);
    }

    .match-panel,
    .awards {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        align-items: center;
        flex-wrap: wrap;
    }

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .match-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .match-card {
        border-radius: 16px;
        padding: var(--lg-gap);
        background: rgba(0, 0, 0, 0.03);
        display: grid;
        gap: var(--md-gap);
    }

    .match-head {
        display: flex;
        justify-content: space-between;
        font-size: var(--sm-font-size);
    }

    .match-id {
        font-weight: 700;
    }

    .match-time {
        color: var(--secondary-text-color);
    }

    .alliance {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 12px;
        font-size: var(--sm-font-size);
    }

    .alliance.red {
        background: rgba(var(--red-team-color-vs), 0.15);
    }

    .alliance.blue {
        background: rgba(var(--blue-team-color-vs), 0.15);
    }

    .score {
        font-weight: 700;
        font-size: var(--md-font-size);
        min-width: 36px;
        text-align: center;
    }

    .teams {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
        color: var(--secondary-text-color);
    }

    .award-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .award-card {
        padding: var(--lg-gap);
        border-radius: 14px;
        border: 1px solid rgba(var(--theme-color-vs), 0.2);
        background: rgba(var(--theme-color-vs), 0.08);
        display: grid;
        gap: var(--sm-gap);
    }

    .award-name {
        font-weight: 700;
    }

    .award-team {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    @media (max-width: 1100px) {
        .highlight-grid,
        .match-grid,
        .award-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .highlight-grid,
        .match-grid,
        .award-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
