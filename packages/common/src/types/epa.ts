/** Shared EPA type definitions used by both server and web packages. */

export type TeamEpa = {
    team_number: number;
    norm_epa_current: number | null;
    norm_epa_recent: number | null;
    norm_epa_mean: number | null;
    norm_epa_max: number | null;
};

export type TeamSeasonEpa = {
    team_number: number;
    season: number;
    epa_total: number | null;
    epa_auto: number | null;
    epa_dc: number | null;
    epa_endgame: number | null;
    norm_epa: number | null;
    unitless_epa: number | null;
    epa_conf_low: number | null;
    epa_conf_high: number | null;
    total_epa_rank: number | null;
    country_epa_rank: number | null;
    state_epa_rank: number | null;
    matches_played: number | null;
    name: string | null;
    country: string | null;
    state: string | null;
};

export type TeamMatchEpa = {
    team_number: number;
    season: number;
    event_code: string;
    match_id: string;
    alliance: string;
    epa_pre: number | null;
    epa_post: number | null;
    epa_change: number | null;
    won: boolean | null;
};

export type EpaMatchPrediction = {
    red_score: number;
    blue_score: number;
    red_win_prob: number;
    blue_win_prob: number;
    predicted_winner: string;
    red_auto: number;
    red_dc: number;
    red_endgame: number;
    blue_auto: number;
    blue_dc: number;
    blue_endgame: number;
};

export type SeasonEpaStats = {
    season: number;
    score_mean: number | null;
    score_sd: number | null;
    epa_p99: number | null;
    epa_p95: number | null;
    epa_p90: number | null;
    epa_p75: number | null;
    epa_p50: number | null;
    epa_p25: number | null;
    epa_max: number | null;
    epa_top_10: number | null;
    win_prob_accuracy: number | null;
    score_pred_mae: number | null;
    score_pred_rmse: number | null;
};
