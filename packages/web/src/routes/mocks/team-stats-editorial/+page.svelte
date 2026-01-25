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

    const events = [
        { name: "Midwest Qualifier", finish: "1st", note: "Finals MVP" },
        { name: "Central League", finish: "2nd", note: "Auto leader" },
    ];
</script>

<div class="editorial-team">
    <header class="masthead">
        <div>
            <p class="kicker">Team profile - editorial</p>
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

    <section class="columns">
        <div class="panel story">
            <h2>Scout Highlights</h2>
            <ul>
                {#each highlights as item}
                    <li>{item}</li>
                {/each}
            </ul>
        </div>
        <div class="panel results">
            <h2>Event Results</h2>
            {#each events as event}
                <div class="event-row">
                    <div>
                        <span class="name">{event.name}</span>
                        <span class="note">{event.note}</span>
                    </div>
                    <span class="finish">{event.finish}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="panel callout">
        <p class="callout-label">Performance</p>
        <p class="callout-text">
            Consistent endgame execution keeps the team in top alliance consideration.
        </p>
    </section>
</div>

<style>
    .editorial-team {
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

    .columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .panel {
        padding: var(--lg-gap);
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #fbf8f3;
    }

    .panel h2 {
        margin: 0 0 var(--md-gap);
        font-size: var(--lg-font-size);
    }

    ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: var(--sm-gap);
    }

    .event-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--md-gap);
        padding: var(--sm-gap) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: var(--sm-font-size);
    }

    .event-row:last-child {
        border-bottom: none;
    }

    .name {
        font-weight: 600;
        display: block;
    }

    .note {
        color: rgba(0, 0, 0, 0.6);
        font-size: var(--sm-font-size);
    }

    .finish {
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

    @media (max-width: 900px) {
        .summary {
            grid-template-columns: 1fr;
        }

        .columns {
            grid-template-columns: 1fr;
        }
    }
</style>
