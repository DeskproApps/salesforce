import { adminGenericProxyFetch, IDeskproClient, OAuth2Result } from "@deskpro/app-sdk";
import { Settings } from "../types";

interface GetAccessAndRefreshTokensParams {
  settings: Settings,
  accessCode: string,
  callbackUrl: string,
  client: IDeskproClient
}

export default async function getAccessAndRefreshTokens(props: GetAccessAndRefreshTokensParams): Promise<OAuth2Result["data"]> {
  const { settings, accessCode, callbackUrl, client } = props

  const fetch = await adminGenericProxyFetch(client);

  const requestOptions: RequestInit = {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: accessCode,
      client_id: settings.client_key ?? "",
      client_secret: settings?.client_secret ?? "",
      redirect_uri: callbackUrl ?? "",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  return await fetch(`${settings?.salesforce_instance_url}/services/oauth2/token`, requestOptions).then((res) => res.json());
}