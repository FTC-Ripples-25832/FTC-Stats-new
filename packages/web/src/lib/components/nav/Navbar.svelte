<script>
    import { CURRENT_SEASON } from "@ftc-stats/common";
    import { DONATIONS, GITHUB, DISCORD, STATUS } from "$lib/constants";
    import Translate from "$lib/components/i18n/Translate.svelte";
    import DarkModeToggle from "./DarkModeToggle.svelte";
    import Hamburger from "./Hamburger.svelte";
    import LocaleSelect from "./LocaleSelect.svelte";
    import Logo from "./Logo.svelte";
    import Searchbar from "./search/Searchbar.svelte";

    const primaryLinks = [
        { href: "/", label: "Home", key: "nav.home" },
        { href: "/teams", label: "Teams", key: "nav.teams" },
        { href: `/events/${CURRENT_SEASON}`, label: "Events", key: "nav.events" },
        { href: "/matches", label: "Matches", key: "nav.matches" },
        { href: "/compare", label: "Compare Teams", key: "nav.compare-teams" },
        { href: "/simulate", label: "Simulate", key: "nav.simulate" },
        { href: `/records/${CURRENT_SEASON}/teams`, label: "Season Records", key: "nav.records" },
    ];

    const secondaryLinks = [
        { href: "/worlds", label: "Worlds Scouting", key: "nav.worlds" },
        { href: "/blog", label: "The Scouting Report", key: "nav.scouting-report" },
        { href: "/about", label: "About", key: "nav.about" },
        { href: "/api", label: "API", key: "nav.api" },
        { href: "/privacy", label: "Privacy Policy", key: "nav.privacy" },
        { href: DONATIONS, label: "Donate", key: "nav.donate", newTab: true },
    ];

    const networkLinks = [
        { href: GITHUB, label: "Github", key: "nav.github" },
        { href: DISCORD, label: "Discord", key: "nav.discord" },
        { href: STATUS, label: "Status", key: "nav.status" },
    ];
</script>

<nav>
    <div class="left">
        <Hamburger />
        <Logo />
        <div class="links">
            {#each primaryLinks as link}
                <a href={link.href}>
                    <Translate text={link.label} msgKey={link.key} />
                </a>
            {/each}
            <details class="menu">
                <summary>
                    <Translate text="More" msgKey="nav.more" />
                </summary>
                <div class="menu-panel">
                    {#each secondaryLinks as link}
                        <a href={link.href} rel={link.newTab ? "noreferrer" : undefined} target={link.newTab ? "_blank" : undefined}>
                            <Translate text={link.label} msgKey={link.key} />
                        </a>
                    {/each}
                    <hr />
                    {#each networkLinks as link}
                        <a href={link.href} rel="noreferrer" target="_blank">
                            <Translate text={link.label} msgKey={link.key} />
                        </a>
                    {/each}
                </div>
            </details>
        </div>
    </div>

    <div class="center">
        <Searchbar />
    </div>

    <div class="right">
        <LocaleSelect />
        <DarkModeToggle />
    </div>
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--navbar-size);

        padding: var(--md-pad) var(--lg-pad);

        background: var(--fg-color);
        border-bottom: var(--border-width) solid var(--sep-color);
        z-index: var(--navbar-zi);

        display: flex;
        align-items: center;
        gap: var(--lg-gap);
    }

    nav::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 6px;
        background: var(--theme-color);
    }

    .left {
        display: flex;
        align-items: center;
        gap: var(--md-gap);
    }

    .links {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
    }

    .links a,
    summary {
        font-size: var(--sm-font-size);
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-color);

        padding: var(--sm-pad) var(--md-pad);
        border-radius: var(--control-radius);
        border: var(--border-width) solid transparent;
        cursor: pointer;
        white-space: nowrap;
    }

    .links a:hover,
    summary:hover {
        background: var(--theme-soft-color);
        border-color: var(--sep-color);
        text-decoration: none;
    }

    details {
        position: relative;
    }

    summary {
        list-style: none;
    }

    summary::-webkit-details-marker {
        display: none;
    }

    .menu-panel {
        position: absolute;
        top: calc(100% + var(--sm-gap));
        right: 0;
        min-width: 220px;

        background: var(--fg-color);
        border: var(--border-width) solid var(--sep-color);
        box-shadow: var(--card-shadow);
        padding: var(--md-pad);
        display: grid;
        gap: var(--sm-gap);
        z-index: var(--navbar-zi);
    }

    .menu-panel a {
        padding: var(--sm-pad) var(--md-pad);
        font-size: var(--sm-font-size);
        text-transform: none;
        letter-spacing: 0.02em;
    }

    .menu-panel hr {
        border: none;
        border-top: var(--border-width) solid var(--sep-color);
        margin: var(--sm-gap) 0;
    }

    .center {
        flex: 1;
        display: flex;
        justify-content: center;
    }

    .right {
        display: flex;
        align-items: center;
        gap: var(--md-gap);
    }

    @media (max-width: 1200px) {
        .links {
            display: none;
        }

        .center {
            justify-content: flex-start;
        }
    }

    @media (max-width: 850px) {
        .center {
            justify-content: flex-end;
        }
    }
</style>
