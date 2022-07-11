import {
    LoadingSpinner, useDeskproAppClient, useDeskproAppTheme,
    useDeskproElements,
    useDeskproLatestAppContext
} from "@deskpro/app-sdk";
import { useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { getAccountsByName } from "../api/api";
import { AccountScreen } from "../screens/home/Account/AccountScreen";
import { Container } from "../components/Container/Container";

export const Organization = () => {
    const { context } = useDeskproLatestAppContext();
    const { theme } = useDeskproAppTheme();
    const { client } = useDeskproAppClient();

    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    const name = context?.data.organisation.name as string;

    const accounts = useQueryWithClient(
        [QueryKey.ORG_ACCOUNTS_BY_NAME, name],
        (client) => getAccountsByName(client, name)
    );

    if (!accounts.isSuccess) {
        return <LoadingSpinner />;
    }

    if (!accounts.data.length) {
        return (
            <Container>
                <em style={{ color: theme.colors.grey40, fontSize: "12px" }}>No Matching Salesforce Records Found</em>
            </Container>
        );
    }

    if (accounts.data.length === 1) {
        client?.setTitle("Account");
        return <AccountScreen account={accounts.data[0]} />
    }

    // todo: display dropdown to select between accounts

    return <>Organization Page</>;
};
