import { useQuery } from "react-query";
import { UseQueryOptions, UseQueryResult } from "react-query/types/react/types";
import {IDeskproClient, useDeskproAppClient, useInitialisedDeskproAppClient} from "@deskpro/app-sdk";
import {useLocation} from "react-router-dom";
import {useMemo} from "react";

/**
 * Decorate react useQuery hook such that we can inject the Deskpro apps client into query functions and make sure that
 * the query is disabled (and has a different key) if the Deskpro client is uninitialized
 */
export function useQueryWithClient<TQueryFnData = unknown>(
    queryKey: string | readonly unknown[],
    queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
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
    const { client } = useDeskproAppClient();
  
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  
    return useQuery(
      key,
      () => (client && queryFn(client)) as Promise<TQueryFnData>,
      {
        ...(options ?? {}),
        enabled: options?.enabled ? !!client : !!client && options?.enabled,
        suspense: false,
      } as Omit<
        UseQueryOptions<
          TQueryFnData,
          unknown,
          TQueryFnData,
          string | readonly unknown[]
        >,
        "queryKey" | "queryFn"
      >
    );
  }

/**
 * Get the base path from the current location pathname
 */
export const useBasePath = () => {
    const { pathname } = useLocation();

    return useMemo(
        () => `/${pathname.split("/").filter((f) => f)[0]}`,
        [pathname]
    );
};

/**
 * Register a home button pointing to the base path
 */
export const useRegisterHomeButton = () => {
    const basePath = useBasePath();

    useInitialisedDeskproAppClient((client) => {
        client.registerElement("home", {
            type: "home_button",
            payload: { basePath },
        });
    }, [basePath]);
};
