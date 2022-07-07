import {
    P1,
    H2,
    useDeskproAppClient,
    useDeskproAppEvents,
    useDeskproAppTheme,
    useInitialisedDeskproAppClient,
    Spinner, Stack, Button, adminGenericProxyFetch
} from "@deskpro/app-sdk";
import { AnchorButton } from "@deskpro/deskpro-ui";
import { faSignIn, faCopy, faSignOut } from "@fortawesome/free-solid-svg-icons";
import {CSSProperties, useMemo, useState} from "react";
import { Settings } from "../types";
import { v4 as uuidv4 } from "uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const GlobalSignIn = () => {
    const { theme } = useDeskproAppTheme();
    const { client } = useDeskproAppClient();

    const [ settings, setSettings ] = useState<Settings|null>(null);
    const [ callbackUrl, setCallbackUrl ] = useState<string|null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ poll, setPoll ] = useState<(() => Promise<{ token: string }>)|null>(null);
    const [ accessCode, setAccessCode ] = useState<string|null>(null);
    const [ user, setUser ] = useState<{ name: string; email: string; }|null>(null);

    const key = useMemo(() => uuidv4(), []);

    const container: CSSProperties = {
        margin: "3px 0 16px 0",
        padding: "8px 10px 10px",
        border: `1px solid ${theme.colors.brandShade40}`,
        borderRadius: "4px",
        color: theme.colors.grey80,
    };

    const callbackContainer: CSSProperties = {
        margin: "3px 0 0 0",
        padding: "5px 5px 6px 10px",
        border: `1px solid ${theme.colors.brandShade40}`,
        borderRadius: "4px",
        color: theme.colors.grey100,
        fontSize: "12px",
        fontFamily: "Noto Sans"
    };

    useDeskproAppEvents({
        onAdminSettingsChange: setSettings,
    }, []);

    useInitialisedDeskproAppClient((client) => {
        client.oauth2()
            .getAdminGenericCallbackUrl(
                key,
                /\?code=(?<token>.+?)&/,
                /&state=(?<key>.+)/
            )
            .then(({ callbackUrl, poll }) => {
                setCallbackUrl(callbackUrl);
                setPoll(() => poll);
                client.resize();
            })
        ;
    }, [key]);

    useInitialisedDeskproAppClient((client) => {
        if (!(accessCode && settings?.salesforce_instance_url && settings?.client_key && settings?.client_secret && callbackUrl)) {
            return;
        }

        const url = new URL(`${settings?.salesforce_instance_url}/services/oauth2/token`);

        const opts = {
            method: "POST",
            body: `grant_type=authorization_code&code=${accessCode}&client_id=${settings.client_key}&client_secret=${settings.client_secret}&redirect_uri=${callbackUrl}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        adminGenericProxyFetch(client)
            .then((fn) => fn(url.toString(), opts))
            .then((res) => res.json())
            .then((data) => client.setAdminSetting(JSON.stringify({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            })))
        ;
    }, [
        accessCode,
        callbackUrl,
        settings?.salesforce_instance_url,
        settings?.client_key,
        settings?.client_secret,
    ]);

    const oAuthUrl = useMemo(() => {
        if (!(settings?.salesforce_instance_url && settings?.client_key)) {
            return null;
        }

        const url = new URL(`${settings.salesforce_instance_url}/services/oauth2/authorize`);

        url.search = new URLSearchParams({
            response_type: "code",
            client_id: settings.client_key as string,
            redirect_uri: callbackUrl as string,
            state: key,
            scope: "refresh_token api",
        }).toString();

        return url;
    }, [settings?.salesforce_instance_url, settings?.client_key, callbackUrl, key]);

    useInitialisedDeskproAppClient((client) => {
        if (!(settings?.global_access_token && settings?.salesforce_instance_url)) {
            return;
        }

        const tokens = JSON.parse(settings.global_access_token);

        const req = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${tokens.access_token}`,
            },
        };

        // todo: we need a generic way of dealing with expired access token and using refresh token to get a new access token

        adminGenericProxyFetch(client)
            .then((fn) => fn(`${settings.salesforce_instance_url}/services/data/v24.0/chatter/users/me`, req))
            .then((res) => res.json())
            .then(setUser)
            .then(() => client.resize())
            .finally(() => setIsLoading(false))
        ;

    }, [
        settings?.global_access_token,
        settings?.salesforce_instance_url,
        isLoading,
    ]);

    const signIn = () => {
        if (poll) {
            setIsLoading(true);
            poll().then((res) => res?.token && setAccessCode(res.token));
        }
    };

    const signOut = () => {
        client?.setAdminSetting("");
        setUser(null);
        setAccessCode(null);
    };

    const isDisabled = !(settings?.client_key && settings?.client_secret && settings?.salesforce_instance_url);

    if (!(callbackUrl && client && poll)) {
        return (
            <Stack align="center" vertical>
                <Spinner />
            </Stack>
        );
    }

    if (settings?.global_access_token && !user) {
        return (
            <Stack align="center" vertical>
                <Spinner />
            </Stack>
        );
    }

    return (
        <>
            <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
            <Stack style={callbackContainer} justify="space-between" align="center">
                <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: "15px" }}>
                    {callbackUrl}
                </div>
                <CopyToClipboard text={callbackUrl}>
                    <Button text="Copy" icon={faCopy} intent="secondary" style={{ width: "70px" }} />
                </CopyToClipboard>
            </Stack>
            <P1 style={{ marginBottom: "16px", marginTop: "8px", color: theme.colors.grey80 }}>
                The callback URL will be required during Salesforce app setup
            </P1>

            <H2 style={{ marginBottom: "5px" }}>Global Salesforce User*</H2>
            <div style={container}>
                {user ? (
                    <>
                        <P1 style={{ marginBottom: "6px" }}>
                            Signed-in as <span style={{ color: theme.colors.grey100 }}>{user.name} {`<${user.email}>`}</span>
                        </P1>
                        <Button text="Sign-out" intent="secondary" icon={faSignOut} onClick={signOut} />
                    </>
                ) : (
                    <>
                        <P1 style={{ marginBottom: "6px" }}>
                            This Salesforce user account will be used by all Deskpro agents
                        </P1>
                        {<AnchorButton
                            href={oAuthUrl ? oAuthUrl.toString() : ""}
                            target="_blank"
                            text="Sign-In"
                            icon={faSignIn}
                            intent="secondary"
                            size="small"
                            disabled={isDisabled || !oAuthUrl}
                            loading={isLoading}
                            onClick={signIn}
                        />}
                    </>
                )}
            </div>
        </>
    );
};
