declare namespace NodeJS {
    export interface ProcessEnv {
        // interaction
        DATABASE_URL: string;
        // Provide ONE of:
        // - FTC_API_KEY (base64 of `username:apikey`, used directly)
        // - FTC_API_KEY_RAW (`username:apikey`, will be base64-encoded automatically)
        // - FTC_API_USERNAME + FTC_API_TOKEN (will be combined and base64-encoded automatically)
        FTC_API_KEY?: string;
        FTC_API_KEY_RAW?: string;
        FTC_API_USERNAME?: string;
        FTC_API_TOKEN?: string;
        PORT: string;

        // switches
        LOGGING: string;
        SYNC_DB: string;
        SYNC_API: string;
        CACHE_REQ: string;

        // Secrets
        FRONTEND_CODE: string;
    }
}
