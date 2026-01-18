<div class="mock-panel intro">
    <p class="eyebrow">UI/UX Inspiration</p>
    <h1>Mock Gallery</h1>
    <p class="mock-muted">
        Three isolated concepts you can use for layout and interaction inspiration. Each mock focuses on a
        different slice of the product experience.
    </p>
</div>

<div class="card-grid">
    <a class="mock-panel mock-card" href="/mocks/command-center">
        <div class="card-head">
            <span class="badge">Dashboard</span>
            <h2>Command Center</h2>
        </div>
        <p class="mock-muted">A command dashboard with filters, KPIs, and a live pulse area.</p>
        <div class="preview">
            <div class="preview-row">
                <span class="preview-pill"></span>
                <span class="preview-pill"></span>
                <span class="preview-pill"></span>
            </div>
            <div class="preview-tiles">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="preview-bar"></div>
        </div>
    </a>

    <a class="mock-panel mock-card" href="/mocks/team-spotlight">
        <div class="card-head">
            <span class="badge">Team Profile</span>
            <h2>Team Spotlight</h2>
        </div>
        <p class="mock-muted">A profile view with performance trends, strengths, and scout notes.</p>
        <div class="preview">
            <div class="preview-header"></div>
            <div class="preview-tiles two">
                <span></span>
                <span></span>
            </div>
            <div class="preview-bar short"></div>
        </div>
    </a>

    <a class="mock-panel mock-card" href="/mocks/event-flow">
        <div class="card-head">
            <span class="badge">Event Ops</span>
            <h2>Event Flow</h2>
        </div>
        <p class="mock-muted">A match-day view with schedule flow, match cards, and alerts.</p>
        <div class="preview">
            <div class="preview-row">
                <span class="preview-dot"></span>
                <span class="preview-dot"></span>
                <span class="preview-dot"></span>
                <span class="preview-dot"></span>
            </div>
            <div class="preview-bar"></div>
            <div class="preview-tiles two">
                <span></span>
                <span></span>
            </div>
        </div>
    </a>
</div>

<style>
    .intro {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-size: var(--sm-font-size);
        font-weight: 700;
        color: rgba(var(--theme-color-vs), 0.85);
        margin: 0;
    }

    h1 {
        margin: 0;
        font-size: calc(var(--xl-font-size) * 1.2);
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--xl-gap);
    }

    .mock-card {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .mock-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
    }

    .card-head {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
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

    h2 {
        margin: 0;
        font-size: var(--vl-font-size);
    }

    .preview {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .preview-row {
        display: flex;
        gap: var(--sm-gap);
    }

    .preview-pill {
        flex: 1;
        height: 10px;
        border-radius: var(--pill-border-radius);
        background: rgba(var(--theme-color-vs), 0.2);
    }

    .preview-dot {
        width: 8px;
        height: 8px;
        border-radius: var(--pill-border-radius);
        background: rgba(var(--theme-color-vs), 0.25);
    }

    .preview-tiles {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--sm-gap);
    }

    .preview-tiles.two {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .preview-tiles span {
        height: 28px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.06);
    }

    .preview-header {
        height: 24px;
        border-radius: 8px;
        background: rgba(var(--theme-color-vs), 0.2);
    }

    .preview-bar {
        height: 10px;
        border-radius: 999px;
        background: linear-gradient(
            90deg,
            rgba(var(--theme-color-vs), 0.4),
            rgba(var(--theme-color-vs), 0.12)
        );
    }

    .preview-bar.short {
        width: 70%;
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
