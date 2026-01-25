<script lang="ts">
    import { faBinoculars } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
</script>

<a href="/">
    <Fa icon={faBinoculars} fw size="1.2x" translateX="-0.15" style="font-size: 24px" />
    <span> FTC<em>Stats</em> </span>
</a>

<style>
    a {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        padding: var(--md-pad);
        font-size: var(--lg-font-size);
        color: var(--text-color);
        font-family: var(--heading-font-family);
        letter-spacing: 0.12em;
        font-weight: 800;
        text-transform: uppercase;
        user-select: none;
    }

    a :global(svg) {
        color: var(--theme-color);
    }

    a:hover {
        text-decoration: none;
    }

    @media (max-width: 800px) {
        span {
            display: none;
        }
    }
</style>
