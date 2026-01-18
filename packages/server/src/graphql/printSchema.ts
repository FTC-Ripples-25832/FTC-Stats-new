import fs from "node:fs";
import path from "node:path";
import { printSchema } from "graphql";
import { GQL_SCHEMA } from "./schema";

function main() {
    const outPath = process.argv[2];
    const sdl = printSchema(GQL_SCHEMA);

    if (!outPath) {
        process.stdout.write(sdl);
        return;
    }

    const resolved = path.resolve(process.cwd(), outPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, sdl, "utf8");
    console.info(`Wrote schema to ${resolved}`);
}

main();
