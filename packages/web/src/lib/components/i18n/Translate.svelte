<script lang="ts">
    import { browser } from "$app/environment";
    import { locale, translateText } from "$lib/i18n";

    export let text: string;
    export let msgKey: string | undefined = undefined;

    let translated = text;
    let requestId = 0;

    $: void (async () => {
        let currentLocale = $locale;
        let currentKey = msgKey ?? text;
        if (!browser || !currentLocale) {
            translated = text;
            return;
        }
        if (currentLocale.toLowerCase().startsWith("en")) {
            translated = text;
            return;
        }
        translated = text;
        let id = ++requestId;
        let result = await translateText(currentLocale, currentKey, text);
        if (id === requestId) translated = result;
    })();
</script>

{translated}
