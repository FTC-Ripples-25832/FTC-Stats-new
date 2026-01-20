import type { Handle } from "@sveltejs/kit";
import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE_NAME,
    SUPPORTED_LOCALES,
    THEME_COOKIE_NAME,
} from "./lib/constants";

type LocaleCookie = {
    preference?: "auto" | "manual";
    locale?: string;
};

function resolveSupportedLocale(locale: string): string {
    let normalized = locale.replace("_", "-").trim();
    let lower = normalized.toLowerCase();
    let exact = SUPPORTED_LOCALES.find((supported) => supported.toLowerCase() === lower);
    if (exact) return exact;
    let base = lower.split("-")[0];
    let baseMatch = SUPPORTED_LOCALES.find((supported) => supported.toLowerCase() === base);
    if (baseMatch) return baseMatch;
    if (base === "zh") return "zh-Hans";
    return DEFAULT_LOCALE;
}

function normalizeLocale(locale: string | undefined): string {
    if (!locale) return DEFAULT_LOCALE;
    return resolveSupportedLocale(locale);
}

function parseAcceptLanguage(value: string | null): string | undefined {
    if (!value) return undefined;
    let candidates = value
        .split(",")
        .map((part) => {
            let [tag, qValue] = part.trim().split(";q=");
            let q = qValue ? Number.parseFloat(qValue) : 1;
            return { tag, q: Number.isNaN(q) ? 0 : q };
        })
        .filter((entry) => entry.tag);
    candidates.sort((a, b) => b.q - a.q);
    return candidates[0]?.tag;
}

export const handle: Handle = async ({ event, resolve }) => {
    let theme = "system";
    try {
        let cookieVal = event.cookies.get(THEME_COOKIE_NAME);
        theme = JSON.parse(cookieVal ?? "").preference ?? "system";
    } catch {}

    let detectedLocale = normalizeLocale(
        parseAcceptLanguage(event.request.headers.get("accept-language"))
    );
    let localePreference: "auto" | "manual" = "auto";
    let manualLocale: string | null = null;
    let locale = detectedLocale;

    try {
        let cookieVal = event.cookies.get(LOCALE_COOKIE_NAME);
        let parsed = JSON.parse(cookieVal ?? "") as LocaleCookie;
        if (parsed?.locale) {
            manualLocale = normalizeLocale(parsed.locale);
        }
        if (parsed?.preference === "manual" && manualLocale) {
            localePreference = "manual";
            locale = manualLocale;
        }
    } catch {}

    event.locals.locale = locale;
    event.locals.localePreference = localePreference;
    event.locals.manualLocale = manualLocale;
    event.locals.detectedLocale = detectedLocale;

    let response = await resolve(event, {
        filterSerializedResponseHeaders: (name) => ["content-type"].indexOf(name) != -1,
        transformPageChunk: ({ html }) =>
            html.replace("%theme%", `class="${theme}"`).replace("%lang%", locale),
    });

    return response;
};
