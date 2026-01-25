<script lang="ts">
    export let railWidth = "320px";
    export let stickyRail = true;
</script>

<div class="shell" style={`--rail-width: ${railWidth}`}>
    <aside class:sticky={stickyRail}>
        <slot name="rail" />
    </aside>
    <section class="main">
        <slot />
    </section>
</div>

<style>
    .shell {
        display: grid;
        grid-template-columns: minmax(240px, var(--rail-width)) minmax(0, 1fr);
        gap: var(--xl-gap);
        align-items: start;
    }

    aside.sticky {
        position: sticky;
        top: calc(var(--navbar-size) + var(--lg-gap));
    }

    .main {
        min-width: 0;
    }

    @media (max-width: 1100px) {
        .shell {
            grid-template-columns: 1fr;
        }

        aside.sticky {
            position: static;
        }
    }
</style>
