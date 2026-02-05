<script lang="ts">
    import {
        faBinoculars,
        faCalendarAlt,
        faClose,
        faCode,
        faGavel,
        faHashtag,
        faHome,
        faInfoCircle,
        faTrophy,
        faEnvelope,
        faServer,
        faHandHoldingDollar,
        faChartLine,
        faBolt,
    } from "@fortawesome/free-solid-svg-icons";
    import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
    import SidebarItem from "./SidebarItem.svelte";
    import { sidebarOpen } from "./Sidebar.svelte";
    import Fa from "svelte-fa";
    import IconSidebarItem from "./IconSidebarItem.svelte";
    import Translate from "$lib/components/i18n/Translate.svelte";
    import { EMAIL, DISCORD, STATUS, GITHUB, DONATIONS } from "../../constants";
    import { CURRENT_SEASON } from "@ftc-stats/common";
    import Sponsor from "./Sponsor.svelte";
</script>

<b>
    <span>
        <Translate text="Navigate" msgKey="nav.navigate" />
    </span>
    <button on:click={() => ($sidebarOpen = false)}>
        <Fa icon={faClose} size="1.75x" style="margin-right: var(--md-gap)" />
    </button>
</b>

<SidebarItem icon={faHome} name="Home" nameKey="nav.home" link="/" strict />
<SidebarItem
    icon={faCalendarAlt}
    name="Events"
    nameKey="nav.events"
    link="/events/{CURRENT_SEASON}"
/>
<SidebarItem icon={faBolt} name="Matches" nameKey="nav.matches" link="/matches" />
<SidebarItem icon={faHashtag} name="Teams" nameKey="nav.teams" link="/teams" />
<SidebarItem
    icon={faChartLine}
    name="Compare Teams"
    nameKey="nav.compare-teams"
    link="/compare"
/>
<SidebarItem
    icon={faTrophy}
    name="Season Records"
    nameKey="nav.records"
    link="/records/{CURRENT_SEASON}/teams"
/>

<hr />

<SidebarItem
    icon={faBinoculars}
    name="The Scouting Report"
    nameKey="nav.scouting-report"
    link="/blog"
/>

<hr />

<SidebarItem icon={faInfoCircle} name="About" nameKey="nav.about" link="/about" />
<SidebarItem
    icon={faHandHoldingDollar}
    name="Donate"
    nameKey="nav.donate"
    link={DONATIONS}
    newTab={true}
    internal={false}
/>
<SidebarItem
    icon={faGavel}
    name="Privacy Policy"
    nameKey="nav.privacy"
    link="/privacy"
/>
<SidebarItem icon={faCode} name="API" nameKey="nav.api" link="/api" />

<hr />

<div class="icons">
    <IconSidebarItem icon={faGithub} name="Github" nameKey="nav.github" link={GITHUB} newTab />
    <IconSidebarItem icon={faDiscord} name="Discord" nameKey="nav.discord" link={DISCORD} newTab />
    <IconSidebarItem icon={faEnvelope} name="Email" nameKey="nav.email" link="mailto:{EMAIL}" />
    <IconSidebarItem icon={faServer} name="Status" nameKey="nav.status" link={STATUS} newTab />
</div>

<hr />

<Sponsor />

<style>
    hr,
    .icons {
        margin-bottom: var(--lg-gap);
    }

    b {
        display: none;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--lg-gap);

        font-size: var(--vl-font-size);
        font-weight: 600;
    }

    @media (max-width: 1500px) {
        b {
            display: flex;
        }
    }

    button {
        background: none;
        border: none;
    }

    .icons {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>
