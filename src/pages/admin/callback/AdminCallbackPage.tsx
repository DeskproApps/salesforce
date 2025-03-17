import { CopyToClipboardInput, LoadingSpinner, OAuth2Result, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
import { P1 } from "@deskpro/deskpro-ui";
import { useState } from "react";
import type { FC } from "react";

const AdminCallbackPage: FC = () => {
    const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

    useInitialisedDeskproAppClient(async (client) => {
        const oauth2 = await client.startOauth2Local(
            ({ callbackUrl, state }) => `https://test.my.salesforce.com/services/oauth2/authorize?response_type=code&client_id=xx&redirect_uri=${callbackUrl}&state=${state}&scope=${"refresh_token api"}`,
            /code=(?<code>[0-9a-f]+)/,
            async (): Promise<OAuth2Result> => ({ data: { access_token: "", refresh_token: "" } })
        );

        const url = new URL(oauth2.authorizationUrl);
        const redirectUri = url.searchParams.get("redirect_uri");

        if (redirectUri) {
            setCallbackUrl(redirectUri);
        }
    });

    if (!callbackUrl) {
        return (<LoadingSpinner />);
    }

    return (
        <>
            <CopyToClipboardInput value={callbackUrl} />
            <P1>The callback URL will be required during your Salesforce app setup</P1>
        </>
    );
};

export { AdminCallbackPage }