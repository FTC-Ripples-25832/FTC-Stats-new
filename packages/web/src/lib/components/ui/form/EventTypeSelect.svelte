<script lang="ts">
    import type { EventTypeOption } from "@ftc-stats/common";
    import { getContext } from "svelte";
    import { FORM_ID } from "./Form.svelte";
    import { COMP_EVENT_TY_GROUPS, EVENT_TY_GROUPS, eventTyNames } from "../../../util/event-type";
    import { t } from "$lib/i18n";

    export let eventType: EventTypeOption;
    export let name: string | null = null;
    export let id: string | null = null;
    export let competitionOnly = false;
    export let style = "";

    let form = getContext(FORM_ID) as string | null;

    $: all = competitionOnly ? COMP_EVENT_TY_GROUPS : EVENT_TY_GROUPS;
    $: groupLabels = competitionOnly
        ? [
              $t("events.type.groups.summary", "Summary"),
              $t("events.type.groups.competition", "Competition"),
          ]
        : [
              $t("events.type.groups.summary", "Summary"),
              $t("events.type.groups.competition", "Competition"),
              $t("events.type.groups.non-competition", "Non-Competition"),
          ];
</script>

<select bind:value={eventType} {form} {name} {id} on:change {style} class="select-input">
    {#each all as group, i}
        <optgroup label={groupLabels[i] ?? ""}>
            {#each group as e}
                <option selected={eventType == e} value={e}
                    >{eventTyNames(e, competitionOnly)}</option
                >
            {/each}
        </optgroup>
    {/each}
</select>
