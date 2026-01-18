import { getHttpOrigin } from "$lib/apiOrigin";

export const GET = async () => {
    const endpoint = `${getHttpOrigin()}/sitemap.xml`;
    const res = await fetch(endpoint);
    const xml = await res.text();

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
