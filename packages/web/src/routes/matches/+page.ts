import type { PageLoad } from "./$types";
import { CURRENT_SEASON, type Season } from "@ftc-stats/common";
import { getData } from "$lib/graphql/getData";
import { getClient } from "$lib/graphql/client";
import { gql } from "@apollo/client/core";
import {
    FullMatchFragmentDoc,
    TeamPageStatsFragmentDoc,
    type UpcomingMatchesQuery,
    type NoteworthyMatchesQuery,
} from "$lib/graphql/generated/graphql-operations";
import { print } from "graphql";
import { browser } from "$app/environment";
import { readable } from "svelte/store";

const FULL_MATCH_FRAGMENT = print(FullMatchFragmentDoc);
const TEAM_PAGE_STATS_FRAGMENT = print(TeamPageStatsFragmentDoc);

const UPCOMING_MATCHES_QUERY = gql`
    query UpcomingMatches($season: Int!, $limit: Int!, $minutes: Int) {
        upcomingMatches(season: $season, limit: $limit, minutes: $minutes) {
            ...FullMatch
            event {
                season
                code
                name
                start
                end
                timezone
                remote
                started
                published
                teams {
                    season
                    eventCode
                    teamNumber
                    stats {
                        __typename
                        ...TeamPageStats
                    }
                }
            }
        }
    }
    ${FULL_MATCH_FRAGMENT}
    ${TEAM_PAGE_STATS_FRAGMENT}
`;

const NOTEWORTHY_MATCHES_QUERY = gql`
    query NoteworthyMatches($season: Int!, $limit: Int) {
        noteworthyMatches(season: $season, limit: $limit) {
            highScore {
                ...FullMatch
                event {
                    season
                    code
                    name
                    start
                    end
                    timezone
                    remote
                    started
                    published
                    teams {
                        season
                        eventCode
                        teamNumber
                        stats {
                            __typename
                            ...TeamPageStats
                        }
                    }
                }
            }
            combinedScore {
                ...FullMatch
                event {
                    season
                    code
                    name
                    start
                    end
                    timezone
                    remote
                    started
                    published
                    teams {
                        season
                        eventCode
                        teamNumber
                        stats {
                            __typename
                            ...TeamPageStats
                        }
                    }
                }
            }
            losingScore {
                ...FullMatch
                event {
                    season
                    code
                    name
                    start
                    end
                    timezone
                    remote
                    started
                    published
                    teams {
                        season
                        eventCode
                        teamNumber
                        stats {
                            __typename
                            ...TeamPageStats
                        }
                    }
                }
            }
        }
    }
    ${FULL_MATCH_FRAGMENT}
    ${TEAM_PAGE_STATS_FRAGMENT}
`;

export const load: PageLoad = async ({ fetch, url }) => {
    const season = (Number(url.searchParams.get("season")) || CURRENT_SEASON) as Season;

    if (!browser) {
        const client = getClient(fetch);
        const [upcomingResult, noteworthyResult] = await Promise.all([
            client.query<UpcomingMatchesQuery>({
                query: UPCOMING_MATCHES_QUERY,
                variables: { season, limit: 80, minutes: 60 * 24 * 30 },
            }),
            client.query<NoteworthyMatchesQuery>({
                query: NOTEWORTHY_MATCHES_QUERY,
                variables: { season, limit: 30 },
            }),
        ]);

        return {
            season,
            upcoming: readable(upcomingResult),
            noteworthy: readable(noteworthyResult),
            initialUpcomingMatches: upcomingResult.data?.upcomingMatches ?? [],
            initialNoteworthyMatches: noteworthyResult.data?.noteworthyMatches ?? null,
        };
    }

    return {
        season,
        upcoming: getData(getClient(fetch), UPCOMING_MATCHES_QUERY, {
            season,
            limit: 80,
            minutes: 60 * 24 * 30,
        }),
        noteworthy: getData(getClient(fetch), NOTEWORTHY_MATCHES_QUERY, {
            season,
            limit: 30,
        }),
        initialUpcomingMatches: null,
        initialNoteworthyMatches: null,
    };
};
