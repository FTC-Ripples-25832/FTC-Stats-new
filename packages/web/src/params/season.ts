import { ALL_SEASONS } from "@ftc-stats/common";

export function match(param: string): boolean {
    return ALL_SEASONS.some((s) => s == +param);
}
