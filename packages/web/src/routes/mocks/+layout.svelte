<div class="mock-shell">
    <slot />
</div>

<style>
    .mock-shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--vl-gap) 0 var(--xl-gap);

        display: flex;
        flex-direction: column;
        gap: var(--xl-gap);
    }

    :global(.mock-panel) {
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 16px;
        padding: var(--xl-gap);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
    }

    :global(.mock-muted) {
        color: var(--secondary-text-color);
    }

    :global(.mock-chip) {
        border: 1px solid var(--sep-color);
        border-radius: var(--pill-border-radius);
        padding: 6px 12px;
        background: var(--fg-color);
        color: inherit;
        font-size: var(--sm-font-size);
        font-weight: 600;
        cursor: pointer;
    }

    :global(.mock-chip.active) {
        background: rgba(var(--theme-color-vs), 0.12);
        border-color: rgba(var(--theme-color-vs), 0.4);
        color: var(--text-color);
    }

    :global(.mock-button) {
        border: 1px solid var(--sep-color);
        border-radius: 10px;
        padding: 10px 16px;
        font-size: var(--md-font-size);
        font-weight: 600;
        background: var(--fg-color);
        color: inherit;
        cursor: pointer;
    }

    :global(.mock-button.primary) {
        background: var(--theme-color);
        border-color: rgba(var(--theme-color-vs), 0.6);
        color: var(--theme-text-color);
    }

    :global(.mock-input) {
        width: 100%;
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: var(--md-font-size);
        cursor: text;
    }

    :global(.mock-divider) {
        border: none;
        border-top: 1px solid var(--sep-color);
        margin: var(--lg-gap) 0;
    }

    @media (max-width: 900px) {
        .mock-shell {
            padding: var(--lg-gap) 0 var(--xl-gap);
        }

        :global(.mock-panel) {
            padding: var(--vl-gap);
        }
    }

    @media (max-width: 650px) {
        :global(.mock-panel) {
            padding: var(--lg-gap);
        }
    }
</style>
