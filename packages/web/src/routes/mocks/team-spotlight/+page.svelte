<script lang="ts">
    const badges = ["Auto 92%", "Cycle 1.8s", "Endgame 4/5", "Defense A"];

    const strengths = [
        "Consistent autonomous parking",
        "Fast cycle handoff",
        "Strong late-game coordination",
        "Reliable on shared elements",
    ];

    const notes = [
        "Prefers left-side start, optimized for center spike.",
        "Best pairing with strong defense partner.",
        "Battery swaps between every 4 matches.",
    ];

    const matches = [
        { id: "Q-48", result: "Win", score: "198 - 165", note: "Auto bonus hit" },
        { id: "Q-49", result: "Win", score: "205 - 172", note: "2nd place OPR" },
        { id: "Q-50", result: "Loss", score: "180 - 186", note: "Penalty-heavy" },
    ];
</script>

<div class="mock-page">
    <section class="mock-panel hero">
        <div class="hero-main">
            <p class="eyebrow">Team profile concept</p>
            <h1>Team 11503 - Kinetic Tigers</h1>
            <p class="mock-muted">
                A focused profile view for scouting captains. Emphasis on match readiness, strengths, and
                role fit.
            </p>
            <div class="badge-row">
                {#each badges as badge}
                    <span class="badge">{badge}</span>
                {/each}
            </div>
        </div>
        <div class="hero-score">
            <div class="rating">
                <span class="rating-label">Overall rating</span>
                <span class="rating-value">92</span>
                <span class="rating-meta">Top 5% in region</span>
            </div>
            <div class="trend">
                <p class="mock-muted">Momentum</p>
                <div class="sparkline">
                    <span style="--value: 30"></span>
                    <span style="--value: 55"></span>
                    <span style="--value: 40"></span>
                    <span style="--value: 70"></span>
                    <span style="--value: 85"></span>
                    <span style="--value: 60"></span>
                </div>
            </div>
        </div>
    </section>

    <section class="content-grid">
        <div class="mock-panel panel">
            <div class="panel-head">
                <h2>Performance Mix</h2>
                <span class="chip muted">Season avg</span>
            </div>
            <div class="stacked-bar">
                <span class="auto"></span>
                <span class="teleop"></span>
                <span class="endgame"></span>
            </div>
            <div class="legend">
                <span><i class="dot auto"></i>Auto 34%</span>
                <span><i class="dot teleop"></i>Teleop 46%</span>
                <span><i class="dot endgame"></i>Endgame 20%</span>
            </div>
            <hr class="mock-divider" />
            <h3>Strengths</h3>
            <ul class="strengths">
                {#each strengths as strength}
                    <li>{strength}</li>
                {/each}
            </ul>
        </div>

        <div class="mock-panel panel">
            <div class="panel-head">
                <h2>Scout Notes</h2>
                <span class="chip muted">Updated today</span>
            </div>
            <ul class="notes">
                {#each notes as note}
                    <li>{note}</li>
                {/each}
            </ul>
            <div class="contact">
                <div>
                    <span class="label">Drive coach</span>
                    <span class="value">Mia Chen</span>
                </div>
                <div>
                    <span class="label">Preferred role</span>
                    <span class="value">Anchor scorer</span>
                </div>
            </div>
        </div>
    </section>

    <section class="mock-panel panel">
        <div class="panel-head">
            <div>
                <h2>Recent Matches</h2>
                <p class="mock-muted">Quick view for alliance selection meetings.</p>
            </div>
            <button class="mock-button" type="button">Compare teams</button>
        </div>
        <div class="matches">
            {#each matches as match}
                <div class="match-card">
                    <div class="match-id">{match.id}</div>
                    <div class={`match-result ${match.result === "Win" ? "win" : "loss"}`}>
                        {match.result}
                    </div>
                    <div class="match-score">{match.score}</div>
                    <div class="match-note mock-muted">{match.note}</div>
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
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: var(--xl-gap);
        align-items: center;
        background: linear-gradient(
            135deg,
            rgba(var(--theme-color-vs), 0.12),
            rgba(0, 0, 0, 0)
        );
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: var(--xs-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.75);
        margin: 0 0 var(--sm-gap);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sm-gap);
        margin-top: var(--lg-gap);
    }

    .badge {
        padding: 6px 12px;
        border-radius: var(--pill-border-radius);
        background: rgba(var(--theme-color-vs), 0.12);
        color: rgba(var(--theme-color-vs), 0.85);
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .hero-score {
        display: grid;
        gap: var(--lg-gap);
    }

    .rating {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        padding: var(--lg-gap);
        border-radius: 12px;
        background: var(--fg-color);
        border: 1px solid rgba(var(--theme-color-vs), 0.2);
    }

    .rating-label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .rating-value {
        font-size: calc(var(--xl-font-size) * 1.1);
        font-weight: 700;
    }

    .rating-meta {
        font-size: var(--sm-font-size);
        color: rgba(var(--theme-color-vs), 0.8);
    }

    .sparkline {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: var(--sm-gap);
        align-items: end;
        height: 70px;
    }

    .sparkline span {
        height: calc(var(--value) * 1%);
        border-radius: 6px 6px 2px 2px;
        background: linear-gradient(
            180deg,
            rgba(var(--theme-color-vs), 0.7),
            rgba(var(--theme-color-vs), 0.2)
        );
    }

    .content-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .panel {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
    }

    .panel h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .panel h3 {
        margin: 0;
        font-size: var(--md-font-size);
    }

    .chip.muted {
        padding: 4px 10px;
        border-radius: var(--pill-border-radius);
        font-size: var(--xs-font-size);
        background: rgba(0, 0, 0, 0.05);
        color: var(--secondary-text-color);
    }

    .stacked-bar {
        display: flex;
        height: 14px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.05);
    }

    .stacked-bar span {
        display: block;
    }

    .stacked-bar .auto {
        width: 34%;
        background: rgba(var(--theme-color-vs), 0.7);
    }

    .stacked-bar .teleop {
        width: 46%;
        background: rgba(var(--blue-team-color-vs), 0.6);
    }

    .stacked-bar .endgame {
        width: 20%;
        background: rgba(var(--green-stat-color-vs), 0.7);
    }

    .legend {
        display: flex;
        gap: var(--lg-gap);
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        flex-wrap: wrap;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;
    }

    .dot.auto {
        background: rgba(var(--theme-color-vs), 0.7);
    }

    .dot.teleop {
        background: rgba(var(--blue-team-color-vs), 0.6);
    }

    .dot.endgame {
        background: rgba(var(--green-stat-color-vs), 0.7);
    }

    .strengths,
    .notes {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
    }

    .notes {
        color: var(--secondary-text-color);
    }

    .contact {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--lg-gap);
        background: rgba(0, 0, 0, 0.03);
        padding: var(--lg-gap);
        border-radius: 12px;
    }

    .contact .label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .contact .value {
        font-weight: 600;
    }

    .matches {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .match-card {
        border-radius: 12px;
        padding: var(--lg-gap);
        background: rgba(0, 0, 0, 0.03);
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }

    .match-id {
        font-weight: 700;
        font-size: var(--sm-font-size);
    }

    .match-result {
        font-weight: 700;
        font-size: var(--md-font-size);
    }

    .match-result.win {
        color: rgb(67, 160, 71);
    }

    .match-result.loss {
        color: rgb(244, 67, 54);
    }

    .match-score {
        font-size: var(--sm-font-size);
    }

    .match-note {
        font-size: var(--sm-font-size);
    }

    @media (max-width: 1000px) {
        .hero {
            grid-template-columns: 1fr;
        }

        .content-grid {
            grid-template-columns: 1fr;
        }

        .matches {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .matches {
            grid-template-columns: 1fr;
        }

        .contact {
            grid-template-columns: 1fr;
        }
    }
</style>
