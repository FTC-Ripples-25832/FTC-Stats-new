<script lang="ts" context="module">
    export let PAGE_SIZE = 50;
</script>

<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { page } from "$app/stores";
    import TabbedCard from "$lib/components/tabs/TabbedCard.svelte";
    import { faBolt, faHashtag } from "@fortawesome/free-solid-svg-icons";
    import TabContent from "$lib/components/tabs/TabContent.svelte";
    import { browser } from "$app/environment";
    import { afterNavigate, goto } from "$app/navigation";
    import { onMount } from "svelte";
    import {
        DESCRIPTORS,
        EventTypeOption,
        RegionOption,
        RemoteOption,
        type Season,
    } from "@ftc-stats/common";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import Tep from "./Tep.svelte";
    import type { PageData } from "./$types";
    import { TEAM_CLICK_ACTION_CTX } from "$lib/components/matches/MatchTeam.svelte";
    import { setContext } from "svelte";
    import FocusedTeam from "$lib/components/stats/FocusedTeam.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import RegionSelect from "$lib/components/ui/form/RegionSelect.svelte";
    import {
        commitQueryParamBatch,
        queryParam,
        queryParamUrlKeeping,
        startQueryParamBatch,
    } from "$lib/util/search-params/search-params";
    import { REGION_EC_DC } from "$lib/util/search-params/region";
    import { DATE_EC_DC } from "$lib/util/search-params/date";
    import DateRange from "$lib/components/ui/form/DateRange.svelte";
    import { EVENT_TY_EC_DC, REMOTE_EC_DC } from "$lib/util/search-params/event-ty";
    import RemoteSelect from "$lib/components/ui/form/RemoteSelect.svelte";
    import { PAGE_EC_DC } from "$lib/util/search-params/int";
    import Head from "$lib/components/Head.svelte";
    import Match from "./Match.svelte";
    import EventTypeSelect from "../../../../lib/components/ui/form/EventTypeSelect.svelte";
    import { addDays, dateToStr } from "$lib/util/date";
    import { t } from "$lib/i18n";

    function go(tab: string, season: Season) {
        let tabChanged = tab != $page.params.tab;
        let seasonChanged = season != +$page.params.season;
        if (browser && (tabChanged || seasonChanged)) {
            let toKeep = ["region", "type", "filter"];
            if (DESCRIPTORS[season].hasRemote) toKeep.push("remote");
            if (!seasonChanged) {
                toKeep.push("start");
                toKeep.push("end");
            }
            let params = queryParamUrlKeeping(toKeep);
            goto(`/records/${season}/${selectedTab}${params}`, { replaceState: false });
        }
    }

    let season = +$page.params.season as Season;
    let selectedTab = $page.params.tab;
    $: go(selectedTab, season);

    afterNavigate(() => {
        season = +$page.params.season as Season;
        selectedTab = $page.params.tab;
    });

    export let data: PageData;
    $: tepData = data.tepData;
    $: matchData = data.matchData;

    let focusedTeam: number | null = null;
    let focusedTeamName: string | null;
    let focusedTeamEvent: string | null;
    setContext(TEAM_CLICK_ACTION_CTX, (t: number, name: string, event?: string) => {
        if (focusedTeam == t) {
            focusedTeam = null;
            focusedTeamName = null;
            focusedTeamEvent = null;
        } else {
            focusedTeam = t;
            focusedTeamName = name;
            focusedTeamEvent = event ?? null;
        }
    });

    let region = queryParam("region", REGION_EC_DC);
    let eventType = queryParam("type", EVENT_TY_EC_DC);
    let start = queryParam("start", DATE_EC_DC);
    let end = queryParam("end", DATE_EC_DC);
    let remote = queryParam("remote", REMOTE_EC_DC);
    let pageNum = queryParam("page", PAGE_EC_DC);

    type RecordPreset = {
        id: string;
        name: string;
        season: Season;
        tab: string;
        region: RegionOption;
        eventType: EventTypeOption;
        remote: RemoteOption;
        start: string | null;
        end: string | null;
    };

    const PRESET_STORAGE_KEY = "ftcstats:records-presets";
    const RECENT_STORAGE_KEY = "ftcstats:records-recent";
    let savedPresets: RecordPreset[] = [];
    let recentRecords: RecordPreset[] = [];
    let recentsReady = false;
    let lastRecentSignature = "";

    onMount(() => {
        if (!browser) return;
        try {
            savedPresets = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) ?? "[]");
        } catch {
            savedPresets = [];
        }
        try {
            recentRecords = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]");
        } catch {
            recentRecords = [];
        }
        recentsReady = true;
    });

    function persistPresets() {
        if (!browser) return;
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(savedPresets));
    }

    function persistRecents() {
        if (!browser) return;
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentRecords));
    }

    function currentSnapshot(nameOverride?: string): RecordPreset {
        const baseName = `${DESCRIPTORS[season].seasonName} · ${selectedTab}`;
        return {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: nameOverride ?? baseName,
            season,
            tab: selectedTab,
            region: $region,
            eventType: $eventType,
            remote: $remote,
            start: dateToStr($start),
            end: dateToStr($end),
        };
    }

    function snapshotSignature(snapshot: RecordPreset): string {
        return [
            snapshot.season,
            snapshot.tab,
            snapshot.region,
            snapshot.eventType,
            snapshot.remote,
            snapshot.start ?? "",
            snapshot.end ?? "",
        ].join("|");
    }

    function saveCurrentPreset() {
        if (!browser) return;
        const defaultName = `${DESCRIPTORS[season].seasonName} · ${selectedTab}`;
        const name = window.prompt(
            $t("records.preset-name", "Preset name"),
            defaultName
        );
        if (!name) return;
        const preset = currentSnapshot(name.trim() || defaultName);
        preset.id =
            (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`) +
            Math.random().toString(16);
        savedPresets = [preset, ...savedPresets].slice(0, 12);
        persistPresets();
    }

    function applyPreset(preset: RecordPreset) {
        const params = new URLSearchParams();
        if (preset.region !== RegionOption.All) params.set("region", preset.region);
        if (preset.eventType !== EventTypeOption.Competition) params.set("type", preset.eventType);
        if (preset.remote !== RemoteOption.All) params.set("remote", preset.remote);
        if (preset.start) params.set("start", preset.start);
        if (preset.end) params.set("end", preset.end);
        const query = params.toString();
        goto(`/records/${preset.season}/${preset.tab}${query ? `?${query}` : ""}`, {
            replaceState: false,
        });
    }

    function removePreset(id: string) {
        savedPresets = savedPresets.filter((preset) => preset.id !== id);
        persistPresets();
    }

    function updateRecents() {
        if (!browser || !recentsReady) return;
        const snapshot = currentSnapshot();
        const signature = snapshotSignature(snapshot);
        if (signature === lastRecentSignature) return;
        lastRecentSignature = signature;
        recentRecords = [
            snapshot,
            ...recentRecords.filter((r) => snapshotSignature(r) !== signature),
        ].slice(0, 6);
        persistRecents();
    }

    function applyRecent(record: RecordPreset) {
        applyPreset(record);
    }

    function clearRecent(id: string) {
        recentRecords = recentRecords.filter((record) => record.id !== id);
        persistRecents();
    }

    function setRegion(next: RegionOption) {
        $region = next;
        change();
    }

    function setEventType(next: EventTypeOption) {
        $eventType = next;
        change();
    }

    function setRemote(next: RemoteOption) {
        $remote = next;
        change();
    }

    function setDateRange(range: "all" | "last14" | "last30") {
        if (range === "all") {
            $start = null;
            $end = null;
        } else {
            const today = new Date();
            $end = today;
            $start = addDays(today, range === "last14" ? -14 : -30);
        }
        change();
    }

    $: updateRecents();

    function change() {
        startQueryParamBatch();
        $region = $region;
        $eventType = $eventType;
        $start = $start;
        $end = $end;
        $remote = $remote;
        $pageNum = 1;
        commitQueryParamBatch();
    }
</script>

<Head
    title={`${season} ${$page.params.tab == "teams" ? "Team" : "Match"} Records | FTC Stats`}
    description="Records and high scores for the {$page.params.season} season."
/>

{#if focusedTeam && focusedTeamName}
    <FocusedTeam
        team={{
            season,
            team: { number: focusedTeam, name: focusedTeamName },
            eventCode: focusedTeamEvent ?? undefined,
        }}
        remote={false}
    />
{/if}

<WidthProvider width={"1200px"}>
    <PageShell railWidth="360px">
        <div slot="rail" class="rail">
            <Card style="margin: 0;">
                <div class="rail-title">
                    <p class="eyebrow">{$t("records.title", "Season Records")}</p>
                    <h1>{DESCRIPTORS[season].seasonName}</h1>
                    <p class="subtitle">
                        {$t(
                            "records.subtitle",
                            "Filter by region, date, or event type to surface the top performances."
                        )}
                    </p>
                </div>

                <Form id="records-options" style="col">
                    <div class="row">
                        <label for="season-select">
                            {$t("form.season", "Season")}
                            <SeasonSelect bind:season id="season-select" />
                        </label>

                        <label for="region-select">
                            {$t("form.regions", "Regions")}
                            <RegionSelect
                                bind:region={$region}
                                name="regions"
                                id="region-select"
                                on:change={change}
                            />
                        </label>

                        {#if DESCRIPTORS[season].hasRemote}
                            <label for="remote-select">
                                {$t("form.events", "Events")}
                                <RemoteSelect
                                    bind:remote={$remote}
                                    id="remote-select"
                                    on:change={change}
                                />
                            </label>
                        {:else}
                            <label for="type-select">
                                {$t("form.event-types", "Event Types")}
                                <EventTypeSelect
                                    bind:eventType={$eventType}
                                    id="type-select"
                                    on:change={change}
                                    competitionOnly
                                />
                            </label>
                        {/if}
                    </div>

                    <div>
                        {$t("form.date-range", "Date Range")}
                        <DateRange bind:start={$start} bind:end={$end} {season} on:change={change} />
                    </div>

                    <noscript> <input type="submit" /> </noscript>
                </Form>
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <h2 class="rail-head">{$t("records.quick-filters", "Quick Filters")}</h2>
                <div class="chip-group">
                    <button class="chip" on:click={() => setRegion(RegionOption.All)}>
                        {$t("records.filter.all-regions", "All Regions")}
                    </button>
                    <button class="chip" on:click={() => setRegion(RegionOption.UnitedStates)}>
                        {$t("records.filter.us-only", "US Only")}
                    </button>
                    <button class="chip" on:click={() => setRegion(RegionOption.International)}>
                        {$t("records.filter.international", "International")}
                    </button>
                </div>

                <div class="chip-group">
                    <button class="chip" on:click={() => setEventType(EventTypeOption.Official)}>
                        {$t("records.filter.official", "Official Events")}
                    </button>
                    <button
                        class="chip"
                        on:click={() => setEventType(EventTypeOption.Competition)}
                    >
                        {$t("records.filter.competition", "Competition")}
                    </button>
                    <button class="chip" on:click={() => setEventType(EventTypeOption.OffSeason)}>
                        {$t("records.filter.offseason", "Offseason")}
                    </button>
                </div>

                {#if DESCRIPTORS[season].hasRemote}
                    <div class="chip-group">
                        <button class="chip" on:click={() => setRemote(RemoteOption.All)}>
                            {$t("records.filter.all-events", "All Events")}
                        </button>
                        <button class="chip" on:click={() => setRemote(RemoteOption.Trad)}>
                            {$t("records.filter.traditional", "Traditional")}
                        </button>
                        <button class="chip" on:click={() => setRemote(RemoteOption.Remote)}>
                            {$t("records.filter.remote", "Remote")}
                        </button>
                    </div>
                {/if}

                <div class="chip-group">
                    <button class="chip" on:click={() => setDateRange("all")}>
                        {$t("records.filter.full-season", "Full Season")}
                    </button>
                    <button class="chip" on:click={() => setDateRange("last14")}>
                        {$t("records.filter.last-14", "Last 14 Days")}
                    </button>
                    <button class="chip" on:click={() => setDateRange("last30")}>
                        {$t("records.filter.last-30", "Last 30 Days")}
                    </button>
                </div>
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <div class="rail-row">
                    <h2 class="rail-head">{$t("records.recent", "Recently Used")}</h2>
                </div>

                {#if recentRecords.length}
                    <ul class="preset-list">
                        {#each recentRecords as record (record.id)}
                            <li>
                                <button class="preset" on:click={() => applyRecent(record)}>
                                    <b>{record.name}</b>
                                    <span>
                                        {record.region} · {record.eventType}
                                        {record.start ? ` · ${record.start}` : ""}
                                    </span>
                                </button>
                                <button
                                    class="preset-remove"
                                    on:click={() => clearRecent(record.id)}
                                    aria-label={$t("records.remove-recent", "Remove recent")}
                                >
                                    ×
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="preset-empty">
                        {$t(
                            "records.no-recents",
                            "Your recent record views will show up here."
                        )}
                    </p>
                {/if}
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <div class="rail-row">
                    <h2 class="rail-head">{$t("records.saved-presets", "Saved Presets")}</h2>
                    <button class="preset-save" on:click={saveCurrentPreset}>
                        {$t("records.save-preset", "Save current")}
                    </button>
                </div>

                {#if savedPresets.length}
                    <ul class="preset-list">
                        {#each savedPresets as preset (preset.id)}
                            <li>
                                <button class="preset" on:click={() => applyPreset(preset)}>
                                    <b>{preset.name}</b>
                                    <span>
                                        {DESCRIPTORS[preset.season].seasonName} · {preset.tab}
                                    </span>
                                </button>
                                <button
                                    class="preset-remove"
                                    on:click={() => removePreset(preset.id)}
                                    aria-label={$t("records.remove-preset", "Remove preset")}
                                >
                                    ×
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="preset-empty">
                        {$t(
                            "records.no-presets",
                            "No presets yet. Save your current filters to reuse them."
                        )}
                    </p>
                {/if}
            </Card>
        </div>

        <TabbedCard
            tabs={[
                [faHashtag, $t("common.teams", "Teams"), "teams", true],
                [faBolt, $t("common.matches", "Matches"), "matches", true],
            ]}
            bind:selectedTab
        >
            <TabContent name="teams">
                <Tep {tepData} {focusedTeam} />
            </TabContent>

            <TabContent name="matches">
                <Match {matchData} {focusedTeam} />
            </TabContent>
        </TabbedCard>
    </PageShell>
</WidthProvider>

<style>
    h1 {
        margin-top: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    .rail-title {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    .eyebrow {
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
    }

    .subtitle {
        color: var(--secondary-text-color);
        margin: 0 0 var(--md-gap);
        font-size: var(--md-font-size);
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

    .chip-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--sm-gap);
        margin-bottom: var(--md-gap);
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

    .preset-save:hover {
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

    label,
    div {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        width: 100%;
    }

    .row {
        flex-direction: column;
        gap: var(--md-gap);
    }
</style>
