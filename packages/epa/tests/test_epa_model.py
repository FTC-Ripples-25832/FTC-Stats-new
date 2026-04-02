"""Tests for EPA model core logic."""

from src.models.epa.main import EPAModel, MatchPrediction
from src.models.epa.math import (
    SkewNormal,
    calculate_update_weight,
    normalize_epa,
    denormalize_epa,
    win_probability,
)


def test_win_probability_equal_teams():
    """Equal teams should have ~50% win probability."""
    prob = win_probability(100, 100, 30)
    assert abs(prob - 0.5) < 0.01


def test_win_probability_stronger_red():
    """Higher EPA should mean higher win probability."""
    prob = win_probability(120, 80, 30)
    assert prob > 0.5


def test_normalize_denormalize_roundtrip():
    """Normalizing then denormalizing should return original value."""
    original = 55.0
    mean, sd = 100.0, 30.0
    normalized = normalize_epa(original, mean, sd)
    result = denormalize_epa(normalized, mean, sd)
    assert abs(result - original) < 0.01


def test_update_weight_decreases():
    """Weight should decrease with more matches played."""
    w0 = calculate_update_weight(0)
    w5 = calculate_update_weight(5)
    w10 = calculate_update_weight(10)
    assert w0 > w5 > w10


def test_update_weight_elim_lower():
    """Elimination match weight should be lower."""
    w_qual = calculate_update_weight(5, is_elim=False)
    w_elim = calculate_update_weight(5, is_elim=True)
    assert w_elim < w_qual


def test_skewnormal_confidence_interval():
    """CI should be centered around mean."""
    dist = SkewNormal(mean=50.0, variance=100.0)
    low, high = dist.confidence_interval(0.95)
    assert low < 50.0 < high
    assert abs((low + high) / 2 - 50.0) < 0.01


def test_epa_model_predict():
    """Model should produce valid predictions."""
    model = EPAModel(season=2024, score_mean=120.0, score_sd=35.0)
    pred = model.predict_match([25832, 12345], [67890, 11111])
    assert isinstance(pred, MatchPrediction)
    assert 0 <= pred.red_win_prob <= 1
    assert pred.red_score > 0
    assert pred.blue_score > 0


def test_epa_model_update():
    """EPA should change after processing a match."""
    model = EPAModel(season=2024, score_mean=120.0, score_sd=35.0)

    # Get initial EPA
    initial = model.get_team_epa(25832).total

    # Process a match where red (25832) scores very well
    model.update_from_match(
        red_teams=[25832, 12345],
        blue_teams=[67890, 11111],
        red_score=200,
        blue_score=50,
    )

    updated = model.get_team_epa(25832).total
    assert updated > initial, "EPA should increase after a strong win"


def test_epa_model_rankings():
    """Rankings should be ordered by EPA."""
    model = EPAModel(season=2024, score_mean=120.0, score_sd=35.0)

    # Process a match
    model.update_from_match(
        red_teams=[100, 200],
        blue_teams=[300, 400],
        red_score=200,
        blue_score=50,
    )

    rankings = model.get_rankings("total")
    values = [r[1] for r in rankings]
    assert values == sorted(values, reverse=True)
