<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
    import { EMAIL } from "$lib/constants";
    import { t } from "$lib/i18n";
</script>

<Head title="Sponsor Info | FTCStats" description="Become a sponsor of FTCStats" />

<WidthProvider width={"1000px"}>
    <Card>
        <h1 class="head">{$t("sponsors.info.title", "Sponsor Info")}</h1>

        <div class="rest">
            <p>
                {$t(
                    "sponsors.info.intro",
                    "If you're interested in sponsoring us, there's some information you should know:"
                )}
            </p>

            <h2>{$t("sponsors.info.receive", "What you recieve:")}</h2>
            <p>
                {$t(
                    "sponsors.info.receive.p1",
                    "As a sponsor, your logo will be placed in the sidebar, and be visible on all pages where the sidebar is present. This includes the team pages, event pages, and the home page. Your logo will be clickable, and will link to your website."
                )}
            </p>
            <div class="image-wrap">
                <img
                    class="statsimg"
                    src="/img/examplesidebar.png"
                    alt="A screenshot of FTCStats's Teams Records page, with a green example logo in the sidebar"
                />
            </div>
            <h2>{$t("sponsors.info.expenses", "Our expenses:")}</h2>
            <p>
                {$t(
                    "sponsors.info.expenses.p1",
                    "Here is a breakdown of what the sponsorship money will be used for, as an estimate: (USD)"
                )}
            </p>
            <table>
                <thead>
                    <tr>
                        <th>{$t("sponsors.info.expenses.expense", "Expense")}</th>
                        <th>{$t("sponsors.info.expenses.cost", "Cost")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{$t("sponsors.info.expenses.standard", "Standard Hosting (Hetzner CPX11)")}</td>
                        <td>$5.59/month @ 11 months/year</td>
                    </tr>
                    <tr>
                        <td>{$t("sponsors.info.expenses.upgraded", "World Championships Upgraded Hosting (Hetzner CPX31)")}</td>
                        <td>$18.59/month @ 1 month/year</td>
                    </tr>
                    <tr>
                        <td>{$t("sponsors.info.expenses.domain", "Domain (Google Domains)")}</td>
                        <td>$12/year</td>
                    </tr>
                    <tr>
                        <td><b>{$t("common.total", "Total")}</b></td>
                        <td><b>$92.08/year</b></td>
                    </tr>
                </tbody>
            </table>

            <h2>{$t("sponsors.info.commitment", "Your commitment")}</h2>
            <p>
                {$t(
                    "sponsors.info.commitment.p1",
                    "The cost to sponsor us for 1 year is $150. This will cover our hosting and domain costs for the year, as well as other miscellaneous costs, like taxes, price fluctuations, and server upgrades if necessary. All money will be used to maintain FTCStats."
                )}
            </p>

            <h2>{$t("sponsors.info.need", "Information we need:")}</h2>
            <p>
                {@html $t(
                    "sponsors.info.need.p1",
                    `If you're interested in sponsoring us, please <a href=\\\"mailto:${EMAIL}\\\">email us</a> with the following information:`
                )}
            </p>
            <ul>
                <li>{$t("sponsors.info.need.item1", "Your company name")}</li>
                <li>{$t("sponsors.info.need.item2", "Link to your company website")}</li>
                <li>{$t("sponsors.info.need.item3", "Logo to place on the sidebar (high-resolution PNG or SVG image)")}</li>
            </ul>

            <p>{$t("sponsors.info.thanks", "Thank you so much for your consideration.")}</p>
        </div>
    </Card>
</WidthProvider>

<style>
    .head {
        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
    }

    .rest {
        padding: var(--sm-pad);
    }

    h1 {
        font-size: var(--vl-font-size);
    }

    h2 {
        font-size: var(--lg-font-size);
        margin: var(--lg-gap) 0 var(--sm-gap) 0;
    }

    p {
        line-height: 1.75;
        margin: var(--md-gap) 0;
    }

    ul {
        margin: var(--md-gap) 0;
        padding-left: var(--lg-pad);
    }

    .image-wrap {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .statsimg {
        width: 60%;
    }

    img {
        border-radius: 8px;
    }

    table {
        width: 75%;
        border-collapse: collapse;
        margin: 0 auto;
    }
    th,
    td {
        padding: var(--sm-pad);
        text-align: left;
        border: 1px solid var(--sep-color);
    }
</style>
