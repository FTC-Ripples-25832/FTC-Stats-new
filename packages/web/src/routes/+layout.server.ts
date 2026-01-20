import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        locale: locals.locale,
        localePreference: locals.localePreference,
        manualLocale: locals.manualLocale,
        detectedLocale: locals.detectedLocale,
    };
};
