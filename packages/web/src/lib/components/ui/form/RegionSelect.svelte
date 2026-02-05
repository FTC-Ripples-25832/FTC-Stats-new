<script lang="ts">
    import type { RegionOption } from "@ftc-stats/common";
    import { getContext } from "svelte";
    import { FORM_ID } from "./Form.svelte";
    import { REGION_GROUPS, regionName } from "../../../util/regions";
    import { t } from "$lib/i18n";

    export let region: RegionOption;
    export let name: string | null = null;
    export let id: string | null = null;
    export let style = "";

    let form = getContext(FORM_ID) as string | null;

    $: groupLabels = [
        $t("regions.groups.general", "General"),
        $t("regions.groups.us", "United States"),
        $t("regions.groups.ca", "Canada"),
        $t("regions.groups.intl", "International"),
        $t("regions.groups.special", "Special"),
    ];
</script>

<select bind:value={region} {form} {name} {id} on:change {style} class="select-input">
    {#each REGION_GROUPS as group, i}
        <optgroup label={groupLabels[i] ?? ""}>
            {#each group as r}
                <option selected={region == r} value={r}>{regionName(r)}</option>
            {/each}
        </optgroup>
    {/each}
</select>
