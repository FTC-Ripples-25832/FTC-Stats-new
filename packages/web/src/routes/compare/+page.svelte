<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { CURRENT_SEASON } from "@ftc-stats/common";
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    let teamNumbers: string[] = [];
    let newTeamInput = "";
    let selectedSeason = CURRENT_SEASON;

    // Parse team numbers from URL query params
    $: {
        const teamsParam = $page.url.searchParams.get("teams");
        if (teamsParam) {
            teamNumbers = teamsParam.split(",").filter((t) => t.trim());
        }
    }

    function addTeam() {
        const num = newTeamInput.trim();
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

        {#if teamNumbers.length === 0}
            <div class="empty-state">
                <p>Add teams above to start comparing</p>
                <p class="hint">Try adding teams like 9794, 18219, or 16896</p>
            </div>
        {:else if teamNumbers.length === 1}
            <div class="empty-state">
                <p>Add at least one more team to compare</p>
            </div>
        {:else}
            <div class="comparison-content">
                <p class="coming-soon">
                    Comparison charts and statistics will be displayed here.
                    <br />
                    <em>Feature in development - showing team numbers: {teamNumbers.join(", ")}</em>
                </p>
            </div>
        {/if}
    </Card>
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
        padding: var(--lg-pad);
        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;
    }

    .coming-soon {
        text-align: center;
        color: var(--secondary-text-color);
        padding: var(--xl-gap);
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
