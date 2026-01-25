<script lang="ts">
    import { formatWinProbability, predictMatchSimple } from "@ftc-stats/common";

    type TeamStats = {
        team: number;
        oprAuto: number;
        oprTeleop: number;
        oprTotal: number;
    };

    type PredictorSuccess = {
        ok: true;
        input: {
            red1: number;
            red2: number;
            blue1: number;
            blue2: number;
            seasonProgress: number;
            penaltyBonus: number;
        };
        stats: {
            red1: TeamStats;
            red2: TeamStats;
            blue1: TeamStats;
            blue2: TeamStats;
        };
        prediction: {
            red: { auto: number; teleop: number; total: number };
            blue: { auto: number; teleop: number; total: number };
            winner: "RED" | "BLUE" | "TIE";
            margin: number;
        };
    };

    type PredictorFailure = {
        ok: false;
        error: string;
        message?: string;
        missingTeams?: number[];
        missingFiles?: string[];
    };

    type PredictorResponse = PredictorSuccess | PredictorFailure;

    let red1 = 0;
    let red2 = 0;
    let blue1 = 0;
    let blue2 = 0;
    let seasonProgress = 1.0;
    let penaltyBonus = 15.0;

    let response: PredictorResponse | null = null;
    let errorMessage = "";
    let loading = false;

    const formatScore = (value: number | null | undefined, digits = 1) => {
        if (typeof value !== "number" || Number.isNaN(value)) return "-";
        return value.toFixed(digits);
    };

    const formatTeam = (value: number | null | undefined) => {
        if (!value) return "-";
        return value.toString();
    };

    function buildErrorMessage(data: PredictorFailure) {
        if (data.error === "missing_teams") {
            return `Teams not found in stats: ${data.missingTeams?.join(", ") ?? "unknown"}`;
        }
        if (data.error === "files_missing") {
            return "Predictor models or stats are missing. Run train_split.py first.";
        }
        if (data.error === "predictor_script_missing") {
            return "predict_api.py not found in ftc-match-predictor.";
        }
        if (data.error === "invalid_team_numbers") {
            return "Team numbers must be positive integers.";
        }
        if (data.error === "invalid_predictor_response") {
            return "Predictor returned invalid JSON.";
        }
        if (data.error === "predictor_failed") {
            return data.message ?? "Predictor failed to run.";
        }
        return data.message ?? "Prediction failed.";
    }

    async function runComparison() {
        errorMessage = "";
        response = null;

        if (!red1 || !red2 || !blue1 || !blue2) {
            errorMessage = "Enter four team numbers.";
            return;
        }

        loading = true;
        try {
            const res = await fetch("/api/ftc-match-predictor", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    red1,
                    red2,
                    blue1,
                    blue2,
                    seasonProgress,
                    penaltyBonus,
                }),
            });

            const data = (await res.json()) as PredictorResponse;
            response = data;

            if (!res.ok || !data.ok) {
                errorMessage = buildErrorMessage(data as PredictorFailure);
            }
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : "Failed to call predictor API.";
        } finally {
            loading = false;
        }
    }

    $: successResponse = response && response.ok ? response : null;
    $: teamStats = successResponse ? successResponse.stats : null;
    $: oprTotals = teamStats
        ? {
              red1: teamStats.red1.oprTotal,
              red2: teamStats.red2.oprTotal,
              blue1: teamStats.blue1.oprTotal,
              blue2: teamStats.blue2.oprTotal,
          }
        : null;

    $: ftcstatsPrediction =
        oprTotals &&
        predictMatchSimple(
            oprTotals.red1,
            oprTotals.red2,
            oprTotals.blue1,
            oprTotals.blue2
        );

    $: ftcstatsWinner =
        ftcstatsPrediction &&
        (ftcstatsPrediction.predictedRedScore > ftcstatsPrediction.predictedBlueScore
            ? "RED"
            : ftcstatsPrediction.predictedBlueScore > ftcstatsPrediction.predictedRedScore
              ? "BLUE"
              : "TIE");
</script>

<div class="mock-panel">
    <h1>Predictor Comparison Sandbox</h1>
    <p class="mock-muted">
        Compares ftc-match-predictor (XGBoost) with the FTCStats OPR predictor using the same
        team stats file.
    </p>

    <div class="input-grid">
        <label class="field">
            <span class="label">Red team 1</span>
            <input class="mock-input" type="number" min="0" step="1" bind:value={red1} />
        </label>
        <label class="field">
            <span class="label">Red team 2</span>
            <input class="mock-input" type="number" min="0" step="1" bind:value={red2} />
        </label>
        <label class="field">
            <span class="label">Blue team 1</span>
            <input class="mock-input" type="number" min="0" step="1" bind:value={blue1} />
        </label>
        <label class="field">
            <span class="label">Blue team 2</span>
            <input class="mock-input" type="number" min="0" step="1" bind:value={blue2} />
        </label>
        <label class="field">
            <span class="label">Season progress</span>
            <input
                class="mock-input"
                type="number"
                min="0.1"
                max="1"
                step="0.05"
                bind:value={seasonProgress}
            />
        </label>
        <label class="field">
            <span class="label">Penalty bonus</span>
            <input
                class="mock-input"
                type="number"
                min="0"
                max="50"
                step="1"
                bind:value={penaltyBonus}
            />
        </label>
    </div>

    <div class="actions">
        <button class="mock-button primary" on:click={runComparison} disabled={loading}>
            {loading ? "Running..." : "Run comparison"}
        </button>
    </div>

    <p class="mock-muted note">
        Requires ftc-match-predictor models and stats on disk plus a Python env with pandas/xgboost.
        Set FTC_PREDICTOR_PYTHON if the Python binary is not on PATH.
    </p>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
</div>

{#if successResponse}
    <div class="result-grid">
        <div class="mock-panel result-card">
            <h2>ftc-match-predictor</h2>
            <div class="result-row">
                <span>Winner</span>
                <strong>{successResponse.prediction.winner}</strong>
            </div>
            <div class="result-row">
                <span>Margin</span>
                <strong>{formatScore(successResponse.prediction.margin, 1)}</strong>
            </div>
            <div class="score-grid">
                <div class="score-block red">
                    <div class="score-label">Red total</div>
                    <div class="score-value">
                        {formatScore(successResponse.prediction.red.total, 0)}
                    </div>
                    <div class="score-sub">
                        Auto {formatScore(successResponse.prediction.red.auto, 1)} | Teleop
                        {formatScore(successResponse.prediction.red.teleop, 1)}
                    </div>
                </div>
                <div class="score-block blue">
                    <div class="score-label">Blue total</div>
                    <div class="score-value">
                        {formatScore(successResponse.prediction.blue.total, 0)}
                    </div>
                    <div class="score-sub">
                        Auto {formatScore(successResponse.prediction.blue.auto, 1)} | Teleop
                        {formatScore(successResponse.prediction.blue.teleop, 1)}
                    </div>
                </div>
            </div>
        </div>

        <div class="mock-panel result-card">
            <h2>FTCStats OPR predictor</h2>
            {#if ftcstatsPrediction}
                <div class="result-row">
                    <span>Winner</span>
                    <strong>{ftcstatsWinner}</strong>
                </div>
                <div class="result-row">
                    <span>Red win odds</span>
                    <strong>{formatWinProbability(ftcstatsPrediction.redWinProbability)}</strong>
                </div>
                <div class="score-grid">
                    <div class="score-block red">
                        <div class="score-label">Red predicted</div>
                        <div class="score-value">
                            {formatScore(ftcstatsPrediction.predictedRedScore, 0)}
                        </div>
                    </div>
                    <div class="score-block blue">
                        <div class="score-label">Blue predicted</div>
                        <div class="score-value">
                            {formatScore(ftcstatsPrediction.predictedBlueScore, 0)}
                        </div>
                    </div>
                </div>
            {:else}
                <p class="mock-muted">OPR data missing for one or more teams.</p>
            {/if}
        </div>
    </div>

    <div class="mock-panel">
        <h2>Team stats (from team_stats_split.csv)</h2>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Slot</th>
                        <th>Team</th>
                        <th>Auto OPR</th>
                        <th>Teleop OPR</th>
                        <th>Total OPR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Red 1</td>
                        <td>{formatTeam(teamStats?.red1.team)}</td>
                        <td>{formatScore(teamStats?.red1.oprAuto, 2)}</td>
                        <td>{formatScore(teamStats?.red1.oprTeleop, 2)}</td>
                        <td>{formatScore(teamStats?.red1.oprTotal, 2)}</td>
                    </tr>
                    <tr>
                        <td>Red 2</td>
                        <td>{formatTeam(teamStats?.red2.team)}</td>
                        <td>{formatScore(teamStats?.red2.oprAuto, 2)}</td>
                        <td>{formatScore(teamStats?.red2.oprTeleop, 2)}</td>
                        <td>{formatScore(teamStats?.red2.oprTotal, 2)}</td>
                    </tr>
                    <tr>
                        <td>Blue 1</td>
                        <td>{formatTeam(teamStats?.blue1.team)}</td>
                        <td>{formatScore(teamStats?.blue1.oprAuto, 2)}</td>
                        <td>{formatScore(teamStats?.blue1.oprTeleop, 2)}</td>
                        <td>{formatScore(teamStats?.blue1.oprTotal, 2)}</td>
                    </tr>
                    <tr>
                        <td>Blue 2</td>
                        <td>{formatTeam(teamStats?.blue2.team)}</td>
                        <td>{formatScore(teamStats?.blue2.oprAuto, 2)}</td>
                        <td>{formatScore(teamStats?.blue2.oprTeleop, 2)}</td>
                        <td>{formatScore(teamStats?.blue2.oprTotal, 2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
{/if}

<style>
    .input-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--md-gap);
        margin: var(--lg-gap) 0;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-weight: 600;
    }

    .label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
    }

    .actions {
        display: flex;
        align-items: center;
        gap: var(--md-gap);
    }

    .note {
        margin-top: var(--md-gap);
    }

    .error {
        margin-top: var(--md-gap);
        color: var(--red-team-text-color);
        font-weight: 600;
    }

    .result-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--xl-gap);
    }

    .result-card h2 {
        margin-top: 0;
    }

    .result-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .score-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: var(--lg-gap);
        margin-top: var(--lg-gap);
    }

    .score-block {
        border: 1px solid var(--sep-color);
        border-radius: 12px;
        padding: var(--md-gap);
        background: var(--fg-color);
    }

    .score-block.red {
        border-color: rgba(219, 68, 55, 0.4);
    }

    .score-block.blue {
        border-color: rgba(66, 133, 244, 0.4);
    }

    .score-label {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        margin-bottom: 4px;
    }

    .score-value {
        font-size: var(--lg-font-size);
        font-weight: 700;
    }

    .score-sub {
        margin-top: 6px;
        font-size: var(--sm-font-size);
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
        text-align: left;
        padding: 10px 12px;
        border-bottom: 1px solid var(--sep-color);
    }

    th {
        font-size: var(--sm-font-size);
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }
</style>
