<script lang="ts">
    const styles = [
        {
            slug: "data-dense",
            name: "Data-dense Minimal",
            blurb: "Tight tables, thin borders, compact hierarchy.",
        },
        {
            slug: "dashboard-modern",
            name: "Dashboard Modern",
            blurb: "Card-first layout with soft depth and gradients.",
        },
        {
            slug: "enterprise-bi",
            name: "Enterprise BI",
            blurb: "Neutral palette, strong data grid focus.",
        },
        {
            slug: "editorial",
            name: "Editorial",
            blurb: "Serif-led storytelling with airy spacing.",
        },
        {
            slug: "brutalist",
            name: "Brutalist",
            blurb: "Hard edges, bold type, high contrast.",
        },
        {
            slug: "neon",
            name: "Neon/Cyber",
            blurb: "Dark UI with glow accents and vivid hits.",
        },
        {
            slug: "minimal-dark",
            name: "Minimal Dark",
            blurb: "Muted dark surfaces with subtle accents.",
        },
        {
            slug: "flat-blocks",
            name: "Flat Color Blocks",
            blurb: "Chunky color fields and simple typography.",
        },
        {
            slug: "hybrid-ebi-flat",
            name: "Hybrid Editorial + BI + Flat",
            blurb: "Serif storytelling with BI tables and flat blocks.",
        },
    ];

    const pageTypes = [
        { suffix: "event", label: "Event Results" },
        { suffix: "team", label: "Team Profile" },
        { suffix: "compare", label: "Compare View" },
    ];
</script>

<div class="mock-panel intro">
    <h1>UI Style Matrix</h1>
    <p class="mock-muted">
        Each style direction includes three page types: event results, team profile, and compare view.
    </p>
</div>

{#each styles as style}
    <section class="style-section">
        <div class="style-head">
            <h2>{style.name}</h2>
            <p class="mock-muted">{style.blurb}</p>
        </div>
        <div class="card-grid">
            {#each pageTypes as page}
                <a class="mock-panel style-card" href={`/mocks/${style.slug}-${page.suffix}`}>
                    <div class="card-head">
                        <span class="badge">{style.name}</span>
                        <h3>{page.label}</h3>
                    </div>
                    <p class="mock-muted">Open the {page.label.toLowerCase()} concept.</p>
                </a>
            {/each}
        </div>
    </section>
{/each}

<style>
    .intro {
        display: grid;
        gap: var(--sm-gap);
    }

    h1 {
        margin: 0;
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .style-section {
        display: grid;
        gap: var(--lg-gap);
    }

    .style-head h2 {
        margin: 0 0 var(--sm-gap);
        font-size: var(--lg-font-size);
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--lg-gap);
    }

    .style-card {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
        text-decoration: none;
        color: inherit;
    }

    .card-head {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }

    h3 {
        margin: 0;
        font-size: var(--md-font-size);
    }

    .badge {
        width: fit-content;
        padding: 4px 10px;
        border-radius: var(--pill-border-radius);
        font-size: var(--xs-font-size);
        font-weight: 700;
        background: rgba(var(--theme-color-vs), 0.12);
        color: rgba(var(--theme-color-vs), 0.9);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    @media (max-width: 1100px) {
        .card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .card-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
