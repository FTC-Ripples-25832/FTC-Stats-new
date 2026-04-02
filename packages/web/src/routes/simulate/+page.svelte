<script lang="ts">
    import { CURRENT_SEASON, type Season } from "@ftc-stats/common";
    import type { EpaMatchPrediction } from "@ftc-stats/common";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import { t } from "$lib/i18n";
    import { getHttpOrigin } from "$lib/apiOrigin";

    let selectedSeason: Season = CURRENT_SEASON;

    let red1: number | null = null;
    let red2: number | null = null;
    let blue1: number | null = null;
    let blue2: number | null = null;

    let prediction: EpaMatchPrediction | null = null;
    let loading = false;
    let error: string | null = null;

    async function predict() {
        if (red1 == null || red2 == null || blue1 == null || blue2 == null) {
            error = "Please enter all four team numbers.";
            return;
        }

        loading = true;
        error = null;
        prediction = null;

        try {
            const res = await fetch(`${getHttpOrigin()}/rest/v1/epa/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    red_teams: [red1, red2],
                    blue_teams: [blue1, blue2],
                    season: selectedSeason,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Request failed (${res.status})`);
            }

            prediction = (await res.json()) as EpaMatchPrediction;
        } catch (e: any) {
            error = e?.message ?? "An unknown error occurred.";
        } finally {
            loading = false;
        }
    }

    function prettyPct(value: number): string {
        return (value * 100).toFixed(1) + "%";
    }

    function prettyScore(value: number): string {
        return value.toFixed(1);
    }
</script>

<Head title="Simulate Match | FTC Stats" description="Predict FTC match outcomes using EPA data" />

<WidthProvider width={"1200px"}>
    <PageShell railWidth="360px">
        <div slot="rail" class="rail">
            <Card style="margin: 0;">
                <div class="header">
                    <p class="eyebrow">{$t("simulate.title", "Simulate Match")}</p>
                    <h1>{$t("simulate.title", "Simulate Match")}</h1>
                    <p class="subtitle">
                        {$t(
                            "simulate.subtitle",
                            "Pick 2 red and 2 blue teams to see an EPA-based match prediction"
                        )}
                    </p>
                </div>

                <Form id="simulate-season" noscriptSubmit>
                    <SeasonSelect bind:season={selectedSeason} nonForm />
                </Form>
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <h2 class="rail-head alliance-label red">
                    {$t("simulate.red-alliance", "Red Alliance")}
                </h2>
                <div class="alliance-inputs">
                    <input
                        type="number"
                        bind:value={red1}
                        placeholder={$t("simulate.team-1", "Team 1")}
                        class="team-input"
                    />
                    <input
                        type="number"
                        bind:value={red2}
                        placeholder={$t("simulate.team-2", "Team 2")}
                        class="team-input"
                    />
                </div>
            </Card>

            <Card style="margin: var(--lg-gap) 0 0;">
                <h2 class="rail-head alliance-label blue">
                    {$t("simulate.blue-alliance", "Blue Alliance")}
                </h2>
                <div class="alliance-inputs">
                    <input
                        type="number"
                        bind:value={blue1}
                        placeholder={$t("simulate.team-1", "Team 1")}
                        class="team-input"
                    />
                    <input
                        type="number"
                        bind:value={blue2}
                        placeholder={$t("simulate.team-2", "Team 2")}
                        class="team-input"
                    />
                </div>
            </Card>

            <button class="predict-btn" on:click={predict} disabled={loading}>
                {#if loading}
                    {$t("simulate.loading", "Predicting...")}
                {:else}
                    {$t("simulate.predict", "Predict")}
                {/if}
            </button>

            {#if error}
                <p class="error-msg">{error}</p>
            {/if}
        </div>

        {#if prediction == null}
            <Card>
                <div class="empty-state">
                    <p>
                        {$t(
                            "simulate.empty",
                            "Select your alliances and click Predict to see the match outcome."
                        )}
                    </p>
                </div>
            </Card>
        {:else}
            <Card>
                <h2>{$t("simulate.result", "Prediction Result")}</h2>

                <div class="win-prob-bar">
                    <div
                        class="prob-fill red"
                        style={`width: ${prediction.red_win_prob * 100}%`}
                    >
                        {prettyPct(prediction.red_win_prob)}
                    </div>
                    <div
                        class="prob-fill blue"
                        style={`width: ${prediction.blue_win_prob * 100}%`}
                    >
                        {prettyPct(prediction.blue_win_prob)}
                    </div>
                </div>

                <p class="winner-text">
                    {$t("simulate.predicted-winner", "Predicted Winner")}:
                    <strong class={prediction.predicted_winner === "red" ? "red-text" : "blue-text"}>
                        {prediction.predicted_winner === "red"
                            ? $t("simulate.red", "Red Alliance")
                            : $t("simulate.blue", "Blue Alliance")}
                    </strong>
                </p>
            </Card>

            <Card>
                <h2>{$t("simulate.score-breakdown", "Score Breakdown")}</h2>
                <div class="breakdown-grid">
                    <div class="breakdown-card red-border">
                        <h3 class="red-text">{$t("simulate.red", "Red Alliance")}</h3>
                        <div class="score-rows">
                            <div class="score-row">
                                <span>{$t("simulate.total", "Total")}</span>
                                <strong>{prettyScore(prediction.red_score)}</strong>
                            </div>
                            <div class="score-row">
                                <span>{$t("simulate.auto", "Auto")}</span>
                                <strong>{prettyScore(prediction.red_auto)}</strong>
                            </div>
                            <div class="score-row">
                                <span>{$t("simulate.dc", "Driver-Controlled")}</span>
                                <strong>{prettyScore(prediction.red_dc)}</strong>
                            </div>
                            <div class="score-row">
                                <span>{$t("simulate.endgame", "Endgame")}</span>
                                <strong>{prettyScore(prediction.red_endgame)}</strong>
                            </div>
                        </div>
                        <div class="team-list">
                            <span>{$t("common.team", "Team")} {red1}</span>
                            <span>{$t("common.team", "Team")} {red2}</span>
                        </div>
                    </div>

                    <div class="breakdown-card blue-border">
                        <h3 class="blue-text">{$t("simulate.blue", "Blue Alliance")}</h3>
                        <div class="score-rows">
                            <div class="score-row">
                                <span>{$t("simulate.total", "Total")}</span>
                                <strong>{prettyScore(prediction.blue_score)}</strong>
                            </div>
                            <div class="score-row">
                                <span>{$t("simulate.auto", "Auto")}</span>
                                <strong>{prettyScore(prediction.blue_auto)}</strong>
                            </div>
                            <div class="score-row">
                                <span>{$t("simulate.dc", "Driver-Controlled")}</span>
                                <strong>{prettyScore(prediction.blue_dc)}</strong>
                            </div>
                            <div class="score-row">
                                <span>{$t("simulate.endgame", "Endgame")}</span>
                                <strong>{prettyScore(prediction.blue_endgame)}</strong>
                            </div>
                        </div>
                        <div class="team-list">
                            <span>{$t("common.team", "Team")} {blue1}</span>
                            <span>{$t("common.team", "Team")} {blue2}</span>
                        </div>
                    </div>
                </div>
            </Card>
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

    .rail-head {
        font-size: var(--sm-font-size);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 700;
        margin-bottom: var(--md-gap);
    }

    .alliance-label.red {
        color: #e74c3c;
    }

    .alliance-label.blue {
        color: #3498db;
    }

    .alliance-inputs {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }

    .team-input {
        width: 100%;
        padding: var(--md-pad);
        font-size: var(--md-font-size);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--control-radius);
        background: var(--form-bg-color);
        color: var(--text-color);
        box-sizing: border-box;
    }

    .team-input:focus {
        outline: none;
        border-color: var(--theme-color);
    }

    .predict-btn {
        display: block;
        width: 100%;
        margin-top: var(--lg-gap);
        padding: var(--md-pad) var(--lg-pad);
        background: var(--theme-color);
        color: #fff;
        border: none;
        border-radius: var(--control-radius);
        font-size: var(--md-font-size);
        font-weight: 600;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        transition: opacity 0.2s;
    }

    .predict-btn:hover:not(:disabled) {
        opacity: 0.85;
    }

    .predict-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-msg {
        margin-top: var(--md-gap);
        color: #e74c3c;
        font-size: var(--sm-font-size);
    }

    .empty-state {
        padding: var(--xl-gap);
        text-align: center;
        color: var(--secondary-text-color);
    }

    .win-prob-bar {
        display: flex;
        border-radius: var(--control-radius);
        overflow: hidden;
        margin: var(--lg-gap) 0;
        height: 36px;
        font-size: var(--sm-font-size);
        font-weight: 600;
    }

    .prob-fill {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        min-width: 40px;
        transition: width 0.4s ease;
    }

    .prob-fill.red {
        background: #e74c3c;
    }

    .prob-fill.blue {
        background: #3498db;
    }

    .winner-text {
        text-align: center;
        font-size: var(--md-font-size);
        margin-bottom: var(--md-gap);
    }

    .red-text {
        color: #e74c3c;
    }

    .blue-text {
        color: #3498db;
    }

    .breakdown-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lg-gap);
        margin-top: var(--lg-gap);
    }

    .breakdown-card {
        padding: var(--md-pad);
        border: var(--border-width) solid var(--sep-color);
        border-radius: var(--card-radius);
        background: var(--fg-color);
        box-shadow: var(--card-shadow);
    }

    .breakdown-card.red-border {
        border-top: 3px solid #e74c3c;
    }

    .breakdown-card.blue-border {
        border-top: 3px solid #3498db;
    }

    .breakdown-card h3 {
        font-size: var(--md-font-size);
        margin-bottom: var(--md-gap);
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .score-rows {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }

    .score-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--sm-pad) 0;
        border-bottom: 1px solid var(--sep-color);
    }

    .score-row:last-child {
        border-bottom: none;
    }

    .score-row span {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    .score-row strong {
        font-size: var(--md-font-size);
    }

    .team-list {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        margin-top: var(--md-gap);
        padding-top: var(--md-gap);
        border-top: 1px solid var(--sep-color);
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    @media (max-width: 800px) {
        .breakdown-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
