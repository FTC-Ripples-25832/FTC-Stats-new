<script lang="ts">
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import { t } from "$lib/i18n";

    export let title: string;
    export let matches: any[] = [];

    $: noDataLabel = $t("matches.noteworthy.none", "No matches available.");
</script>

<h3>{title}</h3>

{#if matches.length}
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>{$t("common.event", "Event")}</th>
                    <th>{$t("common.match", "Match")}</th>
                    <th>{$t("common.red", "Red")}</th>
                    <th>{$t("common.blue", "Blue")}</th>
                    <th>{$t("common.date", "Date")}</th>
                </tr>
            </thead>
            <tbody>
                {#each matches as match, i}
                    {@const event = match.event}
                    {@const scores = match.scores}
                    <tr>
                        <td>{i + 1}</td>
                        <td>
                            <a href={`/events/${event.season}/${event.code}/matches`}>
                                {event.name}
                            </a>
                        </td>
                        <td>{match.description}</td>
                        {#if scores && "red" in scores}
                            <td class="red">{scores.red.totalPoints}</td>
                            <td class="blue">{scores.blue.totalPoints}</td>
                        {:else}
                            <td class="muted">-</td>
                            <td class="muted">-</td>
                        {/if}
                        <td>{prettyPrintDateRangeString(event.start, event.end)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{:else}
    <p class="muted">{noDataLabel}</p>
{/if}

<style>
    h3 {
        margin: var(--md-gap) 0;
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

    .muted {
        color: var(--secondary-text-color);
    }
</style>
