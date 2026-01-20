import { CURRENT_SEASON } from "@ftc-stats/common";
import { getClient } from "$lib/graphql/client";
import { CompareTeamsDocument } from "$lib/graphql/generated/graphql-operations";
import { getData } from "$lib/graphql/getData";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, url }) => {
    const teamsParam = url.searchParams.get("teams") ?? "";
    const numbers = teamsParam
        .split(",")
        .map((val) => parseInt(val.trim(), 10))
        .filter((num) => Number.isFinite(num));

    const seasonParam = url.searchParams.get("season");
    const season = seasonParam ? parseInt(seasonParam, 10) : CURRENT_SEASON;

    return {
        compare: await getData(
            getClient(fetch),
            CompareTeamsDocument,
            { numbers, season },
            "compare-teams"
        ),
    };
};
