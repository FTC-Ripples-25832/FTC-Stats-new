<script>
    import DarkModeToggle from "./DarkModeToggle.svelte";
    import Hamburger from "./Hamburger.svelte";
    import LocaleSelect from "./LocaleSelect.svelte";
    import Logo from "./Logo.svelte";
    import Searchbar from "./search/Searchbar.svelte";
</script>

<nav>
    <div class="left">
        <Hamburger />
        <Logo />
    </div>

    <div class="right">
        <Searchbar />
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
        justify-content: space-between;
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
    }

    .right {
        display: flex;
        align-items: center;
        gap: var(--lg-gap);
    }
</style>
