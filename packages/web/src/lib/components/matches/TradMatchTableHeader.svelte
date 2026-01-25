<script lang="ts">
    import { t } from "$lib/i18n";
</script>

<thead>
    <tr>
        <th class="s">
            <div>{$t("common.match", "Match")}</div>
            <div>{$t("common.score", "Score")}</div>
        </th>
        <th class="r">{$t("matches.red-alliance", "Red Alliance")}</th>
        <th class="b">{$t("matches.blue-alliance", "Blue Alliance")}</th>
    </tr>
</thead>

<style>
    thead {
        display: block;
    }

    tr {
        display: grid;
        grid-template-columns: 10.75em 1fr 1fr;
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 9.75em 1fr 1fr;
        }
    }

    th {
        display: block;
        font-weight: 700;
        text-align: center;
        padding: var(--lg-pad);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: var(--sm-font-size);
    }

    .s {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        justify-content: center;
        padding: 0;
        background: var(--table-header-bg);
        border-right: var(--border-width) solid var(--sep-color);
    }

    .s * {
        padding: var(--lg-pad);
    }

    .r {
        background-color: var(--red-team-bg-color);
        color: var(--text-color);
    }

    .b {
        background-color: var(--blue-team-bg-color);
        color: var(--text-color);
    }
</style>
