<script lang="ts">
    import { page } from "$app/stores";
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { sidebarOpen } from "./Sidebar.svelte";
    import Translate from "$lib/components/i18n/Translate.svelte";

    export let icon: IconDefinition;
    export let name: string;
    export let nameKey: string | undefined = undefined;
    export let link: string;
    export let strict = false;
    export let internal = true;
    export let newTab: boolean | null = null;

    $: activePath = "/" + link.split("/")[1];
    $: active = strict
        ? $page.url.pathname == activePath && internal
        : $page.url.pathname.startsWith(activePath) && internal;
</script>

<a
    href={link}
    class:active
    target={newTab ? "_blank" : null}
    rel={newTab ? "noreferrer" : null}
    on:click={() => ($sidebarOpen = false)}
>
    <Fa {icon} fw size="1.25x" />
    <Translate text={name} msgKey={nameKey} />
</a>

<style>
    a {
        margin-bottom: var(--lg-gap);
        padding: var(--md-pad) var(--lg-pad);
        font-size: var(--sm-font-size);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;

        border-radius: var(--control-radius);
        border: var(--border-width) solid var(--sep-color);
        background: var(--fg-color);

        color: var(--sidebar-text-color);

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--md-gap);
    }

    a:hover {
        background: var(--theme-soft-color);
        box-shadow: 4px 4px 0 var(--sep-color);
        text-decoration: none;
    }

    a.active {
        background: var(--theme-color);
        color: var(--theme-text-color);
        border-color: var(--theme-color);
        box-shadow: 4px 4px 0 var(--sep-color);
    }
</style>
