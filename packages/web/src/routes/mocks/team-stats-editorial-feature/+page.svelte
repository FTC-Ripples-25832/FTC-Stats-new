<script lang="ts">
    const summary = [
        { label: "Region", value: "Midwest" },
        { label: "Rank", value: "1" },
        { label: "Record", value: "10-1-0" },
    ];

    const highlights = [
        "Auto reliability sits at 92% across qualifiers.",
        "Cycle time improved by 0.2s since week 2.",
        "Preferred alliance role: anchor scorer.",
    ];

    const metrics = [
        { label: "OPR", value: "192" },
        { label: "Auto avg", value: "68" },
        { label: "TeleOp avg", value: "94" },
        { label: "Endgame avg", value: "30" },
    ];
</script>

<div class="editorial-team-feature">
    <header class="masthead">
        <div>
            <p class="kicker">Team profile - editorial feature</p>
            <h1>Team 11503</h1>
            <p class="subhead">Kinetic Tigers</p>
        </div>
        <button type="button">Save profile</button>
    </header>

    <section class="summary">
        {#each summary as item}
            <div class="summary-item">
                <span class="label">{item.label}</span>
                <span class="value">{item.value}</span>
            </div>
        {/each}
    </section>

    <section class="layout">
        <article class="story">
            <h2>Scout Summary</h2>
            <p>
                Team 11503 continues to deliver consistent auto points and refined cycle flow. The drive team
                has adopted a faster handoff pattern, resulting in a lower average cycle time.
            </p>
            <p>
                The team performs best as an anchor scorer with a defense-heavy partner. Endgame execution
                remains steady with few penalties.
            </p>
            <ul>
                {#each highlights as item}
                    <li>{item}</li>
                {/each}
            </ul>
        </article>

        <aside class="sidebar">
            <div class="panel metrics">
                <h3>Key Metrics</h3>
                {#each metrics as metric}
                    <div class="metric-row">
                        <span class="label">{metric.label}</span>
                        <span class="value">{metric.value}</span>
                    </div>
                {/each}
            </div>
            <div class="panel callout">
                <p class="callout-label">Highlight</p>
                <p class="callout-text">92% auto success rate across qualifiers.</p>
            </div>
        </aside>
    </section>
</div>

<style>
    .editorial-team-feature {
        background: #f7f2ea;
        color: #1d1a16;
        border-radius: 24px;
        padding: calc(var(--xl-gap) * 1.1);
        display: flex;
        flex-direction: column;
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
        font-size: calc(var(--xl-font-size) * 1.6);
    }

    .subhead {
        margin: 0;
        font-size: var(--lg-font-size);
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

    .summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .summary-item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding-bottom: var(--md-gap);
    }

    .summary-item .label {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    .summary-item .value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--xl-gap);
    }

    .story h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    .story p {
        font-size: var(--md-font-size);
        line-height: 1.6;
    }

    .story ul {
        margin: var(--lg-gap) 0 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .panel {
        padding: var(--lg-gap);
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
    }

    .panel h3 {
        margin: 0 0 var(--md-gap);
        font-size: var(--md-font-size);
    }

    .metric-row {
        display: flex;
        justify-content: space-between;
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: var(--sm-font-size);
    }

    .metric-row:last-child {
        border-bottom: none;
    }

    .metric-row .label {
        color: rgba(0, 0, 0, 0.6);
    }

    .metric-row .value {
        font-weight: 700;
    }

    .callout {
        border: 2px solid #1d1a16;
        background: #f1e7d8;
    }

    .callout-label {
        margin: 0 0 var(--sm-gap);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: var(--xs-font-size);
        font-family: "Inter", sans-serif;
    }

    .callout-text {
        margin: 0;
        font-size: var(--lg-font-size);
    }

    @media (max-width: 1000px) {
        .summary {
            grid-template-columns: 1fr;
        }

        .layout {
            grid-template-columns: 1fr;
        }
    }
</style>
