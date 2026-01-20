<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { CURRENT_SEASON, DESCRIPTORS, type Season } from "@ftc-stats/common";
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import OPRTrendChart from "$lib/components/charts/OPRTrendChart.svelte";
    import Location from "$lib/components/Location.svelte";
    import { prettyPrintFloat, prettyPrintOrdinal } from "$lib/printers/number";
    import type { CompareTeamsQuery } from "$lib/graphql/generated/graphql-operations";
    import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let data;

    let teamNumbers: string[] = [];
    let newTeamInput: string | number = "";
    let selectedSeason: Season = CURRENT_SEASON;

    $: compareStore = data.compare;
    $: compareTeams = ($compareStore?.data?.teams ?? []) as CompareTeamsQuery["teams"];

    // Parse team numbers from URL query params
    $: {
        const teamsParam = $page.url.searchParams.get("teams");
        teamNumbers = teamsParam ? teamsParam.split(",").filter((t) => t.trim()) : [];

        const seasonParam = $page.url.searchParams.get("season");
        const parsedSeason = seasonParam ? parseInt(seasonParam, 10) : CURRENT_SEASON;
        selectedSeason = (Number.isFinite(parsedSeason) ? parsedSeason : CURRENT_SEASON) as Season;
    }

    function addTeam() {
        const num = String(newTeamInput).trim();
        if (num && !teamNumbers.includes(num)) {
            teamNumbers = [...teamNumbers, num];
            updateUrl();
            newTeamInput = "";
        }
    }

    function removeTeam(num: string) {
        teamNumbers = teamNumbers.filter((t) => t !== num);
        updateUrl();
    }

    function updateUrl() {
        const params = new URLSearchParams();
        if (teamNumbers.length > 0) {
            params.set("teams", teamNumbers.join(","));
        }
        if (selectedSeason !== CURRENT_SEASON) {
            params.set("season", selectedSeason.toString());
        }
        goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            addTeam();
        }
    }

    function getOprValue(stats: any, season: Season): number | null {
        if (!stats || !("opr" in stats) || !stats.opr) return null;
        const opr = stats.opr as Record<string, number | null | undefined>;
        if (DESCRIPTORS[season].pensSubtract || !("totalPointsNp" in opr)) {
            return typeof opr.totalPoints == "number" ? opr.totalPoints : null;
        }
        return typeof opr.totalPointsNp == "number" ? opr.totalPointsNp : opr.totalPoints ?? null;
    }

    function statPercent(rank: number | null | undefined, count: number | null | undefined) {
        if (!rank || !count || count <= 1) return null;
        return prettyPrintFloat((1 - (rank - 1) / (count - 1)) * 100) + "%";
    }

    $: trendTeams =
        compareTeams
            ?.map((team) => {
                const events =
                    team?.events
                        ?.map((event) => {
                            const opr = getOprValue(event.stats, selectedSeason);
                            if (opr == null || !event.event?.start) return null;
                            return {
                                eventName: event.event.name,
                                opr,
                                date: event.event.start,
                            };
                        })
                        .filter((e): e is NonNullable<typeof e> => e != null)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) ??
                    [];
                return {
                    teamNumber: team.number,
                    teamName: team.name,
                    events,
                };
            })
            .filter((team) => team.events.length > 0) ?? [];
</script>

<Head title="Compare Teams | FTCStats" description="Compare multiple FTC teams side-by-side" />

<WidthProvider>
    <Card>
        <div class="header">
            <h1>Compare Teams</h1>
            <p class="subtitle">Compare multiple teams side-by-side with historical OPR data</p>
        </div>

        <div class="team-selector">
            <div class="input-group">
                <input
                    type="number"
                    bind:value={newTeamInput}
                    on:keydown={handleKeydown}
                    placeholder="Enter team number..."
                    class="team-input"
                />
                <button on:click={addTeam} class="add-btn">
                    <Fa icon={faPlus} />
                    Add Team
                </button>
            </div>

            <Form id="compare-season" noscriptSubmit>
                <SeasonSelect bind:season={selectedSeason} nonForm on:change={updateUrl} />
            </Form>

            {#if teamNumbers.length > 0}
                <div class="selected-teams">
                    {#each teamNumbers as num}
                        <div class="team-chip">
                            <span>Team {num}</span>
                            <button on:click={() => removeTeam(num)} class="remove-btn">
                                <Fa icon={faTimes} />
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

    </Card>

    {#if teamNumbers.length === 0}
        <Card>
            <div class="empty-state">
                <p>Add teams above to start comparing</p>
                <p class="hint">Try adding teams like 9794, 18219, or 16896</p>
            </div>
        </Card>
    {:else if teamNumbers.length === 1}
        <Card>
            <div class="empty-state">
                <p>Add at least one more team to compare</p>
            </div>
        </Card>
    {:else}
        <Loading store={$compareStore} checkExists={() => true}>
            <Card>
                {#if compareTeams.length === 0}
                    <div class="empty-state">
                        <p>No matching teams found for the selected season.</p>
                    </div>
                {:else}
                    <div class="comparison-content">
                        <h2>Team Summary</h2>
                        <div class="summary-grid">
                            {#each compareTeams as team}
                                <div class="summary-card">
                                    <div class="team-title">
                                        Team {team.number} - {team.name}
                                    </div>
                                    <div class="team-location">
                                        <Location {...team.location} link={false} />
                                    </div>
                                    {#if team.quickStats}
                                        <div class="stats-grid">
                                            <div class="stat">
                                                <span>Total OPR</span>
                                                <strong>
                                                    {prettyPrintFloat(team.quickStats.tot.value)}
                                                </strong>
                                                <em>
                                                    {prettyPrintOrdinal(team.quickStats.tot.rank)}
                                                    {statPercent(
                                                        team.quickStats.tot.rank,
                                                        team.quickStats.count
                                                    )
                                                        ? ` - ${statPercent(
                                                              team.quickStats.tot.rank,
                                                              team.quickStats.count
                                                          )}`
                                                        : ""}
                                                </em>
                                            </div>
                                            <div class="stat">
                                                <span>Auto OPR</span>
                                                <strong>
                                                    {prettyPrintFloat(
                                                        team.quickStats.auto.value
                                                    )}
                                                </strong>
                                                <em>
                                                    {prettyPrintOrdinal(
                                                        team.quickStats.auto.rank
                                                    )}
                                                    {statPercent(
                                                        team.quickStats.auto.rank,
                                                        team.quickStats.count
                                                    )
                                                        ? ` - ${statPercent(
                                                              team.quickStats.auto.rank,
                                                              team.quickStats.count
                                                          )}`
                                                        : ""}
                                                </em>
                                            </div>
                                            <div class="stat">
                                                <span>Teleop OPR</span>
                                                <strong>
                                                    {prettyPrintFloat(team.quickStats.dc.value)}
                                                </strong>
                                                <em>
                                                    {prettyPrintOrdinal(team.quickStats.dc.rank)}
                                                    {statPercent(
                                                        team.quickStats.dc.rank,
                                                        team.quickStats.count
                                                    )
                                                        ? ` - ${statPercent(
                                                              team.quickStats.dc.rank,
                                                              team.quickStats.count
                                                          )}`
                                                        : ""}
                                                </em>
                                            </div>
                                            <div class="stat">
                                                <span>Endgame OPR</span>
                                                <strong>
                                                    {prettyPrintFloat(team.quickStats.eg.value)}
                                                </strong>
                                                <em>
                                                    {prettyPrintOrdinal(team.quickStats.eg.rank)}
                                                    {statPercent(
                                                        team.quickStats.eg.rank,
                                                        team.quickStats.count
                                                    )
                                                        ? ` - ${statPercent(
                                                              team.quickStats.eg.rank,
                                                              team.quickStats.count
                                                          )}`
                                                        : ""}
                                                </em>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="no-stats">No stats available yet.</div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </Card>

            {#if trendTeams.length > 0}
                <Card>
                    <h2>OPR Trend (Season {selectedSeason})</h2>
                    {#key `${teamNumbers.join(",")}-${selectedSeason}`}
                        <OPRTrendChart teamData={trendTeams} />
                    {/key}
                </Card>
            {:else}
                <Card>
                    <div class="empty-state">
                        <p>No event stats available for the selected season.</p>
                    </div>
                </Card>
            {/if}
        </Loading>
    {/if}
</WidthProvider>

<style>
    .header {
        padding: var(--lg-pad);
        background: var(--hover-color);
        border-radius: 8px;
        margin-bottom: var(--vl-gap);
    }

    h1 {
        font-size: var(--vl-font-size);
        margin-bottom: var(--sm-gap);
    }

    .subtitle {
        color: var(--secondary-text-color);
        font-size: var(--md-font-size);
    }

    .team-selector {
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;
        margin-bottom: var(--vl-gap);
    }

    .input-group {
        display: flex;
        gap: var(--md-gap);
        margin-bottom: var(--md-gap);
    }

    .team-input {
        flex: 1;
        padding: var(--md-pad);
        font-size: var(--md-font-size);
        border: 1px solid var(--sep-color);
        border-radius: 4px;
        background: var(--form-bg-color);
        color: var(--text-color);
    }

    .team-input:focus {
        outline: none;
        border-color: var(--theme-color);
    }

    .add-btn {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        padding: var(--md-pad) var(--lg-pad);
        background: var(--theme-color);
        color: var(--theme-text-color);
        border: none;
        border-radius: 4px;
        font-size: var(--md-font-size);
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .add-btn:hover {
        opacity: 0.9;
    }

    .selected-teams {
        display: flex;
        flex-wrap: wrap;
        gap: var(--md-gap);
    }

    .team-chip {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        padding: var(--sm-pad) var(--md-pad);
        background: var(--theme-color);
        color: var(--theme-text-color);
        border-radius: var(--pill-border-radius);
        font-size: var(--md-font-size);
    }

    .remove-btn {
        background: none;
        border: none;
        color: var(--theme-text-color);
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    .remove-btn:hover {
        opacity: 1;
    }

    .empty-state {
        padding: var(--xl-gap);
        text-align: center;
        color: var(--secondary-text-color);
    }

    .empty-state p {
        margin-bottom: var(--md-gap);
    }

    .hint {
        font-size: var(--sm-font-size);
        font-style: italic;
    }

    .comparison-content {
        display: flex;
        flex-direction: column;
        gap: var(--lg-gap);
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--lg-gap);
    }

    .summary-card {
        padding: var(--md-pad);
        border: 1px solid var(--sep-color);
        border-radius: 8px;
        background: var(--fg-color);
    }

    .team-title {
        font-weight: 600;
        margin-bottom: var(--sm-gap);
    }

    .team-location {
        color: var(--secondary-text-color);
        margin-bottom: var(--md-gap);
        font-size: var(--sm-font-size);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--md-gap);
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }

    .stat span {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    .stat strong {
        font-size: var(--md-font-size);
    }

    .stat em {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    .no-stats {
        color: var(--secondary-text-color);
    }

    @media (max-width: 800px) {
        .input-group {
            flex-direction: column;
        }

        .add-btn {
            width: 100%;
            justify-content: center;
        }
    }
</style>
