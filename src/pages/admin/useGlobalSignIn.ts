import { getMePreInstalled } from "../../api/preInstallationApi";
import { IOAuth2, OAuth2Result, useDeskproAppClient, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
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
    const [isPolling, setIsPolling] = useState(false)
    const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)
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

        const oAuth2Response =
            mode === "local"
                // Local Version (custom/self-hosted app)
                ? await client.startOauth2Local(
                    ({ state, callbackUrl }) => {
                        return `${settings?.salesforce_instance_url}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}&scope=${"refresh_token api"}`;
                    },
                    /\?code=(?<code>.+?)&/,
                    async (code: string): Promise<OAuth2Result> => {
                        const url = new URL(oAuth2Response.authorizationUrl);
                        const redirectUri = url.searchParams.get("redirect_uri");
                        if (!redirectUri) throw new Error("Failed to get callback URL");

                        const data = await getAccessAndRefreshTokens({ settings, accessCode: code, callbackUrl: redirectUri, client })
                        return { data };
                    }
                )
                // Global Proxy Service
                : await client.startOauth2Global("3MVG9k02hQhyUgQBDJFGjHpunit6Qn7nRoDm5DY06FG..mnbGEq316N2sOU4I4qZVculsUMYaTad8cY7.0gfV");

        setAuthUrl(oAuth2Response.authorizationUrl);
        setOAuth2Context(oAuth2Response);
    }, [context, settings])

    useInitialisedDeskproAppClient((client) => {
        if (!oauth2Context || !settings) {
            return
        }

        const startPolling = async () => {

            try {
                const result = await oauth2Context.poll()

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
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            void startPolling()
        }
    }, [isPolling, oauth2Context, settings])

    const signOut = () => {
        client?.setAdminSetting("");
        setUser(null);
    };

    const signIn = useCallback(() => {
        setIsLoading(true)
        setIsPolling(true)
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

    const cancelLoading = () => {
        setIsLoading(false)
        setIsPolling(false)
    };

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
