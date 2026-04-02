"""Configuration for EPA microservice."""

import os

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://ftcscoutuser:ftcscoutpassword@localhost:5432/ftcscoutdb",
)

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
