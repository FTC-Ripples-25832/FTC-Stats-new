<script lang="ts">
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { fade } from "svelte/transition";
    import { clickOutside, quickFocus } from "../util/directives";
    import { t } from "$lib/i18n";

    export let shown = false;
    export let titleText: string;
    export let closeText: string | null = null;
    export let close: (() => void) | null = null;

    $: resolvedCloseText = closeText ?? $t("common.close", "Close");

    function _close() {
        if (close == null) {
            shown = false;
        } else {
            close();
        }
    }
</script>

<svelte:body on:keydown={(e) => (e.key == "Escape" ? _close() : undefined)} />

{#if shown}
    <div transition:fade={{ duration: 100 }} class="outer-wrapper">
        <div class="content-wrapper" use:clickOutside on:click_outside={_close}>
            <div class="title-wrapper">
                <span>{titleText}</span>
                <button class="x" on:click={_close}> <Fa icon={faXmark} size="1.5x" /> </button>
            </div>
            <div class="scroll-wrapper" tabindex="-1" use:quickFocus>
                <slot />
            </div>
            <button class="close" on:click={_close}> {resolvedCloseText} </button>
        </div>
    </div>
{/if}

<style>
    .outer-wrapper {
        position: fixed;

        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: var(--modal-zi);

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--modal-bg-color);
    }

    .content-wrapper {
        background: var(--fg-color);

        border-radius: var(--card-radius);
        border: var(--border-width) solid var(--sep-color);

        display: flex;
        flex-direction: column;
        height: auto;
        max-height: calc(100% - var(--lg-gap) * 2);
        max-width: 100%;
        position: relative;

        box-shadow: var(--card-shadow);
    }

    .title-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--vl-font-size);
        font-weight: bold;

        padding: var(--lg-gap);
        padding-bottom: 0;
        margin-bottom: var(--lg-gap);
    }

    .x {
        border: none;
        background: none;
        cursor: pointer;
    }

    .scroll-wrapper {
        padding: var(--lg-pad);
        padding-top: 0;

        max-height: 100%;
        overflow-y: auto;
        overflow-x: auto;
    }

    .scroll-wrapper:focus-visible,
    .scroll-wrapper:focus {
        outline: none;
    }

    .close {
        background: var(--form-bg-color);
        color: var(--text-color);
        font-weight: bold;

        border: none;
        border-top: var(--border-width) solid var(--sep-color);
        border-radius: 0 0 var(--card-radius) var(--card-radius);

        padding: var(--lg-pad);

        cursor: pointer;
    }
</style>
