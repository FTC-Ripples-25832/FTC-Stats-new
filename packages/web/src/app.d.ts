// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            locale: string;
            localePreference: "auto" | "manual";
            manualLocale: string | null;
            detectedLocale: string;
        }

        interface PageData {
            locale?: string;
            localePreference?: "auto" | "manual";
            manualLocale?: string | null;
            detectedLocale?: string;
        }
        // interface Platform {}
    }
}

export {};
