import { getApiVersions, getMe, getObjectMeta } from "../api/api";
import { useQueryWithClient } from "../hooks";
import { useDeskproElements } from "@deskpro/app-sdk";
import { queryClient } from "../queryClient";

export const Ticket = () => {
    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    const me = useQueryWithClient(
        "me",
        (client) => getMe(client),
    );

    const accountMeta = useQueryWithClient(
        "accountMeta",
        (client) => getObjectMeta(client, "Account")
    );

    const apiVersions = useQueryWithClient(
        "apiVersions",
        (client) => getApiVersions(client)
    );

    console.log("ME", me);
    console.log("ACCOUNT_META", accountMeta);
    console.log("API_VERSIONS", apiVersions);

    return <>
        {me.isSuccess && `${me.data.name} (${me.data.companyName})`}
        <button onClick={() => queryClient.invalidateQueries("me") }>TEST</button>
    </>;
};
