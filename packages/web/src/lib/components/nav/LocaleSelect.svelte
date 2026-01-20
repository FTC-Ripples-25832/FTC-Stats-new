<script lang="ts">
    import { browser } from "$app/environment";
    import {
        LOCALE_OPTIONS,
        detectedLocale,
        localePreference,
        manualLocale,
        setAutoLocale,
        setManualLocale,
    } from "$lib/i18n";

    let displayNames: Intl.DisplayNames | null = null;
    if (browser && "DisplayNames" in Intl) {
        displayNames = new Intl.DisplayNames([navigator.language], { type: "language" });
    }

    function formatLocaleName(locale: string): string {
        if (!displayNames) return locale;
        return displayNames.of(locale) ?? locale;
    }

    $: autoLabel = $detectedLocale
        ? `Auto (${formatLocaleName($detectedLocale)})`
        : "Auto";
    $: selectedValue = $localePreference === "manual" ? $manualLocale : "auto";
    $: customOption =
        $manualLocale && !LOCALE_OPTIONS.some((option) => option.value === $manualLocale)
            ? { value: $manualLocale, label: formatLocaleName($manualLocale) }
            : null;

    function handleChange(event: Event) {
        let value = (event.currentTarget as HTMLSelectElement).value;
        if (value === "auto") {
            setAutoLocale();
        } else {
            setManualLocale(value);
        }
    }
</script>

<select aria-label="Language" on:change={handleChange} value={selectedValue}>
    <option value="auto">{autoLabel}</option>
    {#if customOption}
        <option value={customOption.value}>{customOption.label}</option>
    {/if}
    {#each LOCALE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>

<style>
    select {
        padding: calc(var(--sm-pad) * 0.6) var(--sm-pad);
        border-radius: 6px;
        border: 1px solid var(--sep-color);
        background: var(--theme-color);
        color: var(--theme-text-color);
        font-size: 14px;
    }
</style>
