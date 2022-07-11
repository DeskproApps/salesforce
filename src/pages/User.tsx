import {
    useDeskproElements,
    useDeskproLatestAppContext,
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproAppTheme, useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import { useQueryWithClient } from "../hooks";
import { getContactsByEmails, getLeadsByEmails } from "../api/api";
import { QueryKey } from "../query";
import { ContactScreen } from "../screens/home/Contact/ContactScreen";
import { LeadScreen } from "../screens/home/Lead/LeadScreen";
import { Container } from "../components/Container/Container";

export const User = () => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const { theme } = useDeskproAppTheme();

    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    const emails: string[] = context?.data.user.emails ?? [];

    const contacts = useQueryWithClient(
        [QueryKey.USER_CONTACTS_BY_EMAIL, ...emails],
        (client) => getContactsByEmails(client, emails)
    );

    const leads = useQueryWithClient(
        [QueryKey.USER_LEADS_BY_EMAIL, ...emails],
        (client) => getLeadsByEmails(client, emails)
    );

    const leadsAndContacts = [
        ...leads.data ?? [],
        ...contacts.data ?? [],
    ];

    useInitialisedDeskproAppClient((client) => {
        client.setBadgeCount(leadsAndContacts.length);
    }, [leadsAndContacts]);

    if (!contacts.isSuccess || !leads.isSuccess) {
        return <LoadingSpinner />;
    }

    if (!leadsAndContacts.length) {
        return (
            <Container>
                <em style={{ color: theme.colors.grey40, fontSize: "12px" }}>No Matching Salesforce Records Found</em>
            </Container>
        );
    }

    if (leadsAndContacts.length === 1) {
        if (leads.data.length) {
            client?.setTitle("Lead");
            return <LeadScreen lead={leads.data[0]} />;
        } else if (contacts.data.length) {
            client?.setTitle("Contact");
            return <ContactScreen contact={contacts.data[0]} />;
        }
    }

    // todo: if we only have one contact OR lead then just render it's view

    return <>User Page</>;
};
