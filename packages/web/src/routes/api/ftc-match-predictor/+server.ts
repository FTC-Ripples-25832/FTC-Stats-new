import { json } from "@sveltejs/kit";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, "../../../../../../..");
const predictorRoot = path.join(repoRoot, "ftc-match-predictor");
const scriptPath = path.join(predictorRoot, "predict_api.py");
const pythonBin = process.env.FTC_PREDICTOR_PYTHON ?? "python3";

type PredictorResponse =
    | {
          ok: true;
          input: {
              red1: number;
              red2: number;
              blue1: number;
              blue2: number;
              seasonProgress: number;
              penaltyBonus: number;
          };
          stats: Record<
              "red1" | "red2" | "blue1" | "blue2",
              { team: number; oprAuto: number; oprTeleop: number; oprTotal: number }
          >;
          prediction: {
              red: { auto: number; teleop: number; total: number };
              blue: { auto: number; teleop: number; total: number };
              winner: "RED" | "BLUE" | "TIE";
              margin: number;
          };
      }
    | {
          ok: false;
          error: string;
          message?: string;
          missingTeams?: number[];
          missingFiles?: string[];
      };

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.min(max, Math.max(min, num));
}

function normalizeTeamNumber(value: unknown): number | null {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return null;
    return Math.trunc(num);
}

function runPredictor(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        execFile(pythonBin, [scriptPath, ...args], { cwd: predictorRoot }, (error, stdout, stderr) => {
            if (error) {
                const detail = stderr?.toString().trim() || error.message;
                reject(new Error(detail));
                return;
            }
            resolve(stdout.toString());
        });
    });
}

export async function POST({ request }) {
    if (!existsSync(scriptPath)) {
        return json(
            { ok: false, error: "predictor_script_missing", missingFiles: [scriptPath] },
            { status: 500 }
        );
    }

    let payload: Record<string, unknown>;
    try {
        payload = (await request.json()) as Record<string, unknown>;
    } catch {
        return json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const red1 = normalizeTeamNumber(payload.red1);
    const red2 = normalizeTeamNumber(payload.red2);
    const blue1 = normalizeTeamNumber(payload.blue1);
    const blue2 = normalizeTeamNumber(payload.blue2);

    if (!red1 || !red2 || !blue1 || !blue2) {
        return json({ ok: false, error: "invalid_team_numbers" }, { status: 400 });
    }

    const seasonProgress = clampNumber(payload.seasonProgress, 0.1, 1.0, 1.0);
    const penaltyBonus = clampNumber(payload.penaltyBonus, 0, 50, 15);

    const args = [
        "--red1",
        red1.toString(),
        "--red2",
        red2.toString(),
        "--blue1",
        blue1.toString(),
        "--blue2",
        blue2.toString(),
        "--season-progress",
        seasonProgress.toString(),
        "--penalty-bonus",
        penaltyBonus.toString(),
    ];

    try {
        const raw = await runPredictor(args);
        let data: PredictorResponse;
        try {
            data = JSON.parse(raw) as PredictorResponse;
        } catch (error) {
            return json(
                { ok: false, error: "invalid_predictor_response", message: String(error) },
                { status: 500 }
            );
        }

        return json(data, { status: data.ok ? 200 : 400 });
    } catch (error) {
        return json(
            { ok: false, error: "predictor_failed", message: String(error) },
            { status: 500 }
        );
    }
}
