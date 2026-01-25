<script lang="ts">
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import { t } from "$lib/i18n";
</script>

<ErrorPage>
    {$t("teams.error.try-prefix", "(Try searching for teams on")}{" "}
    <a href="/teams">{$t("teams.error.teams-page", "the teams page")}</a>)
</ErrorPage>
