<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Award from "$lib/components/Award.svelte";
    import type { TeamQuery } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import { t } from "$lib/i18n";

    type TeamData = NonNullable<TeamQuery["teamByNumber"]>;

    export let team: TeamData;

    $: rows = team.events
        .flatMap((event) =>
            event.awards.map((award) => ({
                award,
                event: event.event,
            }))
        )
        .sort((a, b) => new Date(b.event.start).getTime() - new Date(a.event.start).getTime());

    $: title = $t("teams.awards.timeline", "Awards Timeline");
</script>

<Card style="margin-bottom: var(--lg-gap);">
    <h2>{title}</h2>
    {#if rows.length}
        <ul>
            {#each rows as row}
                <li>
                    <div class="event">
                        <a href={`/events/${row.event.season}/${row.event.code}`}>
                            {row.event.name}
                        </a>
                        <span class="date">
                            {prettyPrintDateRangeString(row.event.start, row.event.end)}
                        </span>
                    </div>
                    <div class="award">
                        <Award award={row.award} comma={false} />
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <p class="muted">{$t("teams.awards.none", "No awards yet.")}</p>
    {/if}
</Card>

<style>
    h2 {
        margin-top: 0;
        margin-bottom: var(--md-gap);
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    li {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-bottom: var(--sm-gap);
        border-bottom: 1px solid var(--sep-color);
    }

    li:last-child {
        border-bottom: none;
    }

    .event {
        display: flex;
        justify-content: space-between;
        gap: var(--md-gap);
        flex-wrap: wrap;
    }

    .date {
        color: var(--secondary-text-color);
        font-size: 0.85em;
    }

    .award {
        font-size: 0.95em;
    }

    .muted {
        color: var(--secondary-text-color);
    }
</style>

