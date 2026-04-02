<script lang="ts" context="module">
    export function seasonFromUrl(url: URL): Season {
        let seasonName = url.searchParams.get("season");
        return ALL_SEASONS.find((s) => "" + s == seasonName) ?? CURRENT_SEASON;
    }
</script>

<script lang="ts">
    import { browser } from "$app/environment";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import { page } from "$app/stores";
    import InfoIconRow from "$lib/components/InfoIconRow.svelte";
    import {
        faCakeCandles,
        faCalendarAlt,
        faHeart,
        faLink,
        faLocationDot,
        faMedal,
        faSchool,
        faVideo,
    } from "@fortawesome/free-solid-svg-icons";
    import { prettyPrintURL } from "$lib/printers/url";
    import Location from "$lib/components/Location.svelte";
    import DataFromFirst from "$lib/components/DataFromFirst.svelte";
    import { eventSorter } from "$lib/util/sorters";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import TeamEventStats from "./TeamEventStats.svelte";
    import { ALL_SEASONS, CURRENT_SEASON, DESCRIPTORS, type Season } from "@ftc-stats/common";
    import Award from "$lib/components/Award.svelte";
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import type { Writable } from "svelte/store";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import { queryParam } from "$lib/util/search-params/search-params";
    import Head from "$lib/components/Head.svelte";
    import { setContext } from "svelte";
    import { SHOW_REMOTE_FOCUS_CTX } from "$lib/components/matches/MatchTeam.svelte";
    import QuickStats from "./QuickStats.svelte";
    import TeamSeasonSummary from "./TeamSeasonSummary.svelte";
    import TeamYearStats from "./TeamYearStats.svelte";
    import TeamInsights from "./TeamInsights.svelte";
    import TeamAwardsTimeline from "./TeamAwardsTimeline.svelte";
    import EventScoreSparkline from "./EventScoreSparkline.svelte";
    import EpaQuickStats from "./EpaQuickStats.svelte";
    import { t } from "$lib/i18n";
    import { getTeamSeasonEpa } from "$lib/api/epa";
    import type { TeamSeasonEpa } from "@ftc-stats/common";

    const toSeason = (n: number) => n as Season;

    export let data;

    $: teamStore = data.team;
    $: team = $teamStore?.data?.teamByNumber!;

    $: sortedEvents = [...(team?.events ?? [])].sort(eventSorter);

    let season: Writable<Season> = queryParam("season", {
        encode: (val) => (val == CURRENT_SEASON ? null : "" + val),
        decode: (val) => ALL_SEASONS.find((s) => "" + s == val) ?? CURRENT_SEASON,
        pushState: true,
        killHash: true,
    });

    setContext(SHOW_REMOTE_FOCUS_CTX, false);

    let epaData: TeamSeasonEpa | null = null;

    $: if (browser && team?.number) {
        getTeamSeasonEpa(team.number, $season).then((d) => (epaData = d));
    }
</script>

<Head
    title={!!team ? `${team.number} ${team.name} | FTC Stats` : "Team Page | FTC Stats"}
    description={!!team
        ? `Information and matches for team ${team.number} ${team.name}.`
        : `Information and matches for team ${$page.params.number}`}
    image="https://api.ftcscout.org/banners/teams/{$page.params.number}"
/>

<WidthProvider width={"1200px"}>
    <Loading store={$teamStore} checkExists={(t) => !!t.teamByNumber}>
        <ErrorPage
            slot="error"
            status={404}
            message={`${$t("teams.error.message", "No team with number")} ${$page.params.number}`}
        >
            {$t("teams.error.try-prefix", "(Try searching for teams on")}{" "}
            <a href="/teams">{$t("teams.error.teams-page", "the teams page")}</a>)
        </ErrorPage>

        <PageShell railWidth="360px">
            <div slot="rail" class="rail">
                <Card style="margin: 0;">
                    <h1>{team.number} - {team.name}</h1>

                    <InfoIconRow icon={faSchool}>{team.schoolName}</InfoIconRow>

                    {#if team.sponsors.length}
                        <InfoIconRow icon={faHeart}>{team.sponsors.join(", ")}</InfoIconRow>
                    {/if}

                    {#if team.website}
                        <InfoIconRow icon={faLink}>
                            <a
                                href={team.website}
                                target="_blank"
                                rel="noreferrer"
                                class="norm-link"
                            >
                                {prettyPrintURL(team.website)}
                            </a>
                        </InfoIconRow>
                    {/if}

                    <InfoIconRow icon={faLocationDot}>
                        <Location {...team.location} />
                    </InfoIconRow>

                    <InfoIconRow icon={faCakeCandles}>
                        {$t("teams.rookie-year", "Rookie Year")}: {team.rookieYear}
                    </InfoIconRow>

                    <DataFromFirst />
                </Card>

                <Card style="margin: var(--lg-gap) 0 0;">
                    <Form id="season" noscriptSubmit>
                        <SeasonSelect bind:season={$season} nonForm />
                    </Form>
                </Card>

                {#if team.quickStats}
                    <div class="quick-stats">
                        <QuickStats stats={team.quickStats} season={$season} />
                    </div>
                {/if}

                <EpaQuickStats epa={epaData} />
            </div>

            <div class="main">
                {#if team}
                    <TeamSeasonSummary {team} season={$season} />
                    <TeamInsights {team} />
                    <TeamAwardsTimeline {team} />
                {/if}
                {#each sortedEvents as tep}
                    {@const event = tep.event}
                    {@const href = `/events/${event.season}/${event.code}/matches`}
                    <Card>
                        <h2 id={event.code}><a {href}>{event.name}</a></h2>

                        <InfoIconRow icon={faCalendarAlt}>
                            {prettyPrintDateRangeString(event.start, event.end)}
                        </InfoIconRow>

                        <InfoIconRow icon={faLocationDot}>
                            <Location {...event.location} />
                        </InfoIconRow>

                        {#if event.liveStreamURL || (event.webcasts && event.webcasts.length)}
                            <InfoIconRow icon={faVideo}>
                                {#if event.liveStreamURL}
                                    <a
                                        href={event.liveStreamURL}
                                        target="_blank"
                                        rel="noreferrer"
                                        class="norm-link"
                                    >
                                        {$t("events.livestream", "Live Stream")}
                                    </a>
                                {/if}
                                {#if event.webcasts?.length}
                                    <a
                                        href={event.webcasts[0]}
                                        target="_blank"
                                        rel="noreferrer"
                                        class="norm-link"
                                    >
                                        {$t("events.webcast", "Webcast")}
                                    </a>
                                {/if}
                            </InfoIconRow>
                        {/if}

                        <TeamEventStats
                            stats={tep.stats}
                            season={toSeason(event.season)}
                            remote={event.remote}
                        />

                        <div class="sparkline-row">
                            <span class="sparkline-label">
                                {$t("teams.match-trend", "Match Trend")}
                            </span>
                            <EventScoreSparkline
                                matches={tep.matches.map((m) => m.match)}
                                teamNumber={team.number}
                            />
                        </div>

                        {#if tep.awards.length}
                            <InfoIconRow icon={faMedal}>
                                {#each tep.awards as award, i}
                                    <Award {award} comma={i != tep.awards.length - 1} />
                                {/each}
                            </InfoIconRow>
                        {/if}

                        <MatchTable
                            matches={tep.matches.map((m) => m.match)}
                            {event}
                            focusedTeam={team.number}
                        />
                    </Card>
                {:else}
                    <Card>
                        <div class="no-events">
                            <b>
                                {team.name}
                                {$season == CURRENT_SEASON
                                    ? $t("teams.no-events.current", "has not yet played")
                                    : $t("teams.no-events.past", "did not compete")}{" "}
                                {$t("teams.no-events.in", "in any")}{" "}
                                {DESCRIPTORS[$season].seasonName}{" "}
                                {$t("common.events", "events")}.
                            </b>
                            <p>
                                {$t(
                                    "teams.no-events.hint",
                                    "Try choosing a different season from the dropdown menu."
                                )}
                            </p>
                        </div>
                    </Card>
                {/each}

                {#if team?.quickStatsBySeason?.length}
                    <TeamYearStats stats={team.quickStatsBySeason} />
                {/if}
            </div>
        </PageShell>
    </Loading>
</WidthProvider>

<style>
    h1,
    h2 {
        margin-top: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    h2 a {
        color: inherit;
    }

    .no-events {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--md-gap);
        text-align: center;
    }

    .sparkline-row {
        display: flex;
        align-items: center;
        gap: var(--md-gap);
        margin: var(--md-gap) 0;
        flex-wrap: wrap;
    }

    .sparkline-label {
        color: var(--secondary-text-color);
        font-size: 0.9em;
    }
</style>
