<script lang="ts">
    const stats = [
        { label: "Matches", value: "64 / 120" },
        { label: "Teams", value: "36" },
        { label: "Avg score", value: "178" },
        { label: "Auto avg", value: "61" },
    ];

    const nowPlaying = {
        id: "Q-52",
        red: ["11503", "5127", "12398"],
        blue: ["7421", "9064", "8112"],
        redScore: 201,
        blueScore: 194,
    };

    const standings = [
        { rank: 1, team: "11503", rp: 29 },
        { rank: 2, team: "7421", rp: 27 },
        { rank: 3, team: "9064", rp: 26 },
        { rank: 4, team: "5127", rp: 24 },
    ];

    const timeline = [
        { id: "Q-49", time: "10:50", note: "Auto spike", red: 205, blue: 172 },
        { id: "Q-50", time: "10:58", note: "Penalty swing", red: 180, blue: 186 },
        { id: "Q-51", time: "11:06", note: "Fast cycle", red: 198, blue: 178 },
    ];
</script>

<div class="neon-wrap">
    <section class="neon-hero">
        <div>
            <p class="eyebrow">Event results - neon ops</p>
            <h1>Midwest Qualifier</h1>
            <p class="meta">Des Moines, IA - Jan 13, 2024</p>
        </div>
        <div class="hero-actions">
            <button class="ghost" type="button">Broadcast</button>
            <button class="primary" type="button">Export</button>
        </div>
    </section>

    <section class="stat-row">
        {#each stats as stat}
            <div class="stat-card">
                <span class="label">{stat.label}</span>
                <span class="value">{stat.value}</span>
            </div>
        {/each}
    </section>

    <section class="grid">
        <div class="panel scoreboard">
            <div class="panel-head">
                <h2>Now Playing {nowPlaying.id}</h2>
                <span class="chip">Field 1</span>
            </div>
            <div class="score-row">
                <div class="side red">
                    <span class="tag">RED</span>
                    <div class="teams">
                        {#each nowPlaying.red as team}
                            <span>{team}</span>
                        {/each}
                    </div>
                    <span class="score">{nowPlaying.redScore}</span>
                </div>
                <div class="side blue">
                    <span class="tag">BLUE</span>
                    <div class="teams">
                        {#each nowPlaying.blue as team}
                            <span>{team}</span>
                        {/each}
                    </div>
                    <span class="score">{nowPlaying.blueScore}</span>
                </div>
            </div>
            <div class="pulse">
                <span>Auto</span>
                <span class="bar"></span>
                <span>TeleOp</span>
                <span class="bar"></span>
                <span>Endgame</span>
            </div>
        </div>

        <div class="panel standings">
            <div class="panel-head">
                <h2>Live Standings</h2>
                <span class="chip">Top 4</span>
            </div>
            <div class="standings-list">
                {#each standings as row}
                    <div class="standing-row">
                        <span class="rank">#{row.rank}</span>
                        <span class="team">Team {row.team}</span>
                        <span class="rp">{row.rp} RP</span>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <section class="panel timeline">
        <div class="panel-head">
            <h2>Recent Results</h2>
            <span class="chip">Live feed</span>
        </div>
        <div class="timeline-list">
            {#each timeline as match}
                <div class="timeline-row">
                    <span class="match-id">{match.id}</span>
                    <span class="time">{match.time}</span>
                    <span class="score red">{match.red}</span>
                    <span class="score blue">{match.blue}</span>
                    <span class="note">{match.note}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .neon-wrap {
        background: #0b0f1a;
        color: #e8ebff;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
        border: 1px solid rgba(120, 140, 255, 0.2);
        box-shadow: 0 30px 80px rgba(4, 8, 20, 0.8);
    }

    .neon-hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--lg-gap);
        flex-wrap: wrap;
    }

    .eyebrow {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        color: rgba(140, 160, 255, 0.8);
    }

    h1 {
        margin: 0 0 var(--sm-gap);
        font-size: calc(var(--xl-font-size) * 1.4);
    }

    .meta {
        margin: 0;
        color: rgba(232, 235, 255, 0.7);
    }

    .hero-actions {
        display: flex;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .hero-actions button {
        border-radius: 999px;
        padding: 10px 18px;
        font-weight: 700;
        font-size: var(--sm-font-size);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        border: 1px solid rgba(120, 140, 255, 0.4);
        background: transparent;
        color: inherit;
        cursor: pointer;
    }

    .hero-actions .primary {
        background: linear-gradient(90deg, #5268ff, #7b4dff);
        border: none;
        color: white;
        box-shadow: 0 12px 24px rgba(90, 100, 255, 0.4);
    }

    .stat-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap);
    }

    .stat-card {
        padding: var(--lg-gap);
        border-radius: 14px;
        background: rgba(20, 26, 44, 0.8);
        border: 1px solid rgba(120, 140, 255, 0.25);
        display: grid;
        gap: var(--sm-gap);
    }

    .stat-card .label {
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: rgba(190, 200, 255, 0.6);
    }

    .stat-card .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--xl-gap);
    }

    .panel {
        padding: var(--xl-gap);
        border-radius: 18px;
        background: rgba(14, 18, 34, 0.9);
        border: 1px solid rgba(120, 140, 255, 0.2);
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

    .panel-head h2 {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    .chip {
        padding: 6px 12px;
        border-radius: 999px;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba(190, 200, 255, 0.7);
        border: 1px solid rgba(120, 140, 255, 0.35);
    }

    .score-row {
        display: grid;
        gap: var(--md-gap);
    }

    .side {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--lg-gap);
        border-radius: 14px;
        font-size: var(--sm-font-size);
    }

    .side.red {
        background: rgba(255, 90, 118, 0.12);
        border: 1px solid rgba(255, 90, 118, 0.35);
    }

    .side.blue {
        background: rgba(90, 130, 255, 0.15);
        border: 1px solid rgba(90, 130, 255, 0.35);
    }

    .tag {
        font-weight: 700;
        letter-spacing: 0.18em;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
    }

    .teams {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
        color: rgba(232, 235, 255, 0.7);
    }

    .score {
        font-size: var(--vl-font-size);
        font-weight: 700;
    }

    .pulse {
        display: grid;
        grid-template-columns: auto 1fr auto 1fr auto;
        gap: var(--sm-gap);
        align-items: center;
        font-size: var(--xs-font-size);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: rgba(190, 200, 255, 0.7);
    }

    .pulse .bar {
        height: 6px;
        border-radius: 999px;
        background: linear-gradient(90deg, #5268ff, #7b4dff);
        box-shadow: 0 0 12px rgba(100, 120, 255, 0.6);
    }

    .standings-list {
        display: grid;
        gap: var(--sm-gap);
    }

    .standing-row {
        display: grid;
        grid-template-columns: 60px 1fr auto;
        gap: var(--md-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 12px;
        background: rgba(20, 26, 44, 0.8);
    }

    .rank {
        font-weight: 700;
        color: rgba(140, 160, 255, 0.9);
    }

    .team {
        color: rgba(232, 235, 255, 0.8);
    }

    .rp {
        font-weight: 700;
    }

    .timeline-list {
        display: grid;
        gap: var(--sm-gap);
    }

    .timeline-row {
        display: grid;
        grid-template-columns: 70px 60px 1fr 1fr 1.6fr;
        gap: var(--sm-gap);
        align-items: center;
        padding: var(--sm-gap);
        border-radius: 12px;
        background: rgba(20, 26, 44, 0.7);
        font-size: var(--sm-font-size);
    }

    .timeline-row .match-id {
        font-weight: 700;
    }

    .timeline-row .time {
        color: rgba(232, 235, 255, 0.6);
    }

    .timeline-row .score {
        font-weight: 700;
        text-align: center;
        border-radius: 6px;
        padding: 4px 0;
    }

    .timeline-row .score.red {
        background: rgba(255, 90, 118, 0.2);
        color: #ff8aa5;
    }

    .timeline-row .score.blue {
        background: rgba(90, 130, 255, 0.25);
        color: #8aa2ff;
    }

    .timeline-row .note {
        color: rgba(232, 235, 255, 0.6);
    }

    @media (max-width: 1100px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 900px) {
        .stat-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .stat-row {
            grid-template-columns: 1fr;
        }

        .timeline-row {
            grid-template-columns: 1fr 1fr;
        }
    }
</style>
