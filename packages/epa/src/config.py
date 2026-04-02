"""Configuration for EPA microservice."""

import os

_raw_db_url = os.environ.get(
    "DATABASE_URL",
    "postgresql://ftcscoutuser:ftcscoutpassword@localhost:5432/ftcscoutdb",
)
# Normalize postgres:// to postgresql:// (SQLAlchemy requires the latter)
DATABASE_URL = _raw_db_url.replace("postgres://", "postgresql://", 1) if _raw_db_url.startswith("postgres://") else _raw_db_url

EPA_PORT = int(os.environ.get("EPA_PORT", "8001"))
EPA_HOST = os.environ.get("EPA_HOST", "0.0.0.0")

# Supported seasons
SEASONS = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
CURRENT_SEASON = 2025

SEASON_NAMES = {
    2019: "Skystone",
    2020: "Ultimate Goal",
    2021: "Freight Frenzy",
    2022: "Power Play",
    2023: "CenterStage",
    2024: "Into The Deep",
    2025: "Decode",
}
