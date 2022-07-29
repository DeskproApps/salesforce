import {Context, IDeskproClient, useDeskproLatestAppContext} from "@deskpro/app-sdk";
import {UseQueryOptions, UseQueryResult} from "react-query/types/react/types";
import {useQueryWithClient} from "../../hooks";

/**
 * Perform
 *
 * @param queryKey
 * @param queryFn
 * @param options
 */
export function useAdminQuery<TQueryFnData = unknown>(
    queryKey: string | readonly unknown[],
    queryFn: (client: IDeskproClient, context: Context) => Promise<TQueryFnData>,
    options?: Omit<UseQueryOptions<TQueryFnData, unknown, TQueryFnData, string | readonly unknown[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TQueryFnData> {
    const { context } = useDeskproLatestAppContext();

    const enabled = !! context?.settings?.global_access_token;

    return useQueryWithClient<TQueryFnData>(
        queryKey,
        (client) => queryFn(client, context as Context),
        { ...options, enabled }
    );
}
