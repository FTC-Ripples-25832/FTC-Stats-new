export function match(param: string): boolean {
    return (
        param == "matches" ||
        param == "forecast" ||
        param == "rankings" ||
        param == "insights" ||
        param == "figures" ||
        param == "sos" ||
        param == "awards" ||
        param == "teams" ||
        param == "simulation"
    );
}
