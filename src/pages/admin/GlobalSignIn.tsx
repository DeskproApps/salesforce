import "./style.css";
import { AnchorButton, Button, H2, P1 } from "@deskpro/deskpro-ui";
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { useGlobalSignIn } from "./useGlobalSignIn";

export const GlobalSignIn = () => {
    const { theme } = useDeskproAppTheme();
    const {
        user,
        authUrl,
        isLoading,
        isDisabled,
        isInstanceUrlInvalid,
        cancelLoading,
        signIn,
        signOut,
    } = useGlobalSignIn();

    return (
        <>
            {isInstanceUrlInvalid && (
                <div style={{ color: theme.colors.red100, fontSize: "12px", marginBottom: "16px", marginTop: "-4px" }}>
                    Salesforce instance URL is invalid, please make sure that it's in the following format:
                    https://MyDomainName.my.salesforce.com
                </div>
            )}

            <H2 style={{ marginBottom: "5px" }}>Global Salesforce User*</H2>
            <div className="global-sign-in container" style={{ borderColor: theme.colors.brandShade40, marginBottom: "5px" }}>
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
                            href={authUrl ?? "#"}
                            target="_blank"
                            text="Sign-In"
                            icon={faSignIn}
                            intent="secondary"
                            size="small"
                            disabled={isDisabled || isLoading}
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
