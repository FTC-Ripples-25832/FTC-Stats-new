<script lang="ts" context="module">
    import { writable } from "svelte/store";
    import { fade, fly } from "svelte/transition";
    import SidebarContent from "./SidebarContent.svelte";

    export let sidebarOpen = writable(false);
</script>

{#if $sidebarOpen}
    <div
        aria-hidden="true"
        class="cover"
        on:click={() => ($sidebarOpen = false)}
        transition:fade={{ duration: 300 }}
    />
    <div class="sidebar drawer" transition:fly={{ duration: 300, x: -300, opacity: 1 }}>
        <SidebarContent />
    </div>
{/if}

<style>
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: var(--sidebar-size);

        background: var(--fg-color);
        border-right: var(--border-width) solid var(--sep-color);
        box-shadow: var(--card-shadow);

        padding: calc(var(--navbar-size) + var(--md-gap)) var(--lg-pad) var(--lg-pad);

        overflow-y: auto;
        z-index: var(--mobile-sidebar-zi);
    }

    .cover {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: var(--mobile-sidebar-bg-zi);
        background: var(--modal-bg-color);

    }
</style>
