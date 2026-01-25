<script lang="ts">
    import type { NonRankStatColumn, StatData } from "@ftc-stats/common";
    import { exportCSV } from "./csv";
    import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
    import Button from "../ui/Button.svelte";
    import { t } from "$lib/i18n";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let shownStats: NonRankStatColumn<T>[];
    export let csv: { filename: string; title: string };
</script>

<Button
    icon={faFileDownload}
    disabled={shownStats.length == 0
        ? $t("stats.export.missing-stats", "Select statistics to export csv.")
        : data.length == 0
        ? $t("stats.export.missing-data", "Select data to export csv.")
        : null}
    on:click={() => exportCSV(data, shownStats, csv.filename, csv.title)}
>
    {$t("stats.export", "Export CSV")}
</Button>
