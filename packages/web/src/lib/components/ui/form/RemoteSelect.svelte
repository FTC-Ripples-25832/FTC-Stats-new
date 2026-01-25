<script lang="ts">
    import { RemoteOption } from "@ftc-stats/common";
    import Select from "./Select.svelte";
    import { t } from "$lib/i18n";

    export let remote: RemoteOption;
    export let nonForm = false;
    export let id: string | null = null;
</script>

<Select
    bind:value={remote}
    name={"remote"}
    options={[
        { value: RemoteOption.All, name: $t("common.all", "All") },
        { value: RemoteOption.Trad, name: $t("events.traditional-only", "Traditional Only") },
        { value: RemoteOption.Remote, name: $t("events.remote-only", "Remote Only") },
    ]}
    {nonForm}
    {id}
    on:change
/>
