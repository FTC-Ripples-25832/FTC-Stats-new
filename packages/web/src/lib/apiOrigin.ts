import { env } from "$env/dynamic/public";
import { browser } from "$app/environment";

function normalizeOrigin(origin: string | undefined, secure: boolean): string {
    if (!origin) throw new Error("Server origin is not set");
    if (origin.startsWith("http://") || origin.startsWith("https://")) return origin;
    return `${secure ? "https" : "http"}://${origin}`;
}

function getServerHttpOrigin(): string {
    return normalizeOrigin(env.PUBLIC_SERVER_ORIGIN, env.PUBLIC_SERVER_SECURE === "1");
}

function getBrowserHttpOrigin(): string {
    const origin = env.PUBLIC_BROWSER_SERVER_ORIGIN ?? env.PUBLIC_SERVER_ORIGIN;
    return normalizeOrigin(origin, env.PUBLIC_SERVER_SECURE === "1");
}

export function getHttpOrigin(): string {
    return browser ? getBrowserHttpOrigin() : getServerHttpOrigin();
}

export function getWsOrigin(): string {
    return getHttpOrigin().replace(/^http/, "ws");
}
