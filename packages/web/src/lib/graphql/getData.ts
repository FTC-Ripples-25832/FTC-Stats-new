import { browser } from "$app/environment";
import { IS_DEV } from "$lib/constants";
import type {
    ApolloClient,
    ApolloQueryResult,
    NormalizedCacheObject,
    OperationVariables,
} from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { writable, type Readable, type Writable, readable } from "svelte/store";

let cache: Record<string, ApolloQueryResult<any>> = {};

export async function getData<Data = any, Variables extends OperationVariables = object>(
    client: ApolloClient<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null = null,
    noCache: boolean = false
): Promise<Readable<ApolloQueryResult<Data> | null>> {
    let keyWithVars = bypassCacheKey + "-" + JSON.stringify(variables);
    if (bypassCacheKey && cache[keyWithVars]) {
        return readable(cache[keyWithVars]);
    }

    let queryResult = client.query({
        query,
        variables,
        // No caching if on server or if bypassing apollo cache
        fetchPolicy: browser && !bypassCacheKey && !noCache ? "cache-first" : "no-cache",
    });

    let result: Writable<ApolloQueryResult<Data> | null> = writable(null);

    queryResult
        .then((r) => {
            result.set(r);
            if (bypassCacheKey) cache[keyWithVars] = r;
        })
        .catch((error) => {
            if (IS_DEV) {
                console.error("GraphQL query failed:", error);
            }
            let fallback = {
                data: null as Data,
                errors: [error],
                loading: false,
                networkStatus: 7,
            } as unknown as ApolloQueryResult<Data>;
            result.set(fallback);
            if (bypassCacheKey) cache[keyWithVars] = fallback;
        });

    if (!browser) {
        // We are doing SSR so we must have the data.
        try {
            await queryResult;
        } catch (error) {
            if (!IS_DEV) {
                throw error;
            }
        }
    } else {
        // wait up to 300ms
        await Promise.race([queryResult, new Promise((r) => setTimeout(r, 300))]);
    }

    return result;
}

export function getDataSync<Data = any, Variables extends OperationVariables = object>(
    client: ApolloClient<NormalizedCacheObject> | null,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null = null
): Readable<ApolloQueryResult<Data> | null> {
    let keyWithVars = bypassCacheKey + "-" + JSON.stringify(variables);
    if (bypassCacheKey && cache[keyWithVars]) {
        return readable(cache[keyWithVars]);
    }

    if (!client) return readable(null);

    let queryResult = client.query({
        query,
        variables,
        // No caching if on server or if bypassing apollo cache
        fetchPolicy: browser && !bypassCacheKey ? "cache-first" : "no-cache",
    });

    let result: Writable<ApolloQueryResult<Data> | null> = writable(null);

    queryResult
        .then((r) => {
            result.set(r);
            if (bypassCacheKey) cache[keyWithVars] = r;
        })
        .catch((error) => {
            if (IS_DEV) {
                console.error("GraphQL query failed:", error);
            }
            let fallback = {
                data: null as Data,
                errors: [error],
                loading: false,
                networkStatus: 7,
            } as unknown as ApolloQueryResult<Data>;
            result.set(fallback);
            if (bypassCacheKey) cache[keyWithVars] = fallback;
        });

    return result;
}
