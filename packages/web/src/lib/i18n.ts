import { browser } from "$app/environment";
import { DEFAULT_LOCALE, LOCALE_COOKIE_AGE, LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from "$lib/constants";
import { parse, serialize } from "cookie";
import { derived, get, writable } from "svelte/store";
import en from "$lib/locales/en.json";
import zhHans from "$lib/locales/zh-Hans.json";

export type LocalePreference = "auto" | "manual";
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type LocaleCookie = {
    preference?: LocalePreference;
    locale?: string;
};

export type LocaleOption = {
    value: string;
    label: string;
};

type Translator = (key: string, fallback?: string) => string;

const LOCALE_LABELS: Record<SupportedLocale, string> = {
    en: "English",
    "zh-Hans": "Chinese (Simplified)",
};

const DICTIONARIES: Record<SupportedLocale, Record<string, string>> = {
    en,
    "zh-Hans": zhHans,
};

export const LOCALE_OPTIONS: LocaleOption[] = SUPPORTED_LOCALES.map((locale) => ({
    value: locale,
    label: LOCALE_LABELS[locale] ?? locale,
}));

const detectedLocale = writable(DEFAULT_LOCALE);
const manualLocale = writable(DEFAULT_LOCALE);
const localePreference = writable<LocalePreference>("auto");

export const locale = derived(
    [detectedLocale, manualLocale, localePreference],
    ([$detectedLocale, $manualLocale, $preference]) =>
        $preference === "manual" ? $manualLocale : $detectedLocale
);

export { detectedLocale, manualLocale, localePreference };

function resolveSupportedLocale(locale: string): SupportedLocale {
    let normalized = locale.replace("_", "-").trim();
    let lower = normalized.toLowerCase();
    let exact = SUPPORTED_LOCALES.find((supported) => supported.toLowerCase() === lower);
    if (exact) return exact;
    let base = lower.split("-")[0];
    let baseMatch = SUPPORTED_LOCALES.find((supported) => supported.toLowerCase() === base);
    if (baseMatch) return baseMatch;
    if (base === "zh") return "zh-Hans";
    return DEFAULT_LOCALE as SupportedLocale;
}

function normalizeLocale(value: string | undefined): SupportedLocale {
    if (!value) return DEFAULT_LOCALE as SupportedLocale;
    return resolveSupportedLocale(value);
}

function translateFromDictionary(
    currentLocale: string | undefined,
    key: string,
    fallback: string
): string {
    if (!currentLocale) return fallback;
    if (currentLocale.toLowerCase().startsWith("en")) return fallback;
    let normalizedLocale = resolveSupportedLocale(currentLocale);
    let dictionary = DICTIONARIES[normalizedLocale];
    return dictionary?.[key] ?? fallback;
}

export const t = derived(
    locale,
    ($locale): Translator =>
        (key: string, fallback?: string) => {
            let text = fallback ?? key;
            if (!text.trim()) return text;
            return translateFromDictionary($locale, key, text);
        }
);

export function initLocale(params?: {
    locale?: string;
    detectedLocale?: string;
    manualLocale?: string | null;
    localePreference?: LocalePreference;
}) {
    if (!params) return;
    if (params.detectedLocale) detectedLocale.set(normalizeLocale(params.detectedLocale));
    if (params.manualLocale) manualLocale.set(normalizeLocale(params.manualLocale));
    if (params.localePreference) localePreference.set(params.localePreference);
    if (params.locale) {
        let derivedLocale = normalizeLocale(params.locale);
        if (params.localePreference === "manual") {
            manualLocale.set(derivedLocale);
        } else {
            detectedLocale.set(derivedLocale);
        }
    }
}

export function setLocalePreference(nextPreference: LocalePreference, nextLocale?: string) {
    localePreference.set(nextPreference);
    if (nextLocale) manualLocale.set(normalizeLocale(nextLocale));
    persistLocaleCookie();
}

export function setManualLocale(nextLocale: string) {
    manualLocale.set(normalizeLocale(nextLocale));
    localePreference.set("manual");
    persistLocaleCookie();
}

export function setAutoLocale() {
    localePreference.set("auto");
    persistLocaleCookie();
}

function persistLocaleCookie() {
    if (!browser) return;
    let value = JSON.stringify({
        preference: get(localePreference),
        locale: get(manualLocale),
    });
    document.cookie = serialize(LOCALE_COOKIE_NAME, value, {
        path: "/",
        maxAge: LOCALE_COOKIE_AGE,
        httpOnly: false,
    });
}

export function loadLocaleCookie() {
    if (!browser) return;
    let cookieVal = parse(document.cookie)[LOCALE_COOKIE_NAME];
    if (!cookieVal) return;
    try {
        let parsed = JSON.parse(cookieVal) as LocaleCookie;
        if (parsed?.locale) manualLocale.set(normalizeLocale(parsed.locale));
        if (parsed?.preference) localePreference.set(parsed.preference);
    } catch {}
}

export async function translateText(locale: string, key: string, text: string): Promise<string> {
    if (!text.trim()) return text;
    return translateFromDictionary(locale, key, text);
}
