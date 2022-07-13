import { Account } from "../../../api/types";
import {
    H1, Property,
    Stack,
    useDeskproAppTheme,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import { Container } from "../../../components/Container/Container";
import { ExternalLink } from "../../../components/ExternalLink/ExternalLink";
import { getObjectPermalink } from "../../../utils";
import { Address } from "../../../components/Address/Address";
import { useQueryWithClient } from "../../../hooks";
import { QueryKey } from "../../../query";
import { getUserById } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

type AccountScreenProps = {
    account: Account;
};

export const AccountScreen = ({ account }: AccountScreenProps) => {
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext();

    const owner = useQueryWithClient(
        [QueryKey.ORG_ACCOUNT_OWNER_BY_ID, account.OwnerId],
        (client) => getUserById(client, account.OwnerId as string),
        { enabled: !! account.OwnerId }
    );

    return (
        <Container>
            <Stack gap={14} vertical>
                <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                    <H1 style={{ color: theme.colors.cyan100 }}>Account</H1>
                    <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Account/${account.Id}/view`)} />
                </Stack>
                {account.Name && <Property title="Name">
                    {account.Name}
                </Property>}
                {account.Phone && <Property title="Phone">
                    {account.Phone}
                </Property>}
                {account.BillingAddress && <Property title="Billing Address">
                    <Address address={account.BillingAddress} />
                </Property>}
                {account.ShippingAddress && <Property title="Shipping Address">
                    <Address address={account.ShippingAddress} />
                </Property>}
                {account.Website && <Property title="Website">
                    <a href={account.Website} target="_blank" style={{ textDecoration: "none", color: theme.colors.cyan100 }}>{account.Website}</a>
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
    );
};
