import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { CURRENT_SEASON } from "@ftc-stats/common";

export const load: PageLoad = async () => {
    throw redirect(301, `/records/${CURRENT_SEASON}/teams`);
};
