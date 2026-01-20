export function match(param: string): boolean {
    return (
        param == "matches" ||
        param == "rankings" ||
        param == "insights" ||
        param == "figures" ||
        param == "awards" ||
        param == "teams" ||
        param == "simulation"
    );
}
