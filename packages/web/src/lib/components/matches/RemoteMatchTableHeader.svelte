<script lang="ts">
    import { t } from "$lib/i18n";
</script>

<thead>
    <tr>
        <th class="team">{$t("common.team", "Team")}</th>
        <th>Q-1</th>
        <th>Q-2</th>
        <th>Q-3</th>
        <th>Q-4</th>
        <th>Q-5</th>
        <th>Q-6</th>
        <th class="total">{$t("common.total", "Total")}</th>
    </tr>
</thead>

<style>
    thead {
        display: block;
        width: 100%;
    }

    tr {
        display: grid;
        grid-template-columns: 17em repeat(7, minmax(0, 1fr));

        background-color: var(--table-header-bg);

        width: 100%;
        max-width: 100%;
        min-width: 100%;
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 5em repeat(7, minmax(0, 1fr));
        }
    }

    tr :nth-child(2) {
        border-left: var(--border-width) solid var(--sep-color);
    }

    .total {
        border-left: var(--border-width) solid var(--sep-color);
    }

    th {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: var(--lg-pad);

        color: var(--text-color);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: var(--sm-font-size);
    }
</style>
