import {
    Alliance,
    BoolTy,
    DESCRIPTORS,
    DateTimeTy,
    EventTypeOption,
    IntTy,
    RegionOption,
    RemoteOption,
    Season,
    TournamentLevel,
    getEventTypes,
    getRegionCodes,
    list,
    nn,
    nullTy,
} from "@ftc-stats/common";
import { GraphQLFieldConfig } from "graphql";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { DATA_SOURCE } from "../../db/data-source";
import { Match } from "../../db/entities/Match";
import { EventGQL } from "./Event";
import { Event } from "../../db/entities/Event";
import { MatchGQL } from "./Match";
import { MatchScore } from "../../db/entities/dyn/match-score";
import { EventTypeOptionGQL, RegionOptionGQL, RemoteOptionGQL } from "./enums";
import { GraphQLObjectType } from "graphql";
import { singleSeasonScoreAwareMatchLoader } from "./Match";
import { DateTime } from "luxon";
import { SelectQueryBuilder } from "typeorm";

const NoteworthyMatchesGQL = new GraphQLObjectType({
    name: "NoteworthyMatches",
    fields: {
        highScore: { type: list(nn(MatchGQL)) },
        combinedScore: { type: list(nn(MatchGQL)) },
        losingScore: { type: list(nn(MatchGQL)) },
    },
});

type MatchKey = { eventSeason: Season; eventCode: string; id: number };

async function loadMatches(keys: MatchKey[]) {
    if (!keys.length) return [];
    const matches = await singleSeasonScoreAwareMatchLoader(keys, [], true, true);
    const byKey = new Map(matches.map((m) => [`${m.eventSeason}-${m.eventCode}-${m.id}`, m]));
    return keys
        .map((k) => byKey.get(`${k.eventSeason}-${k.eventCode}-${k.id}`))
        .filter((m): m is Match => !!m);
}

function applyEventFilters(
    q: SelectQueryBuilder<Match>,
    {
        region,
        type,
        remote,
    }: {
        region?: RegionOption | null | undefined;
        type?: EventTypeOption | null | undefined;
        remote?: RemoteOption | null | undefined;
    }
) {
    if (region && region !== RegionOption.All) {
        q.andWhere("e.region_code IN (:...regions)", { regions: getRegionCodes(region) });
    }

    if (type && type !== EventTypeOption.All) {
        q.andWhere("e.type IN (:...types)", { types: getEventTypes(type) });
    }

    if (remote && remote !== RemoteOption.All) {
        q.andWhere("e.remote = :remote", { remote: remote === RemoteOption.Remote });
    }

    return q;
}

export const HomeQueries: Record<string, GraphQLFieldConfig<any, any>> = {
    activeTeamsCount: {
        ...IntTy,
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) => {
            let tep = TeamEventParticipation[season as Season];
            if (!tep) return 0;

            let res = (await tep
                .createQueryBuilder("tep")
                .select('COUNT(DISTINCT("team_number"))')
                .getRawOne()!) as { count: string };

            return +res.count;
        },
    },

    matchesPlayedCount: {
        ...IntTy,
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) => {
            return DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .select()
                .where("m.event_season = :season", { season })
                .andWhere("m.has_been_played")
                .getCount();
        },
    },

    eventsOnDate: {
        type: list(nn(EventGQL)),
        args: { date: nullTy(DateTimeTy), type: { type: EventTypeOptionGQL } },
        resolve: async (_, { date, type }: { date: Date; type: EventTypeOption }) => {
            let q = DATA_SOURCE.getRepository(Event)
                .createQueryBuilder("e")
                .where("e.start <= (:e at time zone timezone)::date", { e: date ?? "NOW()" })
                .andWhere("e.end >= (:e at time zone timezone)::date")
                .orderBy("e.start", "ASC")
                .addOrderBy("e.name", "DESC");

            if (type && type != EventTypeOption.All) {
                q.andWhere("type IN (:...types)", { types: getEventTypes(type) });
            }

            return q.getMany();
        },
    },

    tradWorldRecord: {
        type: MatchGQL,
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) => {
            let ms = MatchScore[season as Season];
            if (!ms) return null;

            let match = await DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .leftJoin(
                    `match_score_${season}`,
                    "s",
                    "s.season = m.event_season AND s.event_code = m.event_code AND s.match_id = m.id",
                )
                .leftJoin(Event, "e", "e.season = m.event_season AND e.code = m.event_code")
                .orderBy(
                    DESCRIPTORS[season as Season].pensSubtract
                        ? "s.total_points"
                        : "s.total_points_np",
                    "DESC",
                )
                .where("m.has_been_played")
                .andWhere("NOT e.remote")
                .andWhere("e.type <> 'OffSeason'")
                .andWhere("NOT e.modified_rules")
                .andWhere('m."event_season" = :season', { season })
                .limit(1)
                .getOne();

            if (!match) return null;

            return DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .where("m.event_season = :season", { season: match?.eventSeason })
                .andWhere("m.event_code = :code", { code: match?.eventCode })
                .andWhere("m.id = :id", { id: match?.id })
                .leftJoinAndMapMany(
                    "m.scores",
                    `match_score_${season}`,
                    "ms",
                    "m.event_season = ms.season AND m.event_code = ms.event_code AND m.id = ms.match_id",
                )
                .leftJoinAndMapMany(
                    "m.teams",
                    "team_match_participation",
                    "tmp",
                    "m.event_season = tmp.season AND m.event_code = tmp.event_code AND m.id = tmp.match_id",
                )
                .getOne();
        },
    },

    upcomingMatches: {
        type: list(nn(MatchGQL)),
        args: {
            season: IntTy,
            limit: nullTy(IntTy),
            minutes: nullTy(IntTy),
            region: { type: RegionOptionGQL },
            type: { type: EventTypeOptionGQL },
            remote: { type: RemoteOptionGQL },
            elim: nullTy(BoolTy),
        },
        resolve: async (
            _,
            {
                season,
                limit,
                minutes,
                region,
                type,
                remote,
                elim,
            }: {
                season: number;
                limit?: number | null;
                minutes?: number | null;
                region?: RegionOption | null;
                type?: EventTypeOption | null;
                remote?: RemoteOption | null;
                elim?: boolean | null;
            }
        ) => {
            const windowMinutes = minutes ?? 60 * 24;
            const start = DateTime.now().minus({ minutes: 5 }).toJSDate();
            const end = DateTime.now().plus({ minutes: windowMinutes }).toJSDate();

            let q = DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .leftJoin(Event, "e", "e.season = m.event_season AND e.code = m.event_code")
                .select("m.event_season", "eventSeason")
                .addSelect("m.event_code", "eventCode")
                .addSelect("m.id", "id")
                .where("m.event_season = :season", { season })
                .andWhere("NOT m.has_been_played")
                .andWhere("m.scheduled_start_time IS NOT NULL")
                .andWhere("m.scheduled_start_time > :start", { start })
                .andWhere("m.scheduled_start_time < :end", { end });

            if (elim !== null && elim !== undefined) {
                if (elim) {
                    q.andWhere("m.tournament_level <> :quals", { quals: TournamentLevel.Quals });
                } else {
                    q.andWhere("m.tournament_level = :quals", { quals: TournamentLevel.Quals });
                }
            }

            q = applyEventFilters(q, { region, type, remote });

            q.orderBy("m.scheduled_start_time", "ASC").limit(Math.min(limit ?? 50, 100));

            const raw = await q.getRawMany();
            const keys: MatchKey[] = raw.map((r) => ({
                eventSeason: +r.eventSeason as Season,
                eventCode: r.eventCode,
                id: +r.id,
            }));

            return loadMatches(keys);
        },
    },

    noteworthyMatches: {
        type: NoteworthyMatchesGQL,
        args: {
            season: IntTy,
            limit: nullTy(IntTy),
            region: { type: RegionOptionGQL },
            type: { type: EventTypeOptionGQL },
            remote: { type: RemoteOptionGQL },
        },
        resolve: async (
            _,
            {
                season,
                limit,
                region,
                type,
                remote,
            }: {
                season: number;
                limit?: number | null;
                region?: RegionOption | null;
                type?: EventTypeOption | null;
                remote?: RemoteOption | null;
            }
        ) => {
            const descriptor = DESCRIPTORS[season as Season];
            const scoreKey = descriptor.pensSubtract ? "totalPoints" : "totalPointsNp";
            const ns = DATA_SOURCE.namingStrategy;
            const scoreCol = ns.columnName(scoreKey, undefined, []);

            const base = DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .innerJoin(
                    `match_score_${season}`,
                    "red",
                    "m.event_season = red.season AND m.event_code = red.event_code AND m.id = red.match_id AND red.alliance = :red",
                    { red: Alliance.Red }
                )
                .innerJoin(
                    `match_score_${season}`,
                    "blue",
                    "m.event_season = blue.season AND m.event_code = blue.event_code AND m.id = blue.match_id AND blue.alliance = :blue",
                    { blue: Alliance.Blue }
                )
                .leftJoin(Event, "e", "e.season = m.event_season AND e.code = m.event_code")
                .select("m.event_season", "eventSeason")
                .addSelect("m.event_code", "eventCode")
                .addSelect("m.id", "id")
                .where("m.event_season = :season", { season })
                .andWhere("m.has_been_played")
                .andWhere("NOT e.modified_rules");

            const filtered = applyEventFilters(base, { region, type, remote });

            const maxScoreExpr = `GREATEST(red.${scoreCol}, blue.${scoreCol})`;
            const sumScoreExpr = `(red.${scoreCol} + blue.${scoreCol})`;
            const losingScoreExpr = `LEAST(red.${scoreCol}, blue.${scoreCol})`;

            const cap = Math.min(limit ?? 30, 100);

            const highRaw = await filtered
                .clone()
                .orderBy(maxScoreExpr, "DESC")
                .addOrderBy("m.scheduled_start_time", "ASC")
                .limit(cap)
                .getRawMany();

            const combinedRaw = await filtered
                .clone()
                .orderBy(sumScoreExpr, "DESC")
                .addOrderBy("m.scheduled_start_time", "ASC")
                .limit(cap)
                .getRawMany();

            const losingRaw = await filtered
                .clone()
                .orderBy(losingScoreExpr, "DESC")
                .addOrderBy("m.scheduled_start_time", "ASC")
                .limit(cap)
                .getRawMany();

            const toKeys = (rows: any[]): MatchKey[] =>
                rows.map((r) => ({
                    eventSeason: +r.eventSeason as Season,
                    eventCode: r.eventCode,
                    id: +r.id,
                }));

            return {
                highScore: await loadMatches(toKeys(highRaw)),
                combinedScore: await loadMatches(toKeys(combinedRaw)),
                losingScore: await loadMatches(toKeys(losingRaw)),
            };
        },
    },
};
