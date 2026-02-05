<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type { TeamQuery } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintFloat } from "$lib/printers/number";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { predictMatchFromScores, type Season } from "@ftc-stats/common";
    import { getPredictorPrediction, type PredictorSuccess } from "$lib/components/matches/predictor";
    import { t } from "$lib/i18n";
    import { ENABLE_XGB_PREDICTIONS } from "$lib/constants";
    import {
        getMatchMarginForTeam,
        getMatchResult,
        getOpponentScoreForTeam,
        getAllianceScoreForTeam,
        getSeasonProgressForMatch,
        getTeamAlliance,
    } from "./team-metrics";
    import { Alliance } from "$lib/graphql/generated/graphql-operations";
    import {
        buildEpaMapFromMatches,
        buildOprMapFromMatches,
        getAllianceTeamNumbers,
        hasEntries,
    } from "$lib/components/matches/prediction-maps";

    type TeamData = NonNullable<TeamQuery["teamByNumber"]>;

    export let team: TeamData;

    $: teamNumber = team.number;
    $: matches = team.events.flatMap((event) => event.matches.map((m) => m.match));
    $: playedMatches = matches.filter((m) => !!m.scores);

    $: record = playedMatches.reduce(
        (acc, match) => {
            const result = getMatchResult(match, teamNumber);
            if (result === "win") acc.wins += 1;
            if (result === "loss") acc.losses += 1;
            if (result === "tie") acc.ties += 1;
            return acc;
        },
        { wins: 0, losses: 0, ties: 0 }
    );
    $: totalPlayed = record.wins + record.losses + record.ties;
    $: winRate = totalPlayed ? (record.wins + 0.5 * record.ties) / totalPlayed : null;

    $: margins = playedMatches
        .map((match) => getMatchMarginForTeam(match, teamNumber))
        .filter((m): m is number => m != null);
    $: avgMargin = margins.length
        ? margins.reduce((a, b) => a + b, 0) / margins.length
        : null;
    $: avgAllianceScore = playedMatches
        .map((match) => getAllianceScoreForTeam(match, teamNumber))
        .filter((m): m is number => m != null);
    $: avgAllianceScoreVal = avgAllianceScore.length
        ? avgAllianceScore.reduce((a, b) => a + b, 0) / avgAllianceScore.length
        : null;
    $: avgOpponentScore = playedMatches
        .map((match) => getOpponentScoreForTeam(match, teamNumber))
        .filter((m): m is number => m != null);
    $: avgOpponentScoreVal = avgOpponentScore.length
        ? avgOpponentScore.reduce((a, b) => a + b, 0) / avgOpponentScore.length
        : null;

    $: playedByTime = [...playedMatches].sort((a, b) => {
        const aTime = Date.parse(a.actualStartTime ?? a.scheduledStartTime ?? "") || 0;
        const bTime = Date.parse(b.actualStartTime ?? b.scheduledStartTime ?? "") || 0;
        return bTime - aTime;
    });

    $: recentMatches = playedByTime.slice(0, 6);
    $: recentRecord = recentMatches.reduce(
        (acc, match) => {
            const result = getMatchResult(match, teamNumber);
            if (result === "win") acc.wins += 1;
            if (result === "loss") acc.losses += 1;
            if (result === "tie") acc.ties += 1;
            return acc;
        },
        { wins: 0, losses: 0, ties: 0 }
    );
    $: recentPlayed = recentRecord.wins + recentRecord.losses + recentRecord.ties;
    $: recentWinRate = recentPlayed
        ? (recentRecord.wins + 0.5 * recentRecord.ties) / recentPlayed
        : null;
    $: recentMargins = recentMatches
        .map((match) => getMatchMarginForTeam(match, teamNumber))
        .filter((m): m is number => m != null);
    $: recentAvgMargin = recentMargins.length
        ? recentMargins.reduce((a, b) => a + b, 0) / recentMargins.length
        : null;

    $: headToHead = (() => {
        const map = new Map<number, { wins: number; losses: number; ties: number; count: number }>();

        for (const match of playedMatches) {
            const alliance = getTeamAlliance(match, teamNumber);
            if (!alliance) continue;
            const opponents = match.teams
                .filter((t) => t.alliance !== alliance)
                .map((t) => t.teamNumber ?? t.team?.number)
                .filter((n): n is number => !!n);

            const result = getMatchResult(match, teamNumber);
            for (const opp of opponents) {
                const entry = map.get(opp) ?? { wins: 0, losses: 0, ties: 0, count: 0 };
                if (result === "win") entry.wins += 1;
                if (result === "loss") entry.losses += 1;
                if (result === "tie") entry.ties += 1;
                entry.count += 1;
                map.set(opp, entry);
            }
        }

        return [...map.entries()]
            .map(([team, rec]) => ({ team, ...rec }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    })();

    $: formStats = (() => {
        const ordered = [...playedMatches].sort((a, b) => {
            const at = Date.parse(a.actualStartTime ?? a.scheduledStartTime ?? "") || 0;
            const bt = Date.parse(b.actualStartTime ?? b.scheduledStartTime ?? "") || 0;
            return at - bt;
        });
        const recent = ordered.slice(-5);
        const record = recent.reduce(
            (acc, match) => {
                const result = getMatchResult(match, teamNumber);
                if (result === "win") acc.wins += 1;
                if (result === "loss") acc.losses += 1;
                if (result === "tie") acc.ties += 1;
                return acc;
            },
            { wins: 0, losses: 0, ties: 0 }
        );
        const total = record.wins + record.losses + record.ties;
        const rate = total ? (record.wins + 0.5 * record.ties) / total : null;
        return { record, total, rate };
    })();

    $: recentResults = (() => {
        const ordered = [...playedMatches].sort((a, b) => {
            const at = Date.parse(a.actualStartTime ?? a.scheduledStartTime ?? "") || 0;
            const bt = Date.parse(b.actualStartTime ?? b.scheduledStartTime ?? "") || 0;
            return at - bt;
        });
        return ordered.slice(-10).map((match) => ({
            match,
            result: getMatchResult(match, teamNumber),
        }));
    })();

    $: ratingMetrics = (() => {
        let partnerRatings: number[] = [];
        let opponentRatings: number[] = [];

        for (const event of team.events) {
            const season = event.season as Season;
            const eventMatches = event.matches.map((m) => m.match);
            if (!eventMatches.length) continue;
            const oprMap = buildOprMapFromMatches(
                eventMatches,
                season,
                event.eventCode,
                event.event?.remote ?? false
            );
            const epaMap = buildEpaMapFromMatches(eventMatches, season);
            const ratingMap = hasEntries(epaMap) ? epaMap : oprMap;

            for (const match of eventMatches) {
                if (!match.scores) continue;
                const alliance = getTeamAlliance(match, teamNumber);
                if (!alliance || alliance === Alliance.Solo) continue;
                const { red, blue } = getAllianceTeamNumbers(match);
                const allianceTeams = alliance === Alliance.Red ? red : blue;
                const opponentTeams = alliance === Alliance.Red ? blue : red;

                const partners = allianceTeams.filter((t) => t !== teamNumber);
                const partnerValues = partners
                    .map((t) => ratingMap[t])
                    .filter((val): val is number => typeof val === "number");
                const opponentValues = opponentTeams
                    .map((t) => ratingMap[t])
                    .filter((val): val is number => typeof val === "number");

                if (partnerValues.length) {
                    partnerRatings.push(
                        partnerValues.reduce((a, b) => a + b, 0) / partnerValues.length
                    );
                }
                if (opponentValues.length) {
                    opponentRatings.push(
                        opponentValues.reduce((a, b) => a + b, 0) / opponentValues.length
                    );
                }
            }
        }

        const avgPartner =
            partnerRatings.length > 0
                ? partnerRatings.reduce((a, b) => a + b, 0) / partnerRatings.length
                : null;
        const avgOpponent =
            opponentRatings.length > 0
                ? opponentRatings.reduce((a, b) => a + b, 0) / opponentRatings.length
                : null;
        const net = avgOpponent != null && avgPartner != null ? avgOpponent - avgPartner : null;
        return { avgPartner, avgOpponent, net };
    })();

    // Upcoming predictions
    let predictionLoading = false;
    let predictedWins: number | null = null;
    let predictedMatches = 0;
    let predictionKey = "";

    function getMatchTeams(match: TeamData["events"][number]["matches"][number]["match"]) {
        const redTeams = match.teams
            .filter((t) => t.alliance === Alliance.Red)
            .map((t) => t.teamNumber ?? t.team?.number)
            .filter((n): n is number => !!n);
        const blueTeams = match.teams
            .filter((t) => t.alliance === Alliance.Blue)
            .map((t) => t.teamNumber ?? t.team?.number)
            .filter((n): n is number => !!n);
        if (redTeams.length < 2 || blueTeams.length < 2) return null;
        return { red1: redTeams[0], red2: redTeams[1], blue1: blueTeams[0], blue2: blueTeams[1] };
    }

    async function loadPredictions(upcoming: TeamData["events"][number]["matches"][number]["match"][]) {
        if (!browser || !ENABLE_XGB_PREDICTIONS || !upcoming.length) return;
        predictionLoading = true;

        const results = await Promise.all(
            upcoming.map(async (match) => {
                const teams = getMatchTeams(match);
                if (!teams) return null;
                const data = await getPredictorPrediction({
                    ...teams,
                    seasonProgress: getSeasonProgressForMatch(match),
                    penaltyBonus: 15,
                });
                if (!data.ok) return null;
                return { match, prediction: (data as PredictorSuccess).prediction };
            })
        );

        const valid = results.filter((r): r is NonNullable<typeof r> => !!r);
        predictedMatches = valid.length;
        if (!valid.length) {
            predictedWins = null;
            predictionLoading = false;
            return;
        }

        let expectedWins = 0;
        for (const { match, prediction } of valid) {
            const alliance = getTeamAlliance(match, teamNumber);
            if (!alliance || alliance === Alliance.Solo) continue;
            const predictionModel = predictMatchFromScores(
                prediction.red.total,
                prediction.blue.total,
                200
            );
            const winProb =
                alliance === Alliance.Red
                    ? predictionModel.redWinProbability
                    : predictionModel.blueWinProbability;
            expectedWins += winProb;
        }

        predictedWins = expectedWins;
        predictionLoading = false;
    }

    $: if (browser && ENABLE_XGB_PREDICTIONS) {
        const upcoming = matches.filter((m) => !m.scores);
        const key = upcoming.map((m) => `${m.eventCode}-${m.id}`).join("|");
        if (key !== predictionKey) {
            predictionKey = key;
            if (!upcoming.length) {
                predictedWins = null;
                predictedMatches = 0;
                predictionLoading = false;
            } else {
                loadPredictions(upcoming);
            }
        }
    }

    $: labelInsights = $t("teams.insights", "Team Insights");
    $: labelWinRate = $t("teams.win-rate", "Win Rate");
    $: labelAvgMargin = $t("teams.avg-margin", "Avg Margin");
    $: labelAvgScore = $t("teams.avg-partner-score", "Partner Avg Score");
    $: labelOppScore = $t("teams.avg-opp-score", "Avg Opponent Score");
    $: labelSchedule = $t("teams.sos", "Schedule Strength");
    $: labelRecentForm = $t("teams.recent-form", "Recent Form (Last 6)");
    $: labelRecentWinRate = $t("teams.recent-win-rate", "Recent Win Rate");
    $: labelRecentMargin = $t("teams.recent-margin", "Recent Avg Margin");
    $: labelPartnerQuality = $t("teams.partner-quality", "Partner Quality");
    $: labelOpponentQuality = $t("teams.opponent-quality", "Opponent Quality");
    $: labelForm = $t("teams.form", "Form (Last 5)");
    $: labelExpectedWins = $t("teams.expected-wins", "Expected Wins (Upcoming)");
    $: labelHeadToHead = $t("teams.head-to-head", "Head-to-Head");
    $: labelRecentResults = $t("teams.recent-results", "Recent Results");
</script>

<Card style="margin-bottom: var(--lg-gap);">
    <h2>{labelInsights}</h2>

    <div class="metrics">
        <div>
            <div class="label">{labelWinRate}</div>
            <div class="value">
                {winRate != null ? `${prettyPrintFloat(winRate * 100)}%` : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelForm}</div>
            <div class="value">
                {formStats.total
                    ? `${formStats.record.wins}-${formStats.record.losses}-${formStats.record.ties}`
                    : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelAvgMargin}</div>
            <div class="value">
                {avgMargin != null ? prettyPrintFloat(avgMargin) : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelAvgScore}</div>
            <div class="value">
                {avgAllianceScoreVal != null ? prettyPrintFloat(avgAllianceScoreVal) : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelOppScore}</div>
            <div class="value">
                {avgOpponentScoreVal != null ? prettyPrintFloat(avgOpponentScoreVal) : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelSchedule}</div>
            <div class="value">
                {ratingMetrics.net != null ? prettyPrintFloat(ratingMetrics.net) : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelPartnerQuality}</div>
            <div class="value">
                {ratingMetrics.avgPartner != null ? prettyPrintFloat(ratingMetrics.avgPartner) : "—"}
            </div>
        </div>
        <div>
            <div class="label">{labelOpponentQuality}</div>
            <div class="value">
                {ratingMetrics.avgOpponent != null ? prettyPrintFloat(ratingMetrics.avgOpponent) : "—"}
            </div>
        </div>
    </div>

    <div class="predictions">
        <div class="label">{labelExpectedWins}</div>
        {#if predictionLoading}
            <div class="value muted">{$t("common.loading", "Loading…")}</div>
        {:else}
            <div class="value">
                {predictedWins != null ? prettyPrintFloat(predictedWins) : "—"}
                {predictedMatches ? ` / ${predictedMatches}` : ""}
            </div>
        {/if}
    </div>

    {#if headToHead.length}
        <div class="head-to-head">
            <h3>{labelHeadToHead}</h3>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{$t("common.team", "Team")}</th>
                            <th>{$t("teams.record", "Record")}</th>
                            <th>{$t("common.matches", "Matches")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each headToHead as row}
                            <tr>
                                <td>
                                    <a href={`/teams/${row.team}`}>{row.team}</a>
                                </td>
                                <td>{row.wins}-{row.losses}-{row.ties}</td>
                                <td>{row.count}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}

    {#if recentResults.length}
        <div class="recent-results">
            <h3>{labelRecentResults}</h3>
            <div class="result-row">
                {#each recentResults as row}
                    <div
                        class={`result-chip ${row.result ?? "unknown"}`}
                        title={row.match.description}
                    />
                {/each}
            </div>
        </div>
    {/if}
</Card>

<style>
    h2 {
        margin-top: 0;
        margin-bottom: var(--md-gap);
    }

    .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: var(--md-gap);
        margin-bottom: var(--md-gap);
    }

    .label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
    }

    .value {
        font-size: 1.1em;
        font-weight: 600;
    }

    .predictions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--sm-pad) var(--md-pad);
        border: 1px solid var(--sep-color);
        border-radius: var(--card-radius);
        margin-bottom: var(--md-gap);
    }

    .muted {
        color: var(--secondary-text-color);
    }

    .head-to-head h3 {
        margin: var(--md-gap) 0 var(--sm-gap);
    }

    .recent-results h3 {
        margin: var(--md-gap) 0 var(--sm-gap);
    }

    .result-row {
        display: flex;
        gap: var(--sm-gap);
        flex-wrap: wrap;
    }

    .result-chip {
        width: 18px;
        height: 18px;
        border-radius: 6px;
        background: var(--sep-color);
    }

    .result-chip.win {
        background: var(--green-team-color);
    }

    .result-chip.loss {
        background: var(--red-team-color);
    }

    .result-chip.tie {
        background: var(--neutral-team-color);
    }

    .table-wrap {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: var(--sm-pad) var(--md-pad);
        border-bottom: 1px solid var(--sep-color);
        text-align: left;
        white-space: nowrap;
    }
</style>
