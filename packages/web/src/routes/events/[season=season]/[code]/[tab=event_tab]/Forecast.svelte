<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import MatchPrediction from "$lib/components/matches/MatchPrediction.svelte";
    import { prettyPrintFloat } from "$lib/printers/number";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import { DESCRIPTORS, type Season } from "@ftc-stats/common";
    import { ExportToCsv } from "export-to-csv";
    import { t } from "$lib/i18n";
    import { getAllianceTeamNumbers, hasEntries } from "$lib/components/matches/prediction-maps";
    import { getPredictorPrediction, type PredictorSuccess } from "$lib/components/matches/predictor";
    import { browser } from "$app/environment";
    import {
        MODEL_VARIANCE,
        getPredictionFromMaps,
        getWinProbabilities,
    } from "$lib/components/matches/prediction-service";
    import { ENABLE_XGB_PREDICTIONS } from "$lib/constants";

    export let event: any;
    export let season: Season;
    export let matches: any[] = [];
    export let teams: any[] = [];
    export let teamOprMap: Record<number, number> = {};
    export let teamEpaMap: Record<number, number> = {};

    const VARIANCE_XGB = MODEL_VARIANCE.XGB;

    $: hasEpa = hasEntries(teamEpaMap);
    $: hasOpr = hasEntries(teamOprMap);
    $: ratingMap = hasEpa ? teamEpaMap : teamOprMap;
    $: modelLabel = hasEpa ? "EPA" : "OPR";
    $: modelVariance = hasEpa ? MODEL_VARIANCE.EPA : MODEL_VARIANCE.OPR;
    $: modelNote = hasEpa
        ? $t("matches.predicted-scores.note-epa", "Based on event EPA")
        : $t("matches.predicted-scores.note-opr", "Based on team OPR");

    function getRating(teamNumber: number): number | null {
        const val = ratingMap?.[teamNumber];
        return typeof val === "number" && !Number.isNaN(val) ? val : null;
    }

    function getPrediction(match: any): {
        redScore: number;
        blueScore: number;
        model: "EPA" | "OPR" | "XGB";
    } | null {
        const pred = getPredictionFromMaps(match, teamEpaMap, teamOprMap);
        if (!pred) return null;
        return { redScore: pred.redScore, blueScore: pred.blueScore, model: pred.model };
    }

    function getActualWinner(match: any): "RED" | "BLUE" | "TIE" | null {
        if (!match?.scores || !("red" in match.scores)) return null;
        if (match.scores.red.totalPoints > match.scores.blue.totalPoints) return "RED";
        if (match.scores.blue.totalPoints > match.scores.red.totalPoints) return "BLUE";
        return "TIE";
    }

    $: upcomingMatches = matches.filter((m) => !m.scores);
    $: playedMatches = matches.filter((m) => !!m.scores && "red" in m.scores);

    let xgbWhatIfLoading = false;
    let xgbUpcomingLoading = false;
    let xgbUpcoming: Record<string, PredictorSuccess["prediction"]> = {};
    let upcomingKey = "";

    function getMatchKey(match: any): string {
        return `${match.eventCode}-${match.id}`;
    }

    async function loadXgbUpcoming() {
        if (!browser || !ENABLE_XGB_PREDICTIONS) return;
        if (hasEpa || hasOpr) return;
        xgbUpcomingLoading = true;

        const results = await Promise.all(
            upcomingMatches.map(async (match) => {
                const { red, blue } = getAllianceTeamNumbers(match);
                if (red.length < 2 || blue.length < 2) return null;
                const data = await getPredictorPrediction({
                    red1: red[0],
                    red2: red[1],
                    blue1: blue[0],
                    blue2: blue[1],
                    seasonProgress: getSeasonProgressNow(),
                    penaltyBonus: 15,
                });
                if (!data.ok) return null;
                return { key: getMatchKey(match), prediction: data.prediction };
            })
        );

        const map: Record<string, PredictorSuccess["prediction"]> = {};
        for (const item of results) {
            if (!item) continue;
            map[item.key] = item.prediction;
        }
        xgbUpcoming = map;
        xgbUpcomingLoading = false;
    }

    $: if (browser && ENABLE_XGB_PREDICTIONS && !hasEpa && !hasOpr) {
        const key = upcomingMatches.map(getMatchKey).join("|");
        if (key !== upcomingKey) {
            upcomingKey = key;
            loadXgbUpcoming();
        }
    }

    function getPredictionWithFallback(match: any) {
        const pred = getPredictionFromMaps(match, teamEpaMap, teamOprMap);
        if (pred) return { redScore: pred.redScore, blueScore: pred.blueScore, model: pred.model };
        const key = getMatchKey(match);
        const xgb = xgbUpcoming[key];
        if (xgb) {
            return { redScore: xgb.red.total, blueScore: xgb.blue.total, model: "XGB" as const };
        }
        return null;
    }

    $: predictedUpcoming = upcomingMatches
        .map((match) => {
            const pred = getPredictionWithFallback(match);
            if (!pred) return null;
            const variance =
                pred.model === "XGB" ? MODEL_VARIANCE.XGB : modelVariance;
            const probs = getWinProbabilities(pred.redScore, pred.blueScore, variance);
            return {
                match,
                ...pred,
                probs,
                total: pred.redScore + pred.blueScore,
            };
        })
        .filter((row): row is NonNullable<typeof row> => !!row);

    $: swingThreshold = (() => {
        if (!predictedUpcoming.length) return null;
        const totals = predictedUpcoming.map((r) => r.total).sort((a, b) => a - b);
        const idx = Math.floor(totals.length * 0.75);
        return totals[idx] ?? totals[totals.length - 1] ?? null;
    })();

    $: tossups = predictedUpcoming
        .filter((row) => {
            const p = Math.max(row.probs.red, row.probs.blue);
            return p >= 0.45 && p <= 0.55;
        })
        .slice(0, 10);

    $: expectedWins = (() => {
        const map = new Map<number, number>();
        for (const row of predictedUpcoming) {
            const { red, blue } = getAllianceTeamNumbers(row.match);
            const redProb = row.probs.red;
            const blueProb = row.probs.blue;
            red.forEach((t) => map.set(t, (map.get(t) ?? 0) + redProb));
            blue.forEach((t) => map.set(t, (map.get(t) ?? 0) + blueProb));
        }
        return map;
    })();

    $: topTeams = [...(teams ?? [])]
        .map((t) => ({
            teamNumber: t.teamNumber,
            teamName: t.team?.name ?? "",
            rating: getRating(t.teamNumber),
            expectedWins: expectedWins.get(t.teamNumber) ?? null,
        }))
        .filter((t) => t.rating != null)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 10);

    $: upsets = playedMatches
        .map((match) => {
            const pred = getPrediction(match);
            if (!pred) return null;
            const probs = getWinProbabilities(pred.redScore, pred.blueScore, modelVariance);
            const winner = getActualWinner(match);
            if (!winner || winner === "TIE") return null;
            const winnerProb = winner === "RED" ? probs.red : probs.blue;
            return { match, probs, winner, winnerProb };
        })
        .filter((row): row is NonNullable<typeof row> => !!row)
        .filter((row) => row.winnerProb <= 0.35)
        .sort((a, b) => a.winnerProb - b.winnerProb)
        .slice(0, 10);

    $: highestScore = playedMatches
        .map((match) => ({
            match,
            total: match.scores.red.totalPoints + match.scores.blue.totalPoints,
        }))
        .sort((a, b) => b.total - a.total)[0] ?? null;

    $: closestMatch = playedMatches
        .map((match) => ({
            match,
            margin: Math.abs(match.scores.red.totalPoints - match.scores.blue.totalPoints),
        }))
        .sort((a, b) => a.margin - b.margin)[0] ?? null;

    $: biggestUpset = upsets[0] ?? null;

    $: misses = playedMatches
        .map((match) => {
            const pred = getPrediction(match);
            if (!pred || !match.scores || !("red" in match.scores)) return null;
            const actualRed = match.scores.red.totalPoints;
            const actualBlue = match.scores.blue.totalPoints;
            const marginError = Math.abs(pred.redScore - actualRed) + Math.abs(pred.blueScore - actualBlue);
            return { match, pred, marginError };
        })
        .filter((row): row is NonNullable<typeof row> => !!row)
        .sort((a, b) => b.marginError - a.marginError)
        .slice(0, 10);

    $: accuracy = (() => {
        if (!playedMatches.length) {
            return {
                count: 0,
                ties: 0,
                winnerCount: 0,
                correctRate: null,
                avgScoreError: null,
                avgMarginError: null,
            };
        }
        const rows = playedMatches
            .map((match) => {
                const pred = getPrediction(match);
                if (!pred || !match.scores || !("red" in match.scores)) return null;
                const actualRed = match.scores.red.totalPoints;
                const actualBlue = match.scores.blue.totalPoints;
                const actualMargin = actualRed - actualBlue;
                const predMargin = pred.redScore - pred.blueScore;
                const scoreError =
                    (Math.abs(pred.redScore - actualRed) + Math.abs(pred.blueScore - actualBlue)) /
                    2;
                const marginError = Math.abs(predMargin - actualMargin);
                const actualWinner =
                    actualRed === actualBlue ? "TIE" : actualRed > actualBlue ? "RED" : "BLUE";
                const predWinner =
                    pred.redScore === pred.blueScore
                        ? "TIE"
                        : pred.redScore > pred.blueScore
                          ? "RED"
                          : "BLUE";
                return { actualWinner, predWinner, scoreError, marginError };
            })
            .filter((row): row is NonNullable<typeof row> => !!row);

        const count = rows.length;
        const ties = rows.filter((r) => r.actualWinner === "TIE").length;
        const winnerRows = rows.filter((r) => r.actualWinner !== "TIE");
        const winnerCount = winnerRows.length;
        const correct = winnerRows.filter((r) => r.actualWinner === r.predWinner).length;
        const correctRate = winnerCount ? correct / winnerCount : null;
        const avgScoreError = count
            ? rows.reduce((sum, r) => sum + r.scoreError, 0) / count
            : null;
        const avgMarginError = count
            ? rows.reduce((sum, r) => sum + r.marginError, 0) / count
            : null;

        return {
            count,
            ties,
            winnerCount,
            correctRate,
            avgScoreError,
            avgMarginError,
        };
    })();

    function exportUpcomingCsv() {
        if (!predictedUpcoming.length) return;
        const exporter = new ExportToCsv({
            filename: `${event?.name?.replace(/\s+/g, "_").toLowerCase() || "event"}_predictions`,
            title: `${event?.name ?? "Event"} Predictions`,
            showTitle: true,
            showLabels: true,
            useKeysAsHeaders: true,
        });

        const data = predictedUpcoming.map((row) => {
            const { red, blue } = getAllianceTeamNumbers(row.match);
            return {
                match: row.match.description,
                redTeams: red.join(", "),
                blueTeams: blue.join(", "),
                predictedRed: prettyPrintFloat(row.probs.predictedRed),
                predictedBlue: prettyPrintFloat(row.probs.predictedBlue),
                redWinProb: prettyPrintFloat(row.probs.red * 100) + "%",
                blueWinProb: prettyPrintFloat(row.probs.blue * 100) + "%",
                model: row.model,
            };
        });

        exporter.generateCsv(data);
    }

    // What-if match
    let red1: number | null = null;
    let red2: number | null = null;
    let blue1: number | null = null;
    let blue2: number | null = null;
    let xgbPrediction: PredictorSuccess["prediction"] | null = null;

    function getSeasonProgressNow(): number {
        const descriptor = DESCRIPTORS[season];
        const start = descriptor.firstDate?.getTime?.() ?? 0;
        const end = descriptor.lastDate?.getTime?.() ?? 0;
        const now = Date.now();
        if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 1.0;
        const span = Math.max(1, end - start);
        const progress = (now - start) / span;
        return Math.min(1, Math.max(0.1, progress));
    }

    async function loadXgbWhatIf() {
        if (!browser || !ENABLE_XGB_PREDICTIONS || !red1 || !red2 || !blue1 || !blue2) {
            xgbPrediction = null;
            return;
        }
        xgbWhatIfLoading = true;
        const data = await getPredictorPrediction({
            red1,
            red2,
            blue1,
            blue2,
            seasonProgress: getSeasonProgressNow(),
            penaltyBonus: 15,
        });
        xgbPrediction = data.ok ? (data as PredictorSuccess).prediction : null;
        xgbWhatIfLoading = false;
    }

    $: if (red1 && red2 && blue1 && blue2) {
        loadXgbWhatIf();
    }

    $: whatIfOpr = (() => {
        if (!red1 || !red2 || !blue1 || !blue2) return null;
        if (!hasEntries(ratingMap)) return null;
        const redScore = (getRating(red1) ?? 0) + (getRating(red2) ?? 0);
        const blueScore = (getRating(blue1) ?? 0) + (getRating(blue2) ?? 0);
        return getWinProbabilities(redScore, blueScore, modelVariance);
    })();

    $: videoLinks = [
        ...(event?.liveStreamURL ? [event.liveStreamURL] : []),
        ...(event?.webcasts ?? []),
    ];

    $: accuracyLabel = $t("events.forecast.accuracy", "Prediction Accuracy");
    $: accuracyMatches = $t("events.forecast.accuracy.matches", "Matches Predicted");
    $: accuracyWinner = $t("events.forecast.accuracy.winner", "Winner Accuracy");
    $: accuracyScore = $t("events.forecast.accuracy.score-error", "Avg Score Error");
    $: accuracyMargin = $t("events.forecast.accuracy.margin-error", "Avg Margin Error");
    $: accuracyTies = $t("events.forecast.accuracy.ties", "Ties Ignored");
    $: accuracyModel = $t("events.forecast.accuracy.model", "Model");
</script>

<Card style="margin-bottom: var(--lg-gap);">
    <h2>{$t("events.forecast.title", "Event Forecast")}</h2>
    <p class="subtitle">
        {$t(
            "events.forecast.subtitle",
            "Projected outcomes based on current event ratings and scheduled qualification matches."
        )}
    </p>
</Card>

{#if playedMatches.length}
    <Card style="margin-bottom: var(--lg-gap);">
        <h3>{$t("events.forecast.storylines", "Event Storylines")}</h3>
        <div class="storylines">
            <div>
                <div class="label">{$t("events.forecast.highest-score", "Highest Score")}</div>
                <div class="value">
                    {highestScore
                        ? `${highestScore.match.description} (${highestScore.total})`
                        : "—"}
                </div>
            </div>
            <div>
                <div class="label">{$t("events.forecast.closest", "Closest Match")}</div>
                <div class="value">
                    {closestMatch
                        ? `${closestMatch.match.description} (${closestMatch.margin})`
                        : "—"}
                </div>
            </div>
            <div>
                <div class="label">{$t("events.forecast.biggest-upset", "Biggest Upset")}</div>
                <div class="value">
                    {biggestUpset
                        ? `${biggestUpset.match.description} (${prettyPrintFloat(
                              biggestUpset.winnerProb * 100
                          )}%)`
                        : "—"}
                </div>
            </div>
        </div>
    </Card>
{/if}

<Card style="margin-bottom: var(--lg-gap);">
    <h3>{accuracyLabel}</h3>
    {#if accuracy.count}
        <div class="metrics-grid">
            <div>
                <div class="label">{accuracyModel}</div>
                <div class="value">{modelLabel}</div>
            </div>
            <div>
                <div class="label">{accuracyMatches}</div>
                <div class="value">{accuracy.count}</div>
            </div>
            <div>
                <div class="label">{accuracyWinner}</div>
                <div class="value">
                    {accuracy.correctRate != null
                        ? `${prettyPrintFloat(accuracy.correctRate * 100)}%`
                        : "—"}
                </div>
            </div>
            <div>
                <div class="label">{accuracyScore}</div>
                <div class="value">
                    {accuracy.avgScoreError != null
                        ? prettyPrintFloat(accuracy.avgScoreError)
                        : "—"}
                </div>
            </div>
            <div>
                <div class="label">{accuracyMargin}</div>
                <div class="value">
                    {accuracy.avgMarginError != null
                        ? prettyPrintFloat(accuracy.avgMarginError)
                        : "—"}
                </div>
            </div>
            <div>
                <div class="label">{accuracyTies}</div>
                <div class="value">{accuracy.ties}</div>
            </div>
        </div>
    {:else}
        <p class="muted">{$t("events.forecast.no-data", "No prediction data available yet.")}</p>
    {/if}
</Card>

<Card style="margin-bottom: var(--lg-gap);">
    <h3>{$t("events.forecast.top-teams", "Projected Top Teams")}</h3>
    {#if topTeams.length}
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>{$t("common.team", "Team")}</th>
                        <th>{$t("stats.opr", "Rating")}</th>
                        <th>{$t("teams.expected-wins", "Expected Wins")}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each topTeams as row}
                        <tr>
                            <td>
                                <a href={`/teams/${row.teamNumber}`}>{row.teamNumber}</a>
                                <span class="muted"> {row.teamName}</span>
                            </td>
                            <td>{prettyPrintFloat(row.rating ?? 0)}</td>
                            <td>{row.expectedWins != null ? prettyPrintFloat(row.expectedWins) : "—"}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <p class="muted">{$t("events.forecast.no-data", "No prediction data available yet.")}</p>
    {/if}
</Card>

<Card style="margin-bottom: var(--lg-gap);">
    <h3>{$t("events.forecast.tossups", "Noteworthy Upcoming Matches")}</h3>
    {#if tossups.length}
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>{$t("common.match", "Match")}</th>
                        <th>{$t("common.red", "Red")}</th>
                        <th>{$t("common.blue", "Blue")}</th>
                        <th>{$t("matches.win-prob", "Win Prob")}</th>
                        <th>{$t("matches.model", "Model")}</th>
                        <th>{$t("matches.tags", "Tags")}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each tossups as row}
                        {@const teams = getAllianceTeamNumbers(row.match)}
                        {@const tags = [
                            $t("matches.tag.high-risk", "High-risk"),
                            swingThreshold != null && row.total >= swingThreshold
                                ? $t("matches.tag.key-swing", "Key swing")
                                : null,
                        ].filter(Boolean)}
                        <tr>
                            <td>{row.match.description}</td>
                            <td class="red">{teams.red.join(", ")}</td>
                            <td class="blue">{teams.blue.join(", ")}</td>
                            <td>
                                {prettyPrintFloat(row.probs.red * 100)}% /
                                {prettyPrintFloat(row.probs.blue * 100)}%
                            </td>
                            <td>{row.model}</td>
                            <td>{tags.join(", ")}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else if xgbUpcomingLoading}
        <p class="muted">{$t("common.loading", "Loading…")}</p>
    {:else}
        <p class="muted">{$t("events.forecast.no-upcoming", "No toss-up matches yet.")}</p>
    {/if}

    <div class="actions">
        <button class="action-btn" type="button" on:click={exportUpcomingCsv} disabled={!predictedUpcoming.length}>
            {$t("stats.export", "Export CSV")}
        </button>
    </div>
</Card>

{#if playedMatches.length}
    <Card style="margin-bottom: var(--lg-gap);">
        <h3>{$t("events.forecast.upsets", "Biggest Upsets")}</h3>
        {#if upsets.length}
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{$t("common.match", "Match")}</th>
                            <th>{$t("matches.actual", "Actual")}</th>
                            <th>{$t("matches.win-prob", "Win Prob")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each upsets as row}
                            <tr>
                                <td>{row.match.description}</td>
                                <td>{row.winner}</td>
                                <td>{prettyPrintFloat(row.winnerProb * 100)}%</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <p class="muted">{$t("events.forecast.no-upsets", "No major upsets yet.")}</p>
        {/if}
    </Card>

    <Card style="margin-bottom: var(--lg-gap);">
        <h3>{$t("events.forecast.misses", "Biggest Prediction Misses")}</h3>
        {#if misses.length}
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{$t("common.match", "Match")}</th>
                            <th>{$t("matches.actual", "Actual")}</th>
                            <th>{$t("matches.predicted-scores", "Predicted Scores")}</th>
                            <th>{$t("matches.error", "Error")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each misses as row}
                            <tr>
                                <td>{row.match.description}</td>
                                <td class="score">
                                    {row.match.scores.red.totalPoints}-{row.match.scores.blue.totalPoints}
                                </td>
                                <td class="score">
                                    {prettyPrintFloat(row.pred.redScore)}-{prettyPrintFloat(row.pred.blueScore)}
                                </td>
                                <td>{prettyPrintFloat(row.marginError)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <p class="muted">{$t("events.forecast.no-misses", "No major misses yet.")}</p>
        {/if}
    </Card>
{/if}

<Card style="margin-bottom: var(--lg-gap);">
    <h3>{$t("events.forecast.what-if", "What-If Match")}</h3>
    <p class="subtitle">
        {$t("events.forecast.what-if-subtitle", "Pick teams to see predicted outcomes using current event ratings.")}
    </p>

    <div class="what-if-grid">
        <div>
            <label>{$t("common.red", "Red")} 1</label>
            <input type="number" bind:value={red1} placeholder="Team #" />
        </div>
        <div>
            <label>{$t("common.red", "Red")} 2</label>
            <input type="number" bind:value={red2} placeholder="Team #" />
        </div>
        <div>
            <label>{$t("common.blue", "Blue")} 1</label>
            <input type="number" bind:value={blue1} placeholder="Team #" />
        </div>
        <div>
            <label>{$t("common.blue", "Blue")} 2</label>
            <input type="number" bind:value={blue2} placeholder="Team #" />
        </div>
    </div>

    {#if whatIfOpr}
        <div class="what-if-predictions">
            <MatchPrediction
                label={modelLabel}
                note={modelNote}
                redScore={whatIfOpr.predictedRed}
                blueScore={whatIfOpr.predictedBlue}
                variance={modelVariance}
            />
            {#if xgbPrediction}
                <MatchPrediction
                    label="XGB"
                    note={$t("matches.predicted-scores.note-xgb", "Based on ftc-match-predictor")}
                    redScore={xgbPrediction.red.total}
                    blueScore={xgbPrediction.blue.total}
                    variance={VARIANCE_XGB}
                />
            {:else if xgbWhatIfLoading}
                <span class="muted">{$t("common.loading", "Loading…")}</span>
            {/if}
        </div>
    {/if}
</Card>

<Card>
    <h3>{$t("events.forecast.video", "Video Highlights")}</h3>
    {#if videoLinks.length}
        <div class="video-links">
            {#each videoLinks as link}
                <a href={link} target="_blank" rel="noreferrer" class="norm-link">
                    {prettyPrintDateRangeString(event.start, event.end)} · {link}
                </a>
            {/each}
        </div>
        <p class="muted">
            {$t(
                "events.forecast.video-note",
                "More highlight sources (YouTube/VOD) will be added when configured."
            )}
        </p>
    {:else}
        <p class="muted">
            {$t("events.forecast.video-none", "No livestream or webcast links are available yet.")}
        </p>
    {/if}
</Card>

<style>
    .subtitle {
        color: var(--secondary-text-color);
        margin-top: var(--sm-gap);
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

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--md-gap);
    }

    .action-btn {
        padding: var(--sm-pad) var(--lg-pad);
        border-radius: var(--control-radius);
        border: var(--border-width) solid var(--sep-color);
        background: var(--fg-color);
    }

    .what-if-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--md-gap);
        margin-top: var(--md-gap);
    }

    .what-if-grid input {
        width: 100%;
    }

    .what-if-predictions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sm-gap);
        margin-top: var(--md-gap);
        align-items: center;
    }

    .storylines {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--md-gap);
        margin-top: var(--md-gap);
    }

    .storylines .label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
    }

    .storylines .value {
        font-weight: 600;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: var(--md-gap);
    }

    .metrics-grid .label {
        font-size: 0.85em;
        opacity: 0.7;
    }

    .metrics-grid .value {
        font-weight: 600;
    }

    .video-links {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
    }
</style>
