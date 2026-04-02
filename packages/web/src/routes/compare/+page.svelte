<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { CURRENT_SEASON, DESCRIPTORS, type Season } from "@ftc-stats/common";
    import type { TeamSeasonEpa, TeamMatchEpa } from "@ftc-stats/common";
    import { onMount } from "svelte";
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import OPRTrendChart from "$lib/components/charts/OPRTrendChart.svelte";
    import EpaComparisonBar from "$lib/components/charts/EpaComparisonBar.svelte";
    import EpaTrendChart from "$lib/components/charts/EpaTrendChart.svelte";
    import Location from "$lib/components/Location.svelte";
    import { prettyPrintFloat, prettyPrintOrdinal } from "$lib/printers/number";
    import type { CompareTeamsQuery } from "$lib/graphql/generated/graphql-operations";
    import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { t } from "$lib/i18n";
    import { getTeamSeasonEpa, getTeamMatchEpas } from "$lib/api/epa";

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

    type PinnedComparison = {
        id: string;
        name: string;
        teams: string[];
        season: Season;
    };

    const PIN_STORAGE_KEY = "ftcstats:compare-pins";
    const RECENT_STORAGE_KEY = "ftcstats:compare-recent";
    let pinnedComparisons: PinnedComparison[] = [];
    let recentComparisons: PinnedComparison[] = [];
    let recentsReady = false;
    let lastRecentSignature = "";

    const quickSets = [
        {
            key: "compare.quickset.sample-1",
            name: "Sample: 9794, 18219, 16896",
            teams: ["9794", "18219", "16896"],
        },
        {
            key: "compare.quickset.sample-2",
            name: "Sample: 11115, 16072, 16460",
            teams: ["11115", "16072", "16460"],
        },
    ];

    onMount(() => {
        if (!browser) return;
        try {
            pinnedComparisons = JSON.parse(
                localStorage.getItem(PIN_STORAGE_KEY) ?? "[]"
            ) as PinnedComparison[];
        } catch {
            pinnedComparisons = [];
        }
        try {
            recentComparisons = JSON.parse(
                localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]"
            ) as PinnedComparison[];
        } catch {
            recentComparisons = [];
        }
        recentsReady = true;
    });

    function persistPins() {
        if (!browser) return;
        localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(pinnedComparisons));
    }

    function persistRecents() {
        if (!browser) return;
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentComparisons));
    }

    function recentSignature(teams: string[], season: Season) {
        return `${season}|${teams.join(",")}`;
    }

    function applyTeamSet(teams: string[], season: Season = selectedSeason) {
        const params = new URLSearchParams();
        if (teams.length > 0) params.set("teams", teams.join(","));
        if (season !== CURRENT_SEASON) params.set("season", season.toString());
        goto(`?${params.toString()}`, { replaceState: false, noScroll: true });
    }

    function pinCurrent() {
        if (!browser || teamNumbers.length < 2) return;
        const defaultName = `${selectedSeason} · ${teamNumbers.join(", ")}`;
        const name = window.prompt(
            $t("compare.pin-name", "Pinned comparison name"),
            defaultName
        );
        if (!name) return;
        const pin: PinnedComparison = {
            id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`) + Math.random().toString(16),
            name: name.trim() || defaultName,
            teams: [...teamNumbers],
            season: selectedSeason,
        };
        pinnedComparisons = [pin, ...pinnedComparisons].slice(0, 10);
        persistPins();
    }

    function applyPin(pin: PinnedComparison) {
        applyTeamSet(pin.teams, pin.season);
    }

    function removePin(id: string) {
        pinnedComparisons = pinnedComparisons.filter((pin) => pin.id !== id);
        persistPins();
    }

    function updateRecents() {
        if (!browser || !recentsReady) return;
        if (teamNumbers.length === 0) return;
        const signature = recentSignature(teamNumbers, selectedSeason);
        if (signature === lastRecentSignature) return;
        lastRecentSignature = signature;
        const recent: PinnedComparison = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: teamNumbers.join(", "),
            teams: [...teamNumbers],
            season: selectedSeason,
        };
        recentComparisons = [
            recent,
            ...recentComparisons.filter(
                (entry) => recentSignature(entry.teams, entry.season) !== signature
            ),
        ].slice(0, 8);
        persistRecents();
    }

    function applyRecent(entry: PinnedComparison) {
        applyTeamSet(entry.teams, entry.season);
    }

    function clearRecent(id: string) {
        recentComparisons = recentComparisons.filter((entry) => entry.id !== id);
        persistRecents();
    }

    $: updateRecents();

    let epaByTeam: Map<string, TeamSeasonEpa> = new Map();
    let epaMatchesByTeam: Map<string, TeamMatchEpa[]> = new Map();

    $: if (browser && teamNumbers.length >= 2) {
        Promise.all(
            teamNumbers.map(async (num) => {
                const epa = await getTeamSeasonEpa(+num, selectedSeason);
                if (epa) epaByTeam.set(num, epa);
            })
        ).then(() => (epaByTeam = epaByTeam));

        Promise.all(
            teamNumbers.map(async (num) => {
                const matches = await getTeamMatchEpas(+num, selectedSeason);
                if (matches.length) epaMatchesByTeam.set(num, matches);
            })
        ).then(() => (epaMatchesByTeam = epaMatchesByTeam));
    }

    $: epaBarTeams = compareTeams
        ?.filter((t) => epaByTeam.has(String(t.number)))
        .map((t) => {
            const epa = epaByTeam.get(String(t.number))!;
            return {
                teamNumber: t.number,
                teamName: t.name,
                epaTotal: epa.epa_total ?? 0,
                epaAuto: epa.epa_auto ?? 0,
                epaDc: epa.epa_dc ?? 0,
                epaEndgame: epa.epa_endgame ?? 0,
            };
        }) ?? [];

    $: epaTrendTeams = compareTeams
        ?.filter((t) => epaMatchesByTeam.has(String(t.number)))
        .map((t) => {
            const matches = epaMatchesByTeam.get(String(t.number))!;
            return {
                teamNumber: t.number,
                teamName: t.name,
                matches: matches.map((m) => ({
                    matchId: m.match_id,
                    eventCode: m.event_code,
                    epaPre: m.epa_pre ?? 0,
                    epaPost: m.epa_post ?? 0,
                })),
            };
        }) ?? [];
</script>

<Head title="Compare Teams | FTC Stats" description="Compare multiple FTC teams side-by-side" />

<WidthProvider width={"1200px"}>
    <PageShell railWidth="360px">
        <div slot="rail" class="rail">
            <Card style="margin: 0;">
                <div class="header">
                    <p class="eyebrow">{$t("compare.title", "Compare Teams")}</p>
                    <h1>{$t("compare.title", "Compare Teams")}</h1>
                    <p class="subtitle">
                        {$t(
                            "compare.subtitle",
                            "Compare multiple teams side-by-side with historical OPR data"
                        )}
                    </p>
                </div>

                <div class="team-selector">
                    <div class="input-group">
                        <input
                            type="number"
                            bind:value={newTeamInput}
                            on:keydown={handleKeydown}
                            placeholder={$t("compare.placeholder", "Enter team number...")}
                            class="team-input"
                        />
                        <button on:click={addTeam} class="add-btn">
                            <Fa icon={faPlus} />
                            {$t("compare.add-team", "Add Team")}
                        </button>
                    </div>

                    <Form id="compare-season" noscriptSubmit>
                        <SeasonSelect bind:season={selectedSeason} nonForm on:change={updateUrl} />
                    </Form>

                    {#if teamNumbers.length > 0}
                        <div class="selected-teams">
                            {#each teamNumbers as num}
                                <div class="team-chip">
                                    <span>{$t("common.team", "Team")} {num}</span>
                                    <button on:click={() => removeTeam(num)} class="remove-btn">
                                        <Fa icon={faTimes} />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <h2 class="rail-head">{$t("compare.quick-sets", "Quick Sets")}</h2>
                <div class="chip-group">
                    {#each quickSets as set}
                        <button class="chip" on:click={() => applyTeamSet(set.teams)}>
                            {$t(set.key, set.name)}
                        </button>
                    {/each}
                </div>
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <div class="rail-row">
                    <h2 class="rail-head">{$t("compare.recent", "Recently Used")}</h2>
                </div>

                {#if recentComparisons.length}
                    <ul class="preset-list">
                        {#each recentComparisons as entry (entry.id)}
                            <li>
                                <button class="preset" on:click={() => applyRecent(entry)}>
                                    <b>{entry.name}</b>
                                    <span>
                                        {entry.season} · {entry.teams.length}
                                        {$t("compare.teams", "teams")}
                                    </span>
                                </button>
                                <button
                                    class="preset-remove"
                                    on:click={() => clearRecent(entry.id)}
                                    aria-label={$t("compare.remove-recent", "Remove recent")}
                                >
                                    ×
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="preset-empty">
                        {$t(
                            "compare.no-recents",
                            "Your recent comparisons will show up here."
                        )}
                    </p>
                {/if}
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <div class="rail-row">
                    <h2 class="rail-head">{$t("compare.pinned", "Pinned Comparisons")}</h2>
                    <button
                        class="preset-save"
                        on:click={pinCurrent}
                        disabled={teamNumbers.length < 2}
                    >
                        {$t("compare.pin-current", "Pin current")}
                    </button>
                </div>

                {#if pinnedComparisons.length}
                    <ul class="preset-list">
                        {#each pinnedComparisons as pin (pin.id)}
                            <li>
                                <button class="preset" on:click={() => applyPin(pin)}>
                                    <b>{pin.name}</b>
                                    <span>
                                        {pin.season} · {pin.teams.length}
                                        {$t("compare.teams", "teams")}
                                    </span>
                                </button>
                                <button
                                    class="preset-remove"
                                    on:click={() => removePin(pin.id)}
                                    aria-label={$t("compare.unpin", "Remove pin")}
                                >
                                    ×
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="preset-empty">
                        {$t(
                            "compare.no-pins",
                            "No pinned comparisons yet. Pin your current set to save it."
                        )}
                    </p>
                {/if}
            </Card>
        </div>

        {#if teamNumbers.length === 0}
            <Card>
                <div class="empty-state">
                    <p>{$t("compare.empty", "Add teams above to start comparing")}</p>
                    <p class="hint">
                        {$t("compare.hint", "Try adding teams like 9794, 18219, or 16896")}
                    </p>
                </div>
            </Card>
        {:else if teamNumbers.length === 1}
            <Card>
                <div class="empty-state">
                    <p>{$t("compare.need-more", "Add at least one more team to compare")}</p>
                </div>
            </Card>
        {:else}
            <Loading store={$compareStore} checkExists={() => true}>
                <Card>
                    {#if compareTeams.length === 0}
                        <div class="empty-state">
                            <p>
                                {$t(
                                    "compare.no-matching",
                                    "No matching teams found for the selected season."
                                )}
                            </p>
                        </div>
                    {:else}
                        <div class="comparison-content">
                            <h2>{$t("compare.summary", "Team Summary")}</h2>
                            <div class="summary-grid">
                                {#each compareTeams as team}
                                    <div class="summary-card">
                                        <div class="team-title">
                                            {$t("common.team", "Team")} {team.number} - {team.name}
                                        </div>
                                        <div class="team-location">
                                            <Location {...team.location} link={false} />
                                        </div>
                                        {#if team.quickStats}
                                            <div class="stats-grid">
                                                <div class="stat">
                                                    <span>{$t("stats.opr.total", "Total OPR")}</span>
                                                    <strong>
                                                        {prettyPrintFloat(
                                                            team.quickStats.tot.value
                                                        )}
                                                    </strong>
                                                    <em>
                                                        {prettyPrintOrdinal(
                                                            team.quickStats.tot.rank
                                                        )}
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
                                                    <span>{$t("stats.opr.auto", "Auto OPR")}</span>
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
                                                    <span>{$t("stats.opr.teleop", "Teleop OPR")}</span>
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
                                                    <span>{$t("stats.opr.endgame", "Endgame OPR")}</span>
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
                                            {#if epaByTeam.has(String(team.number))}
                                                {@const epa = epaByTeam.get(String(team.number))}
                                                <div class="epa-divider"></div>
                                                <div class="stats-grid">
                                                    <div class="stat">
                                                        <span>Total EPA</span>
                                                        <strong class="epa-val">{epa?.epa_total?.toFixed(1) ?? "—"}</strong>
                                                        <em>{epa?.total_epa_rank ? prettyPrintOrdinal(epa.total_epa_rank) : "—"}</em>
                                                    </div>
                                                    <div class="stat">
                                                        <span>Auto EPA</span>
                                                        <strong>{epa?.epa_auto?.toFixed(1) ?? "—"}</strong>
                                                    </div>
                                                    <div class="stat">
                                                        <span>DC EPA</span>
                                                        <strong>{epa?.epa_dc?.toFixed(1) ?? "—"}</strong>
                                                    </div>
                                                    <div class="stat">
                                                        <span>Endgame EPA</span>
                                                        <strong>{epa?.epa_endgame?.toFixed(1) ?? "—"}</strong>
                                                    </div>
                                                </div>
                                            {/if}
                                        {:else}
                                            <div class="no-stats">
                                                {$t("compare.no-stats", "No stats available yet.")}
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </Card>

                {#if trendTeams.length > 0}
                    <Card>
                        <h2>
                            {$t("compare.trend", "OPR Trend")} ({$t("form.season", "Season")}{" "}
                            {selectedSeason})
                        </h2>
                        {#key `${teamNumbers.join(",")}-${selectedSeason}`}
                            <OPRTrendChart teamData={trendTeams} />
                        {/key}
                    </Card>
                {:else}
                    <Card>
                        <div class="empty-state">
                            <p>
                                {$t(
                                    "compare.no-event-stats",
                                    "No event stats available for the selected season."
                                )}
                            </p>
                        </div>
                    </Card>
                {/if}

                {#if epaBarTeams.length > 0}
                    <Card>
                        <h2>EPA Comparison</h2>
                        {#key `epa-bar-${teamNumbers.join(",")}-${selectedSeason}`}
                            <EpaComparisonBar teams={epaBarTeams} />
                        {/key}
                    </Card>
                {/if}

                {#if epaTrendTeams.length > 0}
                    <Card>
                        <h2>EPA Progression</h2>
                        {#key `epa-trend-${teamNumbers.join(",")}-${selectedSeason}`}
                            <EpaTrendChart teamData={epaTrendTeams} />
                        {/key}
                    </Card>
                {/if}
            </Loading>
        {/if}
    </PageShell>
</WidthProvider>

<style>
    .header {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    .rail-head {
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
        margin-bottom: var(--md-gap);
    }

    .rail-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-gap);
        margin-bottom: var(--md-gap);
    }

    .eyebrow {
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
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
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .chip-group {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sm-gap);
    }

    .chip {
        border: var(--border-width) solid var(--sep-color);
        background: var(--form-bg-color);
        color: var(--text-color);
        padding: var(--sm-pad) var(--md-pad);
        border-radius: var(--control-radius);
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        cursor: pointer;
    }

    .chip:hover {
        background: var(--theme-soft-color);
        box-shadow: 3px 3px 0 var(--sep-color);
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
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
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
        background: var(--fg-color);
        color: var(--text-color);
        border: none;
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
        font-size: var(--md-font-size);
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .add-btn:hover {
        background: var(--theme-soft-color);
        box-shadow: 4px 4px 0 var(--sep-color);
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
        background: var(--fg-color);
        color: var(--text-color);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--pill-border-radius);
        font-size: var(--md-font-size);
    }

    .remove-btn {
        background: none;
        border: none;
        color: var(--text-color);
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

    .preset-save {
        border: var(--border-width) solid var(--sep-color);
        background: var(--fg-color);
        color: var(--text-color);
        padding: var(--sm-pad) var(--md-pad);
        border-radius: var(--control-radius);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: var(--xs-font-size);
        cursor: pointer;
    }

    .preset-save:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .preset-save:hover:not(:disabled) {
        background: var(--theme-soft-color);
        box-shadow: 3px 3px 0 var(--sep-color);
    }

    .preset-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }

    .preset-list li {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--sm-gap);
        align-items: center;
    }

    .preset {
        width: 100%;
        text-align: left;
        border: var(--border-width) solid var(--sep-color);
        background: var(--form-bg-color);
        color: var(--text-color);
        padding: var(--sm-pad) var(--md-pad);
        border-radius: var(--control-radius);
        display: flex;
        flex-direction: column;
        gap: 2px;
        cursor: pointer;
    }

    .preset span {
        font-size: var(--xs-font-size);
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .preset:hover {
        background: var(--theme-soft-color);
    }

    .preset-remove {
        border: var(--border-width) solid var(--sep-color);
        background: var(--fg-color);
        color: var(--text-color);
        padding: var(--sm-pad);
        border-radius: var(--control-radius);
        cursor: pointer;
    }

    .preset-remove:hover {
        background: var(--theme-soft-color);
    }

    .preset-empty {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        margin: 0;
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
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);
        background: var(--fg-color);
        box-shadow: var(--card-shadow);
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

    .epa-divider {
        border-top: 1px solid var(--sep-color);
        margin: var(--md-gap) 0;
    }

    .epa-val {
        color: var(--theme-color);
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
