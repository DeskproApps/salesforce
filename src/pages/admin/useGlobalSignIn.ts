import {
    adminGenericProxyFetch,
    useDeskproAppClient,
    useDeskproAppEvents,
    useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import { useEffect, useMemo, useState } from "react";
import { Settings } from "../../types";
import { v4 as uuidv4 } from "uuid";
import {every, isEmpty} from "lodash";
import { AuthTokens } from "../../api/types";
import { getMePreInstalled } from "../../api/api";

export const useGlobalSignIn = () => {
    const { client } = useDeskproAppClient();
    const [ settings, setSettings ] = useState<Settings|null>(null);
    const [ callbackUrl, setCallbackUrl ] = useState<string|null>(null);
    const [ poll, setPoll ] = useState<(() => Promise<{ token: string }>)|null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isBlocking, setIsBlocking ] = useState<boolean>(true);
    const [ accessCode, setAccessCode ] = useState<string|null>(null);
    const [ user, setUser ] = useState<{ name: string; email: string; }|null>(null);

    const key = useMemo(() => uuidv4(), []);

    useDeskproAppEvents({
        onAdminSettingsChange: setSettings,
    }, []);

    // Initialise OAuth flow
    useInitialisedDeskproAppClient((client) => {
        (async () => {
            const { callbackUrl, poll } = await client.oauth2().getAdminGenericCallbackUrl(
                key,
                /\?code=(?<token>.+?)&/,
                /&state=(?<key>.+)/
            );

            setCallbackUrl(callbackUrl);
            setPoll(() => poll);
        })();
    }, [key]);

    // Build auth flow entrypoint URL
    const oAuthUrl = useMemo(() => {
        if (!every([settings?.salesforce_instance_url, settings?.client_key])) {
            return null;
        }

        const url = new URL(`${settings?.salesforce_instance_url}/services/oauth2/authorize`);

        url.search = new URLSearchParams({
            response_type: "code",
            client_id: settings?.client_key as string,
            redirect_uri: callbackUrl as string,
            state: key,
            scope: "refresh_token api",
        }).toString();

        return url;
    }, [
        settings?.salesforce_instance_url,
        settings?.client_key,
        callbackUrl,
        key
    ]);

    // Exchange auth code for auth/refresh tokens
    useInitialisedDeskproAppClient((client) => {
        const canRequestAccessToken = every([
            accessCode,
            callbackUrl,
            settings?.salesforce_instance_url,
            settings?.client_key,
            settings?.client_secret,
        ]);

        if (!canRequestAccessToken) {
            return;
        }

        const url = new URL(`${settings?.salesforce_instance_url}/services/oauth2/token`);

        const requestOptions: RequestInit = {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: accessCode as string,
                client_id: settings?.client_key as string,
                client_secret: settings?.client_secret as string,
                redirect_uri: callbackUrl as string,
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        (async () => {
            const fetch = await adminGenericProxyFetch(client);
            const response = await fetch(url.toString(), requestOptions);
            const data = await response.json();

            const tokens: AuthTokens = {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            };

            client.setAdminSetting(JSON.stringify(tokens));

            setIsLoading(false);
        })();
    }, [
        accessCode,
        callbackUrl,
        settings?.salesforce_instance_url,
        settings?.client_key,
        settings?.client_secret,
    ]);

    // Get current Salesforce user
    useInitialisedDeskproAppClient((client) => {
        (async () => {
            if (!isEmpty(settings?.global_access_token)) {
                setUser(await getMePreInstalled(client, JSON.parse(settings?.global_access_token as string)));
            }
        })();
    }, [settings?.global_access_token]);


    // Set blocking flag
    useEffect(() => {
        if (!(callbackUrl && client && poll)) {
            setIsBlocking(true);
        } else if (settings?.global_access_token && !user) {
            setIsBlocking(true);
        } else {
            setIsBlocking(false);
        }
    }, [
        callbackUrl,
        client,
        poll,
        user,
        settings?.global_access_token
    ]);

    const signOut = () => {
        client?.setAdminSetting("");
        setUser(null);
        setAccessCode(null);
    };

    const signIn = () => {
        poll && (async () => {
            setIsLoading(true);
            setAccessCode((await poll()).token)
        })();
    };

    // Only enable the sign-in button once we have all necessary settings
    const isDisabled = ! every([
        settings?.client_key,
        settings?.client_secret,
        settings?.salesforce_instance_url,
    ]);

    return {
        callbackUrl,
        user,
        oAuthUrl,
        isLoading,
        isBlocking,
        isDisabled,
        signIn,
        signOut,
    };
};