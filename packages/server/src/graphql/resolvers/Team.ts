import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { dataLoaderResolverList, dataLoaderResolverSingle } from "../utils";
import {
    ALL_SEASONS,
    DESCRIPTORS,
    DateTimeTy,
    FloatTy,
    IntTy,
    RegionOption,
    StrTy,
    fuzzySearch,
    getRegionCodes,
    groupBy,
    list,
    listTy,
    nn,
    nullTy,
} from "@ftc-stats/common";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { AwardGQL, teamAwareAwardLoader } from "./Award";
import { Award } from "../../db/entities/Award";
import { Season } from "@ftc-stats/common";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { LocationGQL } from "../objs/Location";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { TeamEventParticipationGQL } from "./TeamEventParticipation";
import { RegionOptionGQL } from "./enums";
import { DATA_SOURCE } from "../../db/data-source";
import { Event } from "../../db/entities/Event";

const REGION_VALUES = new Set(Object.values(RegionOption));

const US_STATE_ABBR_TO_REGION: Record<string, RegionOption> = {
    AK: RegionOption.USAK,
    AL: RegionOption.USAL,
    AR: RegionOption.USAR,
    AZ: RegionOption.USAZ,
    CA: RegionOption.USCA,
    CO: RegionOption.USCO,
    CT: RegionOption.USCT,
    DE: RegionOption.USDE,
    FL: RegionOption.USFL,
    GA: RegionOption.USGA,
    HI: RegionOption.USHI,
    IA: RegionOption.USIA,
    ID: RegionOption.USID,
    IL: RegionOption.USIL,
    IN: RegionOption.USIN,
    KS: RegionOption.USMOKS,
    KY: RegionOption.USKY,
    LA: RegionOption.USLA,
    MA: RegionOption.USMA,
    MD: RegionOption.USMD,
    MI: RegionOption.USMI,
    MN: RegionOption.USMN,
    MO: RegionOption.USMOKS,
    MS: RegionOption.USMS,
    MT: RegionOption.USMT,
    NC: RegionOption.USNC,
    ND: RegionOption.USND,
    NE: RegionOption.USNE,
    NH: RegionOption.USNH,
    NJ: RegionOption.USNJ,
    NM: RegionOption.USNM,
    NV: RegionOption.USNV,
    NY: RegionOption.USNY,
    OH: RegionOption.USOH,
    OK: RegionOption.USOK,
    OR: RegionOption.USOR,
    PA: RegionOption.USPA,
    RI: RegionOption.USRI,
    SC: RegionOption.USSC,
    TN: RegionOption.USTN,
    TX: RegionOption.USTX,
    UT: RegionOption.USUT,
    VA: RegionOption.USVA,
    VT: RegionOption.USVT,
    WA: RegionOption.USWA,
    WI: RegionOption.USWI,
    WV: RegionOption.USWV,
    WY: RegionOption.USWY,
};

const US_STATE_NAME_TO_ABBR: Record<string, string> = {
    alaska: "AK",
    alabama: "AL",
    arkansas: "AR",
    arizona: "AZ",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    iowa: "IA",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    massachusetts: "MA",
    maryland: "MD",
    michigan: "MI",
    minnesota: "MN",
    missouri: "MO",
    mississippi: "MS",
    montana: "MT",
    northcarolina: "NC",
    "north carolina": "NC",
    northdakota: "ND",
    "north dakota": "ND",
    nebraska: "NE",
    newhampshire: "NH",
    "new hampshire": "NH",
    newjersey: "NJ",
    "new jersey": "NJ",
    newmexico: "NM",
    "new mexico": "NM",
    nevada: "NV",
    newyork: "NY",
    "new york": "NY",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    rhodeisland: "RI",
    "rhode island": "RI",
    southcarolina: "SC",
    "south carolina": "SC",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    virginia: "VA",
    vermont: "VT",
    washington: "WA",
    wisconsin: "WI",
    westvirginia: "WV",
    "west virginia": "WV",
    wyoming: "WY",
};

const CANADA_PROVINCE_ABBR_TO_REGION: Record<string, RegionOption> = {
    AB: RegionOption.CAAB,
    BC: RegionOption.CABC,
    ON: RegionOption.CAON,
    QC: RegionOption.CAQC,
};

const CANADA_PROVINCE_NAME_TO_ABBR: Record<string, string> = {
    alberta: "AB",
    "british columbia": "BC",
    "britishcolumbia": "BC",
    ontario: "ON",
    quebec: "QC",
    "québec": "QC",
};

const COUNTRY_NAME_TO_REGION: Record<string, RegionOption> = {
    "united states": RegionOption.UnitedStates,
    "united states of america": RegionOption.UnitedStates,
    usa: RegionOption.UnitedStates,
    us: RegionOption.UnitedStates,
    "u.s.": RegionOption.UnitedStates,
    "u.s.a.": RegionOption.UnitedStates,
    australia: RegionOption.AU,
    brazil: RegionOption.BR,
    china: RegionOption.CN,
    cyprus: RegionOption.CY,
    germany: RegionOption.DE,
    egypt: RegionOption.EG,
    spain: RegionOption.ES,
    france: RegionOption.FR,
    "great britain": RegionOption.GB,
    "united kingdom": RegionOption.GB,
    england: RegionOption.GB,
    scotland: RegionOption.GB,
    wales: RegionOption.GB,
    israel: RegionOption.IL,
    india: RegionOption.IN,
    jamaica: RegionOption.JM,
    "south korea": RegionOption.KR,
    korea: RegionOption.KR,
    kazakhstan: RegionOption.KZ,
    libya: RegionOption.LY,
    mexico: RegionOption.MX,
    nigeria: RegionOption.NG,
    netherlands: RegionOption.NL,
    "new zealand": RegionOption.NZ,
    qatar: RegionOption.QA,
    romania: RegionOption.RO,
    russia: RegionOption.RU,
    "russian federation": RegionOption.RU,
    "saudi arabia": RegionOption.SA,
    thailand: RegionOption.TH,
    taiwan: RegionOption.TW,
    "south africa": RegionOption.ZA,
};

function normalizePlace(value: string | null | undefined) {
    return value?.trim().toLowerCase() ?? "";
}

function inferStateRegion(state: string | null | undefined, country: string | null | undefined) {
    const normalizedState = normalizePlace(state);
    if (!normalizedState) return null;

    const normalizedCountry = normalizePlace(country);
    const isUs =
        normalizedCountry === "" ||
        normalizedCountry === "united states" ||
        normalizedCountry === "united states of america" ||
        normalizedCountry === "usa" ||
        normalizedCountry === "us" ||
        normalizedCountry === "u.s." ||
        normalizedCountry === "u.s.a.";
    const isCanada =
        normalizedCountry === "canada" ||
        normalizedCountry === "ca" ||
        normalizedCountry === "can";

    if (isUs) {
        const abbr = US_STATE_NAME_TO_ABBR[normalizedState] ?? normalizedState.toUpperCase();
        return US_STATE_ABBR_TO_REGION[abbr] ?? null;
    }

    if (isCanada) {
        const abbr = CANADA_PROVINCE_NAME_TO_ABBR[normalizedState] ?? normalizedState.toUpperCase();
        return CANADA_PROVINCE_ABBR_TO_REGION[abbr] ?? null;
    }

    return null;
}

function inferCountryRegion(country: string | null | undefined, state: string | null | undefined) {
    const normalized = normalizePlace(country);
    if (!normalized) return null;

    if (normalized === "canada") {
        return inferStateRegion(state, country);
    }

    const mapped = COUNTRY_NAME_TO_REGION[normalized];
    if (mapped) return mapped;

    const upper = normalized.toUpperCase();
    if (REGION_VALUES.has(upper as RegionOption)) {
        return upper as RegionOption;
    }

    return null;
}

const QuickStatGQL = new GraphQLObjectType({
    name: "QuickStat",
    fields: {
        value: FloatTy,
        rank: IntTy,
    },
});
const QuickStatsGQL = new GraphQLObjectType({
    name: "QuickStats",
    fields: {
        season: IntTy,
        number: IntTy,
        tot: { type: nn(QuickStatGQL) },
        auto: { type: nn(QuickStatGQL) },
        dc: { type: nn(QuickStatGQL) },
        eg: { type: nn(QuickStatGQL) },
        count: IntTy,
    },
});

const TeamLocationQuickStatsGQL = new GraphQLObjectType({
    name: "TeamLocationQuickStats",
    fields: {
        world: { type: QuickStatsGQL },
        country: { type: QuickStatsGQL },
        state: { type: QuickStatsGQL },
        district: { type: QuickStatsGQL },
    },
});

let cachedQSCount: Partial<Record<Season, { count: number; time: number }>> = {};
let cacheTime = 1000 * 60 * 5; // 5 minutes

async function getQuickStatCount(season: Season, region: RegionOption | null) {
    let specialRegion = region && region != RegionOption.All;

    let cached = cachedQSCount[season];
    if (!specialRegion && cached && Date.now() - cached.time < cacheTime) {
        return cached.count;
    }

    let q = DATA_SOURCE.createQueryBuilder(`tep_${season}`, "t")
        .leftJoin("event", "e", "e.season = t.season AND e.code = t.event_code")
        .select("count(distinct team_number)")
        .where("NOT is_remote")
        .andWhere("has_stats")
        .andWhere("NOT e.modified_rules");

    if (region && region != RegionOption.All) {
        q.andWhere("region_code IN (:...regions)", { regions: getRegionCodes(region) });
    }

    let raw = await q.getRawOne();
    let count = +raw.count;

    if (!specialRegion) {
        cachedQSCount[season] = { count, time: Date.now() };
    }

    return count;
}

export async function getQuickStats(number: number, season: Season, region: RegionOption | null) {
    let total = DESCRIPTORS[season].pensSubtract ? "total_points" : "total_points_np";
    let max = DATA_SOURCE.createQueryBuilder(`tep_${season}`, "t")
        .leftJoin("event", "e", "e.season = t.season AND e.code = t.event_code")
        .select("team_number")
        .addSelect(`max(opr_${total})`, "tot")
        .addSelect("max(opr_auto_points)", "auto")
        .addSelect("max(opr_dc_points)", "dc");

    // HELP: Season Specific
    let egColumn = "opr_eg_points";
    if (season == Season.IntoTheDeep) {
        egColumn = "opr_dc_park_points";
    } else if (season == Season.Decode) {
        egColumn = "opr_dc_base_points";
    }
    max = max.addSelect(`max(${egColumn})`, "eg");

    max = max
        .where("NOT is_remote")
        .andWhere("has_stats")
        .andWhere("NOT e.modified_rules")
        .groupBy("team_number");

    if (region && region != RegionOption.All) {
        max.andWhere("region_code IN (:...regions)", {
            regions: getRegionCodes(region),
        });
    }

    let ranks = DATA_SOURCE.createQueryBuilder()
        .from("max", "max")
        .select("*")
        .addSelect("rank() over (order by tot DESC)", "tot_rank")
        .addSelect("rank() over (order by auto DESC)", "auto_rank")
        .addSelect("rank() over (order by dc DESC)", "dc_rank")
        .addSelect("rank() over (order by eg DESC)", "eg_rank");

    let res = await DATA_SOURCE.createQueryBuilder()
        .addCommonTableExpression(max, "max")
        .addCommonTableExpression(ranks, "ranks")
        .from("ranks", "ranks")
        .select("*")
        .where("team_number = :number", { number })
        .getRawOne();

    if (!res) return null;

    return {
        season,
        number: number,
        tot: { value: res.tot, rank: +res.tot_rank },
        auto: { value: res.auto, rank: +res.auto_rank },
        dc: { value: res.dc, rank: +res.dc_rank },
        eg: { value: res.eg, rank: +res.eg_rank },
        count: await getQuickStatCount(season, region),
    };
}

export const TeamGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "Team",
    fields: () => ({
        number: IntTy,
        name: StrTy,
        schoolName: StrTy,
        sponsors: listTy(StrTy),
        location: {
            type: nn(LocationGQL),
            resolve: (t) => ({ city: t.city, state: t.state, country: t.country }),
        },
        rookieYear: IntTy,
        website: nullTy(StrTy),
        createdAt: DateTimeTy,
        updatedAt: DateTimeTy,

        awards: {
            type: list(nn(AwardGQL)),
            args: { season: nullTy(IntTy) },
            resolve: dataLoaderResolverList<
                Team,
                Award,
                { season?: Season; teamNumber: number },
                { season: Season | null }
            >(
                (team, a) =>
                    a.season != null
                        ? { season: a.season, teamNumber: team.number }
                        : { teamNumber: team.number },
                teamAwareAwardLoader
            ),
        },
        matches: {
            type: list(nn(TeamMatchParticipationGQL)),
            args: { season: nullTy(IntTy), eventCode: nullTy(StrTy) },
            resolve: dataLoaderResolverList<
                Team,
                TeamMatchParticipation,
                { season?: Season; eventCode?: string; teamNumber: number },
                { season: Season | null; eventCode: string | null }
            >(
                (t, { season, eventCode }) => ({
                    teamNumber: t.number,
                    ...(season != null ? { season } : {}),
                    ...(eventCode != null ? { eventCode } : {}),
                }),
                (keys) => TeamMatchParticipation.find({ where: keys })
            ),
        },
        events: {
            type: list(nn(TeamEventParticipationGQL)),
            args: { season: IntTy },
            resolve: dataLoaderResolverList<
                Team,
                TeamEventParticipation,
                { season: Season; teamNumber: number },
                { season: Season }
            >(
                (t, { season }) => ({ season, teamNumber: t.number }),
                async (keys) => {
                    let groups = groupBy(keys, (k) => k.season);
                    let qs = Object.entries(groups).map(([season, k]) =>
                        TeamEventParticipation[+season as Season].find({ where: k })
                    );
                    return (await Promise.all(qs)).flat();
                }
            ),
        },

        quickStats: {
            type: QuickStatsGQL,
            args: { season: IntTy, region: { type: RegionOptionGQL } },
            resolve: async (
                team,
                { season, region }: { season: Season; region: RegionOption | null }
            ) => {
                if (ALL_SEASONS.indexOf(season) == -1) throw "invalid season";
                return getQuickStats(team.number, season, region);
            },
        },

        quickStatsBySeason: {
            type: list(nn(QuickStatsGQL)),
            args: { seasons: listTy(IntTy), region: { type: RegionOptionGQL } },
            resolve: async (
                team,
                {
                    seasons,
                    region,
                }: { seasons: number[] | null | undefined; region: RegionOption | null }
            ) => {
                const seasonList =
                    seasons && seasons.length
                        ? seasons.filter((s) => ALL_SEASONS.includes(s as Season))
                        : ALL_SEASONS;
                const stats = await Promise.all(
                    seasonList.map((season) =>
                        getQuickStats(team.number, season as Season, region ?? null)
                    )
                );
                return stats.filter((s): s is NonNullable<typeof s> => !!s);
            },
        },

        locationQuickStats: {
            type: TeamLocationQuickStatsGQL,
            args: { season: IntTy },
            resolve: async (team, { season }: { season: Season }) => {
                if (ALL_SEASONS.indexOf(season) == -1) throw "invalid season";

                const countryRegion = inferCountryRegion(team.country, team.state);
                const stateRegion = inferStateRegion(team.state, team.country);

                const [world, country, state] = await Promise.all([
                    getQuickStats(team.number, season, null),
                    countryRegion ? getQuickStats(team.number, season, countryRegion) : null,
                    stateRegion ? getQuickStats(team.number, season, stateRegion) : null,
                ]);

                return {
                    world,
                    country,
                    state,
                    district: null,
                };
            },
        },
    }),
});

export const TeamQueries: Record<string, GraphQLFieldConfig<any, any>> = {
    teamByNumber: {
        type: TeamGQL,
        args: { number: IntTy },
        resolve: dataLoaderResolverSingle<{}, Team, number, { number: number }>(
            (_, a) => a.number,
            (keys) => Team.find({ where: { number: In(keys) } }),
            (k, r) => k == r.number
        ),
    },
    teamsByNumbers: {
        type: list(nn(TeamGQL)),
        args: { numbers: listTy(IntTy) },
        resolve: async (_: {}, { numbers }: { numbers: number[] }) => {
            const uniqueNumbers = [...new Set(numbers)];
            const teams = await Team.find({ where: { number: In(uniqueNumbers) } });
            const byNumber = new Map(teams.map((t) => [t.number, t]));
            return numbers.map((n) => byNumber.get(n)).filter((t): t is Team => !!t);
        },
    },
    teamByName: {
        type: TeamGQL,
        args: { name: StrTy },
        resolve: dataLoaderResolverSingle<{}, Team, string, { name: string }>(
            (_, a) => a.name,
            (keys) => Team.find({ where: { name: In(keys) } }),
            (k, r) => k == r.name
        ),
    },

    teamsSearch: {
        type: list(nn(TeamGQL)),
        args: {
            region: { type: RegionOptionGQL },
            limit: nullTy(IntTy),
            searchText: nullTy(StrTy),
        },
        resolve: async (
            _,
            {
                region,
                limit,
                searchText,
            }: {
                region: RegionOption | null;
                limit: number | null;
                searchText: string | null;
            }
        ) => {
            let q = DATA_SOURCE.getRepository(Team).createQueryBuilder("t").distinctOn(["number"]);

            if (region && region != RegionOption.All) {
                q.leftJoin(TeamMatchParticipation, "m", "t.number = m.team_number")
                    .leftJoin(Event, "e", "e.season = m.season AND e.code = m.event_code")
                    .andWhere("e.region_code IN (:...regions)", {
                        regions: getRegionCodes(region),
                    });
            }

            if (limit && (!searchText || searchText.trim() == "")) {
                q.limit(limit);
            }

            let entities = await q.getMany();

            if (searchText) searchText = searchText.trim();
            if (searchText && searchText != "") {
                if (searchText.match(/^\d+$/)) {
                    entities = entities
                        .filter((e) => (e.number + "").startsWith(searchText!))
                        .sort((a, b) => a.number - b.number);
                } else {
                    let res = fuzzySearch(entities, searchText, limit ?? undefined, "name", true);
                    entities = res.map((d) => d.document);
                }
            }

            return entities;
        },
    },
};
