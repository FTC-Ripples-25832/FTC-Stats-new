import { AwardFtcApi, Season } from "@ftc-stats/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getEventAwards(season: Season, eventCode: string): Promise<AwardFtcApi[]> {
    let resp = await getFromFtcApi(`${season}/awards/${eventCode}`);
    return resp?.["awards"] ?? [];
}
