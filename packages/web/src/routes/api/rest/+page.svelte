<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { CURRENT_SEASON, DESCRIPTORS } from "@ftc-stats/common";
    import { t } from "$lib/i18n";
</script>

<Head
    title="API | FTC Stats"
    description="The developer API for FTC Stats, providing access to all our statistics and data."
/>

<WidthProvider width="100ch">
    <Card>
        <h1 class="head">{$t("api.rest.page-title", "REST API")}</h1>

        <div class="rest">
            <p>
                {$t("api.rest.query-intro", "The REST API can be queried at")}{" "}
                <a href="https://api.ftcscout.org/rest/v1">api.ftcscout.org/rest/v1</a>.{" "}
                {$t(
                    "api.rest.query-details",
                    "You do not need to add any additional headers. Please do not abuse the API or we may have to add rate limiting. If you need to make large volumes of queries, use the GraphQL API. The available routes are listed below."
                )}
            </p>

            <h2>{$t("api.rest.general-notes", "General Notes")}</h2>

            <ul>
                <li>
                    {$t(
                        "api.rest.notes.season-prefix",
                        "Seasons are always given as a year number. For example"
                    )}{" "}
                    {DESCRIPTORS[CURRENT_SEASON].seasonName}{" "}
                    {$t("api.rest.notes.season-suffix", "would be")} {CURRENT_SEASON}.
                </li>
                <li>
                    <b>{$t("api.rest.notes.optional", "All query parameters are optional.")}</b>{" "}
                    {$t("api.rest.notes.graphql-type", "The shown value is the equivalent GraphQL type.")}
                </li>
                <li>
                    {$t("api.rest.notes.400", "Response code")} <code>400</code>{" "}
                    {$t(
                        "api.rest.notes.400-suffix",
                        "is used for an invalid type for any variable."
                    )}
                </li>
            </ul>

            <h2>{$t("api.rest.teams", "Teams")}</h2>

            <section>
                <code class="route">/teams/<span class="var">:number</span></code>
                <p>{$t("api.rest.team.get", "Get a team by their number.")}</p>
                <p>
                    {$t(
                        "api.rest.team.returns",
                        "Returns all scalar fields of the Team GraphQL type."
                    )}
                </p>
                <p>
                    <code class="resp-code">404</code
                    >{$t("api.rest.team.404", "s if the team does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/events/<span class="var">:season</span>
                </code>
                <p>
                    {$t(
                        "api.rest.team.events",
                        "Can be used to get all the team event participations for the given season."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.team.events-returns",
                        "Returns all scalar fields and the stats field of the TeamEventParticipation GraphQL type."
                    )}
                </p>
                <p>
                    {$t("api.rest.team.events-no-404-prefix", "Does")} <b>not</b>{" "}
                    <code class="resp-code">404</code>{" "}
                    {$t("api.rest.team.events-no-404-suffix", "if the team does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/awards?season=<span class="var"
                        >Int</span
                    >&ZeroWidthSpace;&eventCode=<span class="var">String</span>
                </code>
                <p>
                    {$t(
                        "api.rest.team.awards",
                        "Gets a list of all the teams awards. Optionally specify the season or event."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.team.awards-returns",
                        "Returns all scalar fields of the Award GraphQL type."
                    )}
                </p>
                <p>
                    {$t("api.rest.team.awards-no-404-prefix", "Does")} <b>not</b>{" "}
                    <code class="resp-code">404</code>{" "}
                    {$t("api.rest.team.awards-no-404-suffix", "if the team does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/matches?season=<span class="var"
                        >Int</span
                    >&ZeroWidthSpace;&eventCode=<span class="var">String</span>
                </code>
                <p>
                    {$t(
                        "api.rest.team.matches",
                        "Get all the matches a team has played optionally in a specific season or at a specific event."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.team.matches-returns",
                        "Returns all scalar fields of the TeamMatchParticipation GraphQL type."
                    )}
                </p>
                <p>
                    <code class="resp-code">404</code
                    >{$t("api.rest.team.matches-404", "s if the team does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/quick-stats?season=<span class="var"
                        >Int</span
                    >&ZeroWidthSpace;{"&"}region=<span class="var">RegionOption</span>
                </code>
                <p>
                    {$t(
                        "api.rest.team.quick-stats",
                        "Get the quick stats for a team in a specific season and region. If the season is not specified defaults to the current season. If the region is not specified defaults to the whole world."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.team.quick-stats-returns",
                        "Returns all fields of the QuickStats GraphQL type."
                    )}
                </p>
                <p>
                    <code class="resp-code">404</code
                    >{$t(
                        "api.rest.team.quick-stats-404",
                        "s if the team does not exist or has no events in the specified season."
                    )}
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/search?region=<span class="var">RegionOption</span
                    >&ZeroWidthSpace;&limit=<span class="var">Int</span
                    >&ZeroWidthSpace;&searchText=<span class="var">String</span>
                </code>
                <p>
                    {$t(
                        "api.rest.team.search",
                        "Get a list of teams. This is the correct query to get a list of all teams."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.team.search-returns",
                        "Returns all scalar fields of the Team GraphQL type."
                    )}
                </p>
            </section>

            <h2>{$t("api.rest.events", "Events")}</h2>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>
                </code>
                <p>{$t("api.rest.events.get", "Get an event with a certain code.")}</p>
                <p>
                    {$t(
                        "api.rest.events.get-returns",
                        "Returns all scalar fields of the Event GraphQL type except for hasMatches."
                    )}
                </p>
                <p>
                    <code class="resp-code">404</code
                    >{$t("api.rest.events.get-404", "s if the event does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>/matches
                </code>
                <p>
                    {$t(
                        "api.rest.events.matches",
                        "Get all the matches, the scores of those matches, and the teams playing in the matches."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.events.matches-returns",
                        "Returns all scalar fields, the scores field, and the teams field from the Match GraphQL type."
                    )}
                </p>
                <p>
                    <code class="resp-code">404</code
                    >{$t("api.rest.events.matches-404", "s if the event does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>/awards
                </code>
                <p>{$t("api.rest.events.awards", "Gets a list of all the awards from the event.")}</p>
                <p>
                    {$t(
                        "api.rest.events.awards-returns",
                        "Returns all scalar fields of the Award GraphQL type."
                    )}
                </p>
                <p>
                    {$t("api.rest.events.awards-no-404-prefix", "Does")} <b>not</b>{" "}
                    <code class="resp-code">404</code>{" "}
                    {$t("api.rest.events.awards-no-404-suffix", "if the event does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>/teams
                </code>
                <p>{$t("api.rest.events.teams", "Get all the team event participations for the event.")}</p>
                <p>
                    {$t(
                        "api.rest.events.teams-returns",
                        "Returns all scalar fields and the stats field of the TeamEventParticipation GraphQL type."
                    )}
                </p>
                <p>
                    {$t("api.rest.events.teams-no-404-prefix", "Does")} <b>not</b>{" "}
                    <code class="resp-code">404</code>{" "}
                    {$t("api.rest.events.teams-no-404-suffix", "if the event does not exist.")}
                </p>
            </section>

            <section>
                <code class="route">
                    /events/search/<span class="var">:season</span>?region=<span class="var">RegionOption</span
                    >&ZeroWidthSpace;&type=<span class="var">EventType</span
                    >&ZeroWidthSpace;&hasMatches=<span class="var">Boolean</span
                    >&ZeroWidthSpace;&start=<span class="var">Date</span>&ZeroWidthSpace;&end=<span
                        class=":var">Date</span
                    >&ZeroWidthSpace;&limit=<span class="var">Int</span
                    >&ZeroWidthSpace;&searchText=<span class="var">String</span>
                </code>
                <p>
                    {$t(
                        "api.rest.events.search",
                        "Get a list of events. This is the correct query to get a list of all events."
                    )}
                </p>
                <p>
                    {$t(
                        "api.rest.events.search-returns",
                        "Returns all scalar fields of the Event GraphQL type except for hasMatches."
                    )}
                </p>
            </section>
        </div>
    </Card>
</WidthProvider>

<style>
    .head {
        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
        margin-bottom: var(--sm-gap);
    }

    .rest {
        padding: var(--sm-pad);
    }

    h1 {
        font-size: var(--vl-font-size);
    }

    h2 {
        font-size: var(--lg-font-size);
        margin: var(--lg-gap) 0 var(--sm-gap) 0;
    }

    ul {
        margin-left: var(--vl-gap);
    }

    p,
    ul,
    code {
        line-height: 1.75;
    }

    section {
        margin: var(--lg-gap) 0;
    }

    section p {
        padding: 0 var(--sm-pad);
    }

    code {
        background: var(--hover-color);
        padding: var(--sm-pad);
    }

    .route {
        display: block;
        padding-left: var(--lg-pad);
        border-radius: 4px;
    }

    .var {
        color: var(--neutral-team-text-color);
    }

    .resp-code {
        background: none;
        padding: 0;
    }
</style>
