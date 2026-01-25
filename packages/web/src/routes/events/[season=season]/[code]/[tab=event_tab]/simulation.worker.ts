import { simulateEvent, type EventSimulationConfig, type SimulationResult } from "@ftc-stats/common";

type SimulationMessage =
    | { type: "run"; config: EventSimulationConfig }
    | { type: "result"; results: SimulationResult[] }
    | { type: "error"; message: string };

const ctx: Worker = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent<SimulationMessage>) => {
    if (event.data.type !== "run") return;

    try {
        const results = simulateEvent(event.data.config);
        ctx.postMessage({ type: "result", results } satisfies SimulationMessage);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ctx.postMessage({ type: "error", message } satisfies SimulationMessage);
    }
};
