export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const DATABASE_URL = process.env.DATABASE_URL;
function normalizeFtcApiKeyBase64(): string | undefined {
    const raw =
        process.env.FTC_API_KEY_RAW ||
        (process.env.FTC_API_USERNAME && process.env.FTC_API_TOKEN
            ? `${process.env.FTC_API_USERNAME}:${process.env.FTC_API_TOKEN}`
            : undefined);

    if (raw) return Buffer.from(raw, "utf8").toString("base64");

    const value = process.env.FTC_API_KEY;
    if (!value) return undefined;

    // If someone pastes `username:uuid` directly, accept it and encode.
    if (value.includes(":")) return Buffer.from(value, "utf8").toString("base64");

    // Otherwise assume it is already base64.
    return value;
}

export const FTC_API_KEY = normalizeFtcApiKeyBase64();
export const SERVER_PORT = +process.env.PORT;

export const LOGGING = process.env.LOGGING === "1";
export const SYNC_DB = process.env.SYNC_DB === "1";
export const SYNC_API = process.env.SYNC_API !== "0";
export const CACHE_REQ = process.env.CACHE_REQ === "1" && IS_DEV;

export const FRONTEND_CODE = process.env.FRONTEND_CODE;
export const DB_TIMEOUT = process.env.DB_TIMEOUT;
