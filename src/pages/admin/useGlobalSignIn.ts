import { getMePreInstalled } from "../../api/preInstallationApi";
import { OAuth2Result, useDeskproAppClient, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Settings } from "../../types";
import { useCallback, useState } from "react";
import getAccessAndRefreshTokens from "../../api/getAccessAndRefreshTokens";

interface User {
    name: string
    email: string
}
export const useGlobalSignIn = () => {
    const { client } = useDeskproAppClient();
    const [user, setUser] = useState<User | null>(null);
    const [authUrl, setAuthUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { context } = useDeskproLatestAppContext<unknown, Settings>();

    const settings = context?.settings

    useInitialisedDeskproAppClient(async (client) => {
        if (!settings || context?.settings.use_deskpro_saas === undefined) {
            // Make sure settings have loaded.
            return
        }

        const clientId = settings.client_key;
        const mode = settings.use_deskpro_saas ? "global" : "local";

        // Ensure the is a client id if in local mode
        if (mode === "local" && !clientId) {
            // Reset the authURL because there might be an authURL from when
            // the user was in global mode
            setAuthUrl(null)
            return
        }

        const oauth2 =
            mode === "local"
                // Local Version (custom/self-hosted app)
                ? await client.startOauth2Local(
                    ({ state, callbackUrl }) => {
                        return `${settings?.salesforce_instance_url}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}&scope=${"refresh_token api"}`;
                    },
                    /\?code=(?<code>.+?)&/,
                    async (code: string): Promise<OAuth2Result> => {

                        const url = new URL(oauth2.authorizationUrl);
                        const redirectUri = url.searchParams.get("redirect_uri");
                        if (!redirectUri) throw new Error("Failed to get callback URL");

                        const data = await getAccessAndRefreshTokens({ settings, accessCode: code, callbackUrl: redirectUri, client })
                        return { data };
                    }
                )
                // Global Proxy Service
                : await client.startOauth2Global("D48B4D38D21B429891AC05258AB37E1E");

        setAuthUrl(oauth2.authorizationUrl);
        setIsLoading(false);

        try {
            const result = await oauth2.poll()

            // Update the access/refresh tokens
            const stringifiedTokens = JSON.stringify(result.data)
            client.setAdminSetting(stringifiedTokens);

            let currentUser: User | null = null
            try {
                currentUser = await getMePreInstalled(client, settings)
                if (!currentUser) {
                    throw new Error()
                }
            } catch {
                throw new Error("An error occurred while verifying the user")
            }

            setUser(currentUser)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            setIsLoading(false)
        }

    }, [context, settings])

    const signOut = () => {
        client?.setAdminSetting("");
        setUser(null);
    };

    const signIn = useCallback(() => {
        setIsLoading(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);

    // Only enable the sign-in button once we have all necessary settings
    let isDisabled = false

    if (settings && settings.use_deskpro_saas === false && !settings.client_key || !settings?.client_secret || !settings.salesforce_instance_url) {
        isDisabled = true
    }

    const isInstanceUrlInvalid = settings?.salesforce_instance_url
        // eslint-disable-next-line no-useless-escape
        ? !/https:\/\/[a-zA-Z0-9\-]+\.(sandbox|develop\.)?my\.salesforce\.com$/.test(settings.salesforce_instance_url)
        : false

    if (settings?.salesforce_instance_url && isInstanceUrlInvalid) {
        isDisabled = true;
    }

    const cancelLoading = () => setIsLoading(false);

    return {
        user,
        isLoading,
        error,
        authUrl,
        isDisabled,
        isInstanceUrlInvalid,
        cancelLoading,
        signIn,
        signOut,
    };
};
