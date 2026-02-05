<script lang="ts">
    import { ALL_SEASONS, CURRENT_SEASON, type Season, groupBy } from "@ftc-stats/common";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import { queryParam } from "$lib/util/search-params/search-params";
    import NoteworthyTable from "./NoteworthyTable.svelte";
    import Head from "$lib/components/Head.svelte";
    import { t } from "$lib/i18n";
    import { prettyPrintFloat } from "$lib/printers/number";
    import { getAllianceTeamNumbers, getOprValue } from "$lib/components/matches/prediction-maps";
    import { MODEL_VARIANCE, getWinProbabilities } from "$lib/components/matches/prediction-service";
    import { onDestroy, onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import { browser } from "$app/environment";

    export let data;

    let season = queryParam("season", {
        encode: (val) => (val === CURRENT_SEASON ? null : `${val}`),
        decode: (val) => ALL_SEASONS.find((s) => `${s}` === val) ?? CURRENT_SEASON,
        pushState: true,
        killHash: true,
    });

    $: upcomingStore = data.upcoming;
    $: noteworthyStore = data.noteworthy;
    $: initialUpcomingMatches = data.initialUpcomingMatches ?? [];
    $: initialNoteworthyMatches = data.initialNoteworthyMatches ?? null;

    $: upcomingMatches = $upcomingStore?.data?.upcomingMatches ?? [];
    $: noteworthy = $noteworthyStore?.data?.noteworthyMatches ?? null;

    let lastUpcomingBySeason: Record<number, typeof upcomingMatches> = {};
    let lastNoteworthyBySeason: Record<number, typeof noteworthy> = {};

    const STORAGE_PREFIX = "ftcstats:matches";
    const storageKey = (kind: "upcoming" | "noteworthy", season: number) =>
        `${STORAGE_PREFIX}:${kind}:${season}`;

    function readStorage<T>(key: string): T | null {
        if (!browser) return null;
        try {
            const raw = sessionStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : null;
        } catch (err) {
            console.warn("Failed to read cached matches", err);
            return null;
        }
    }

    function writeStorage<T>(key: string, value: T) {
        if (!browser) return;
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.warn("Failed to cache matches", err);
        }
    }

    $: if (initialUpcomingMatches.length && !lastUpcomingBySeason[$season]?.length) {
        lastUpcomingBySeason[$season] = initialUpcomingMatches;
    }
    $: if (initialNoteworthyMatches && !lastNoteworthyBySeason[$season]) {
        lastNoteworthyBySeason[$season] = initialNoteworthyMatches;
    }

    $: if (browser && $season && !lastUpcomingBySeason[$season]?.length) {
        const cached = readStorage<typeof upcomingMatches>(storageKey("upcoming", $season));
        if (cached?.length) {
            lastUpcomingBySeason[$season] = cached;
        }
    }

    $: if (browser && $season && !lastNoteworthyBySeason[$season]) {
        const cached = readStorage<typeof noteworthy>(storageKey("noteworthy", $season));
        if (cached) {
            lastNoteworthyBySeason[$season] = cached;
        }
    }

    $: if (upcomingMatches.length) lastUpcomingBySeason[$season] = upcomingMatches;
    $: if (noteworthy) lastNoteworthyBySeason[$season] = noteworthy;

    $: upcomingHasError = !!$upcomingStore?.errors?.length;
    $: noteworthyHasError = !!$noteworthyStore?.errors?.length;

    $: hasUpcomingFallback = !!lastUpcomingBySeason[$season]?.length;
    $: shouldFallbackUpcoming =
        (upcomingHasError || (!upcomingMatches.length && hasUpcomingFallback));
    $: displayedUpcomingMatches = shouldFallbackUpcoming
        ? lastUpcomingBySeason[$season]
        : upcomingMatches;
    $: showUpcomingStaleNotice =
        !upcomingHasError && !upcomingMatches.length && hasUpcomingFallback;

    const hasNoteworthyRows = (data: typeof noteworthy) => {
        if (!data) return false;
        return (
            (data.highScore?.length ?? 0) > 0 ||
            (data.combinedScore?.length ?? 0) > 0 ||
            (data.losingScore?.length ?? 0) > 0
        );
    };
    $: hasNoteworthyFallback = hasNoteworthyRows(lastNoteworthyBySeason[$season]);
    $: shouldFallbackNoteworthy =
        noteworthyHasError || (!hasNoteworthyRows(noteworthy) && hasNoteworthyFallback);
    $: displayedNoteworthy = shouldFallbackNoteworthy
        ? lastNoteworthyBySeason[$season]
        : noteworthy;
    $: showNoteworthyStaleNotice =
        !noteworthyHasError && !hasNoteworthyRows(noteworthy) && hasNoteworthyFallback;

    $: if (browser && displayedUpcomingMatches.length) {
        writeStorage(storageKey("upcoming", $season), displayedUpcomingMatches);
    }

    $: if (browser && displayedNoteworthy && hasNoteworthyRows(displayedNoteworthy)) {
        writeStorage(storageKey("noteworthy", $season), displayedNoteworthy);
    }

    $: upcomingGroups = Object.values(
        groupBy(
            displayedUpcomingMatches,
            (m) => `${m.event?.season ?? m.season}-${m.event?.code ?? m.eventCode}`
        )
    ).sort((a, b) => {
        const aTime = a[0]?.scheduledStartTime ?? a[0]?.event?.start ?? 0;
        const bTime = b[0]?.scheduledStartTime ?? b[0]?.event?.start ?? 0;
        return new Date(aTime).getTime() - new Date(bTime).getTime();
    });

    function buildTeamOprMap(event: any): Record<number, number> {
        if (!event?.teams?.length) return {};
        const season = event.season as Season;
        return event.teams.reduce((acc: Record<number, number>, team: any) => {
            const opr = getOprValue(team?.stats ?? null, season);
            if (opr != null && typeof team?.teamNumber === "number") {
                acc[team.teamNumber] = opr;
            }
            return acc;
        }, {});
    }

    function getOprPrediction(match: any, teamOprMap: Record<number, number>) {
        const { red, blue } = getAllianceTeamNumbers(match);
        if (red.length < 2 || blue.length < 2) return null;
        const redScore = red.reduce((sum, t) => sum + (teamOprMap[t] ?? 0), 0);
        const blueScore = blue.reduce((sum, t) => sum + (teamOprMap[t] ?? 0), 0);
        return { redScore, blueScore };
    }

    $: upcomingAlerts = upcomingGroups
        .flatMap((matches) => {
            const event = matches[0]?.event;
            if (!event) return [];
            const teamOprMap = buildTeamOprMap(event);
            if (!Object.keys(teamOprMap).length) return [];
            return matches
                .map((match) => {
                    const pred = getOprPrediction(match, teamOprMap);
                    if (!pred) return null;
                    const probs = getWinProbabilities(
                        pred.redScore,
                        pred.blueScore,
                        MODEL_VARIANCE.OPR
                    );
                    const maxProb = Math.max(probs.red, probs.blue);
                    if (maxProb < 0.45 || maxProb > 0.55) return null;
                    return { match, probs };
                })
                .filter((row): row is NonNullable<typeof row> => !!row);
        })
        .slice(0, 12);

    $: noteworthyMisses = (() => {
        if (!displayedNoteworthy) return [];
        const allMatches = [
            ...(displayedNoteworthy.highScore ?? []),
            ...(displayedNoteworthy.combinedScore ?? []),
            ...(displayedNoteworthy.losingScore ?? []),
        ];
        const rows = allMatches
            .map((match) => {
                const event = match.event;
                if (!event) return null;
                const teamOprMap = buildTeamOprMap(event);
                if (!Object.keys(teamOprMap).length) return null;
                if (!match.scores || !("red" in match.scores)) return null;
                const pred = getOprPrediction(match, teamOprMap);
                if (!pred) return null;
                const actualRed = match.scores.red.totalPoints;
                const actualBlue = match.scores.blue.totalPoints;
                const error =
                    Math.abs(pred.redScore - actualRed) + Math.abs(pred.blueScore - actualBlue);
                return { match, pred, actualRed, actualBlue, error };
            })
            .filter((row): row is NonNullable<typeof row> => !!row)
            .sort((a, b) => b.error - a.error);
        return rows.slice(0, 10);
    })();

    let refreshTimer: ReturnType<typeof setInterval> | null = null;

    onMount(() => {
        if (!browser) return;
        refreshTimer = setInterval(() => {
            invalidateAll();
        }, 2 * 60 * 1000);
    });

    onDestroy(() => {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = null;
    });
</script>

<Head title="Matches | FTC Stats" />

<WidthProvider width={"1200px"}>
    <Card style="margin-bottom: var(--lg-gap);">
        <div class="header">
            <h1>{$t("common.matches", "Matches")}</h1>
            <Form id="season" noscriptSubmit>
                <SeasonSelect bind:season={$season} nonForm />
            </Form>
        </div>
    </Card>

    <Loading store={$upcomingStore} checkExists={(d) => !!d.upcomingMatches}>
        <ErrorPage slot="error" status={500} message={$t("error.generic", "Error loading data.")} />

        <Card>
            <h2>{$t("matches.upcoming.title", "Upcoming Matches")}</h2>
            {#if showUpcomingStaleNotice}
                <p class="muted">
                    {$t(
                        "matches.upcoming.stale",
                        "Live refresh returned no upcoming matches. Showing the last available list."
                    )}
                </p>
            {/if}
            {#if displayedUpcomingMatches.length}
                {#each upcomingGroups as matches}
                    {@const baseMatch = matches[0]}
                    {@const event =
                        baseMatch.event ??
                        {
                            season: baseMatch.season,
                            code: baseMatch.eventCode,
                            name: baseMatch.eventCode,
                            start: baseMatch.scheduledStartTime,
                            end: baseMatch.scheduledStartTime,
                            timezone: "UTC",
                            remote: false,
                            started: false,
                            published: false,
                            teams: [],
                        }}
                    {@const teamOprMap = buildTeamOprMap(event)}
                    <div class="event-block">
                        <h3>
                            <a href={`/events/${event.season}/${event.code}/matches`}>
                                {event.name}
                            </a>
                        </h3>
                        <MatchTable matches={matches} event={event} {teamOprMap} />
                    </div>
                {/each}
                {#if upcomingAlerts.length}
                    <div class="event-block">
                        <h3>{$t("matches.upcoming.alerts", "Upcoming Toss-Ups")}</h3>
                        <div class="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{$t("common.event", "Event")}</th>
                                        <th>{$t("common.match", "Match")}</th>
                                        <th>{$t("common.red", "Red")}</th>
                                        <th>{$t("common.blue", "Blue")}</th>
                                        <th>{$t("matches.win-prob", "Win Prob")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each upcomingAlerts as row}
                                        {@const event = row.match.event}
                                        {@const teams = getAllianceTeamNumbers(row.match)}
                                        <tr>
                                            <td>
                                                <a href={`/events/${event.season}/${event.code}/matches`}>
                                                    {event.name}
                                                </a>
                                            </td>
                                            <td>{row.match.description}</td>
                                            <td class="red">{teams.red.join(", ")}</td>
                                            <td class="blue">{teams.blue.join(", ")}</td>
                                            <td>
                                                {prettyPrintFloat(row.probs.red * 100)}% /
                                                {prettyPrintFloat(row.probs.blue * 100)}%
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                {/if}
            {:else}
                <p class="muted">
                    {$t("matches.upcoming.none", "No upcoming matches in the selected window.")}
                </p>
            {/if}
        </Card>
    </Loading>

    <Loading store={$noteworthyStore} checkExists={(d) => !!d.noteworthyMatches}>
        <ErrorPage slot="error" status={500} message={$t("error.generic", "Error loading data.")} />

        <Card style="margin-top: var(--lg-gap);">
            <h2>{$t("matches.noteworthy.title", "Noteworthy Matches")}</h2>
            {#if showNoteworthyStaleNotice}
                <p class="muted">
                    {$t(
                        "matches.noteworthy.stale",
                        "Live refresh returned no noteworthy matches. Showing the last available list."
                    )}
                </p>
            {/if}
            {#if displayedNoteworthy}
                <NoteworthyTable
                    title={$t("matches.noteworthy.high-score", "Highest Scores")}
                    matches={displayedNoteworthy.highScore}
                />
                <NoteworthyTable
                    title={$t("matches.noteworthy.combined-score", "Highest Combined Scores")}
                    matches={displayedNoteworthy.combinedScore}
                />
                <NoteworthyTable
                    title={$t("matches.noteworthy.losing-score", "Highest Losing Scores")}
                    matches={displayedNoteworthy.losingScore}
                />
                {#if noteworthyMisses.length}
                    <h3>{$t("matches.noteworthy.misses", "Biggest Prediction Misses")}</h3>
                    <p class="muted">
                        {$t("matches.predicted-scores.note-opr", "Based on team OPR")}
                    </p>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>{$t("common.event", "Event")}</th>
                                    <th>{$t("common.match", "Match")}</th>
                                    <th>{$t("matches.actual", "Actual")}</th>
                                    <th>{$t("matches.predicted-scores", "Predicted Scores")}</th>
                                    <th>{$t("matches.error", "Error")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each noteworthyMisses as row}
                                    {@const event = row.match.event}
                                    <tr>
                                        <td>
                                            <a href={`/events/${event.season}/${event.code}/matches`}>
                                                {event.name}
                                            </a>
                                        </td>
                                        <td>{row.match.description}</td>
                                        <td class="score">
                                            {row.actualRed}-{row.actualBlue}
                                        </td>
                                        <td class="score">
                                            {prettyPrintFloat(row.pred.redScore)}-{prettyPrintFloat(row.pred.blueScore)}
                                        </td>
                                        <td>{prettyPrintFloat(row.error)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            {:else}
                <p class="muted">{ $t("matches.noteworthy.none", "No matches available.") }</p>
            {/if}
        </Card>
    </Loading>
</WidthProvider>

<style>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--lg-gap);
    }

    .event-block {
        margin-top: var(--md-gap);
    }

    .muted {
        color: var(--secondary-text-color);
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

    .red {
        color: var(--red-team-text-color);
        font-weight: 600;
    }

    .blue {
        color: var(--blue-team-text-color);
        font-weight: 600;
    }

    .score {
        font-weight: 600;
    }

    h1 {
        margin: 0;
    }
</style>
