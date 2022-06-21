import { Button, P1, useDeskproAppEvents, useDeskproAppTheme, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { AnchorButton } from "@deskpro/deskpro-ui";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { CSSProperties, useState } from "react";
import { Settings } from "../types";

export const GlobalSignIn = () => {
    const { theme } = useDeskproAppTheme();
    const [ settings, setSettings ] = useState<Settings|null>(null);

    const container: CSSProperties = {
        margin: "3px 0 0 0",
        padding: "8px 10px 10px",
        border: `1px solid ${theme.colors.brandShade40}`,
        borderRadius: "4px",
        color: theme.colors.grey80,
    };

    useDeskproAppEvents({
        onAdminSettingsChange: setSettings,
    }, []);

    useInitialisedDeskproAppClient((client) => {
        client.resize();
        // client.setAdminSetting("foobar_test");
        // client.setAdminSettingInvalid("it doesnt work");
    }, []);

    const isDisabled = !(settings?.client_id && settings?.client_secret && settings?.salesforce_instance_url);

    const oAuthUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${settings?.client_id}&redirect_uri=https://www.customercontactinfo.com/user_callback.jspk&state=mystate`;

    return (
        <div style={container}>
            <P1 style={{ marginBottom: "6px" }}>This Salesforce user account will be used by all Deskpro agents</P1>
            <AnchorButton href={oAuthUrl} target="_blank" text="Sign-In" icon={faSignIn} intent="secondary" size="small" disabled={isDisabled} />
        </div>
    );
};
