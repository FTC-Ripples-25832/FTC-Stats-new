import { DESCRIPTORS, type Season } from "@ftc-stats/common";

type OprGroup = {
    auto?: number | null;
    teleop?: number | null;
    endgame?: number | null;
    total?: number | null;
};

function asNumber(value: unknown): number | null {
    const num = typeof value === "number" ? value : Number(value);
    return Number.isFinite(num) ? num : null;
}

export function getOprBreakdown(
    stats: { opr?: Record<string, unknown> } | null | undefined,
    season: Season,
    remote: boolean
): OprGroup | null {
    if (!stats || !stats.opr) return null;
    const opr = stats.opr as Record<string, unknown>;
    const descriptor = DESCRIPTORS[season];
    const totalKey = descriptor.pensSubtract || remote ? "totalPoints" : "totalPointsNp";

    const auto = asNumber(opr.autoPoints);
    const dc = asNumber(opr.dcPoints);
    const eg =
        asNumber(opr.egPoints) ?? asNumber(opr.dcParkPoints) ?? asNumber(opr.dcBasePoints);

    let teleop = dc;
    if (dc != null && eg != null) {
        teleop = Math.max(0, dc - eg);
    }

    const total =
        asNumber(opr[totalKey]) ?? asNumber(opr.totalPointsNp) ?? asNumber(opr.totalPoints);

    return { auto, teleop, endgame: eg, total };
}

