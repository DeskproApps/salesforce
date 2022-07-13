import { useQuery } from "react-query";
import { UseQueryOptions, UseQueryResult } from "react-query/types/react/types";
import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";

/**
 * Decorate react useQuery hook such that we can inject the Deskpro apps client into query functions and make sure that
 * the query is disabled (and has a different key) if the Deskpro client is uninitialized
 */
export function useQueryWithClient<TQueryFnData = unknown>(
    queryKey: string | readonly unknown[],
    queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
    options?: Omit<UseQueryOptions<TQueryFnData, unknown, TQueryFnData, string | readonly unknown[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TQueryFnData> {
    const { client } = useDeskproAppClient();

    const key = Array.isArray(queryKey) ? queryKey : [queryKey];

    const result = useQuery(
        [...key, !!client],
        () => (client && queryFn(client)) as Promise<TQueryFnData>,
        {
            ...(options ?? {}),
            enabled: options?.enabled === undefined ? !! client : (client && options?.enabled),
        } as Omit<UseQueryOptions<TQueryFnData, unknown, TQueryFnData, string | readonly unknown[]>, 'queryKey' | 'queryFn'>
    );

    return result;
}
