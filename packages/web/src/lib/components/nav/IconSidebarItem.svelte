<script lang="ts">
    import type { IconDefinition as IconDefinition1 } from "@fortawesome/free-solid-svg-icons";
    import type { IconDefinition as IconDefinition2 } from "@fortawesome/free-brands-svg-icons";
    import Fa from "svelte-fa";
    import { locale, translateText } from "$lib/i18n";
    import { browser } from "$app/environment";

    export let icon: IconDefinition1 | IconDefinition2;
    export let name: string;
    export let nameKey: string | undefined = undefined;
    export let link: string;
    export let newTab: boolean | null = null;

    let translatedTitle = name;
    let requestId = 0;

    $: void (async () => {
        let currentLocale = $locale;
        let currentKey = nameKey ?? name;
        if (!browser || !currentLocale) {
            translatedTitle = name;
            return;
        }
        if (currentLocale.toLowerCase().startsWith("en")) {
            translatedTitle = name;
            return;
        }
        translatedTitle = name;
        let id = ++requestId;
        let result = await translateText(currentLocale, currentKey, name);
        if (id === requestId) translatedTitle = result;
    })();
</script>

<a
    href={link}
    title={translatedTitle}
    target={newTab ? "_blank" : null}
    rel={newTab ? "noreferrer" : null}
>
    <Fa {icon} size="1.25x" fw />
</a>

<style>
    a {
        padding: var(--md-pad);
        border-radius: var(--control-radius);
        color: var(--sidebar-text-color);
        font-size: 16px;

        border: var(--border-width) solid var(--sep-color);
        background: var(--fg-color);

        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    a:hover {
        background: var(--theme-soft-color);
        box-shadow: 4px 4px 0 var(--sep-color);
        text-decoration: none;
    }
</style>
