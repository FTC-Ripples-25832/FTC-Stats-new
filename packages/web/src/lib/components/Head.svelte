<script lang="ts">
    import { page } from "$app/stores";
    import { IS_DEV } from "$lib/constants";

    export let title: string;
    export let description: string =
        "FTCStats is a new way to track and scout FIRST Tech Challenge, providing advanced statistics and data on all aspects of FTC.";
    export let image = "/head/banner.png";
    export let url: string | null = null;
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Newsreader:wght@400;600;700&family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
    />

    <link rel="apple-touch-icon" sizes="180x180" href="/head/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/head/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/head/favicon-16x16.png" />
    <link rel="manifest" href="/head/site.webmanifest" />
    <link rel="mask-icon" href="/head/safari-pinned-tab.svg" color="#f57e25" />
    <meta name="msapplication-TileColor" content="#f57e25" />
    <meta name="theme-color" content="#ffffff" />
    <meta property="og:site_name" content="FTCStats" />

    <title>{IS_DEV ? "*" : ""}{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={image} />
    <meta property="og:description" content={description} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#f57e25" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="620" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url ?? $page.url.toString()} />

    <slot />
</svelte:head>
