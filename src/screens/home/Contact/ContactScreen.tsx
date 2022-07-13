import {
    H1, HorizontalDivider,
    Property,
    Stack,
    useDeskproAppTheme,
    useDeskproLatestAppContext
} from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../../hooks";
import { QueryKey } from "../../../query";
import { getAccountById, getUserById } from "../../../api/api";
import { Container } from "../../../components/Container/Container";
import { ExternalLink } from "../../../components/ExternalLink/ExternalLink";
import { getObjectPermalink } from "../../../utils";
import { Contact } from "../../../api/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import {AccountScreen} from "../Account/AccountScreen";

type ContactScreenProps = {
    contact: Contact;
};

export const ContactScreen = ({ contact }: ContactScreenProps) => {
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext();

    const account = useQueryWithClient(
        [QueryKey.USER_ACCOUNT_BY_ID, contact.AccountId],
        (client) => getAccountById(client, contact.AccountId as string),
        { enabled: !! contact.AccountId }
    );

    const owner = useQueryWithClient(
        [QueryKey.USER_ACCOUNT_OWNER_BY_ID, contact.OwnerId],
        (client) => getUserById(client, contact.OwnerId as string),
        { enabled: !! contact.OwnerId }
    );

    return (
        <>
            <Container>
                <Stack gap={14} vertical>
                    <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                        <H1 style={{ color: theme.colors.cyan100 }}>Contact</H1>
                        <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Contact/${contact.Id}/view`)} />
                    </Stack>
                    <Property title="Name">
                        {contact.Salutation} {contact.FirstName} {contact.LastName}
                    </Property>
                    {contact.Title && <Property title="Title">
                        {contact.Title}
                    </Property>}
                    {contact.Phone && <Property title="Phone">
                        {contact.Phone}
                    </Property>}
                    {contact.MobilePhone && <Property title="Mobile">
                        {contact.MobilePhone}
                    </Property>}
                    {contact.Email && <Property title="Email">
                        {contact.Email}
                    </Property>}
                    {(owner.isSuccess && owner.data) && <Property title="Owner">
                        <Stack gap={8} align="center">
                            <img src={owner.data.SmallPhotoUrl} style={{ width: "16px", borderRadius: "100%" }} />
                            {owner.data.FirstName} {owner.data.LastName}
                            <a href={getObjectPermalink(context?.settings, `/lightning/r/User/${owner.data.Id}/view`)} target="_blank">
                                <FontAwesomeIcon icon={faExternalLink} color={theme.colors.grey40} size="sm" />
                            </a>
                        </Stack>
                    </Property>}
                </Stack>
            </Container>
            {(account.isSuccess && account.data) && (
                <>
                    <HorizontalDivider />
                    <AccountScreen account={account.data} />
                </>
            )}
        </>
    );
};
