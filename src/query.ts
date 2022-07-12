import { QueryClient } from "react-query";

export const query = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
            refetchOnWindowFocus: false,
        },
    },
});

export enum QueryKey {
    USER_CONTACTS_BY_EMAIL = "user_contacts_by_emails",
    USER_LEADS_BY_EMAIL = "user_leads_by_emails",
    USER_ACCOUNT_BY_ID = "user_account_by_id",
    USER_ACCOUNT_OWNER_BY_ID = "user_account_owner_by_id",
    ORG_ACCOUNTS_BY_NAME = "org_accounts_by_name",
    ORG_ACCOUNT_OWNER_BY_ID = "org_account_owner_by_id",
}
