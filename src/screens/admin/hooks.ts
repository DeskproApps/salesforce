import { IDeskproClient } from "@deskpro/app-sdk";
import { UseQueryOptions, UseQueryResult } from "react-query/types/react/types";
import { useQueryWithClient, useAppContext } from "../../hooks";
import { Settings } from "../../types";

/**
 * Perform
 *
 * @param queryKey
 * @param queryFn
 * @param options
 */
export function useAdminQuery<TQueryFnData = unknown>(
  queryKey: string | readonly unknown[],
  queryFn: (
    client: IDeskproClient,
    settings: Settings
  ) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<
      TQueryFnData,
      unknown,
      TQueryFnData,
      string | readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TQueryFnData> {
  const { settings } = useAppContext();
  const enabled = !!settings?.global_access_token;

  return useQueryWithClient<TQueryFnData>(
    [...queryKey, enabled],
    (client) => queryFn(client, settings as Settings),
    { ...options, enabled }
  );
}
