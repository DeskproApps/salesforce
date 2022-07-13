import {
    Button,
    H2,
    P1,
    Spinner,
    Stack,
    useDeskproAppClient,
    useDeskproAppTheme
} from "@deskpro/app-sdk";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { AnchorButton } from "@deskpro/deskpro-ui";
import { useGlobalSignIn } from "./useGlobalSignIn";
import { useEffect } from "react";
import "./style.css";

export const GlobalSignIn = () => {
    const { client } = useDeskproAppClient();
    const { theme } = useDeskproAppTheme();

    useEffect(() => {
        client?.resize();
    });

    const {
        callbackUrl,
        user,
        oAuthUrl,
        isLoading,
        isDisabled,
        isBlocking,
        isInstanceUrlInvalid,
        cancelLoading,
        signIn,
        signOut,
    } = useGlobalSignIn();

    if (isBlocking) {
        return (
            <Stack align="center" vertical>
                <Spinner />
            </Stack>
        );
    }

    return (
        <>
            {isInstanceUrlInvalid && (
                <div style={{ color: theme.colors.red100, fontSize: "12px", marginBottom: "16px", marginTop: "-4px" }}>
                    Salesforce instance URL is invalid, please make sure that it's in the following format:
                    https://MyDomainName.my.salesforce.com
                </div>
            )}

            {callbackUrl && (
                <>
                    <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
                    <Stack
                        className="global-sign-in container-callback"
                        style={{ borderColor: theme.colors.brandShade40, color: theme.colors.grey100 }}
                        justify="space-between"
                        align="center"
                    >
                        <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: "15px" }}>
                            {callbackUrl}
                        </div>
                        <CopyToClipboard text={callbackUrl}>
                            <Button text="Copy" icon={faCopy} intent="secondary" style={{ width: "72px" }} />
                        </CopyToClipboard>
                    </Stack>
                    <P1 style={{ marginBottom: "16px", marginTop: "8px", color: theme.colors.grey80 }}>
                        The callback URL will be required during Salesforce app setup
                    </P1>
                </>
            )}

            <H2 style={{ marginBottom: "5px" }}>Global Salesforce User*</H2>
            <div className="global-sign-in container" style={{ borderColor: theme.colors.brandShade40 }}>
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
                        <AnchorButton
                            href={oAuthUrl ? oAuthUrl.toString() : ""}
                            target="_blank"
                            text="Sign-In"
                            icon={faSignIn}
                            intent="secondary"
                            size="small"
                            disabled={isDisabled || !oAuthUrl}
                            loading={isLoading}
                            onClick={signIn}
                        />
                        {isLoading && (
                            <Button onClick={() => cancelLoading()} text="Cancel" intent="secondary" style={{ marginLeft: "6px" }} />
                        )}
                    </>
                )}
            </div>
        </>
    );
};
