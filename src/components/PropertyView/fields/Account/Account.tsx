import {useBasePath, useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getAccountById} from "../../../../api/api";
import {getObjectPermalink} from "../../../../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {Stack, useDeskproAppTheme} from "@deskpro/app-sdk";
import {Settings} from "../../../../types";
import {Account as AccountType} from "../../../../api/types";
import {Link} from "../../../Link/Link";
import {ExternalLink} from "../../../ExternalLink/ExternalLink";

type AccountProps = {
    id: string;
    settings: Settings;
};

export const Account = ({ id, settings }: AccountProps) => {
    const { theme } = useDeskproAppTheme();

    const basePath = useBasePath();

    const account = useQueryWithClient<AccountType>(
        [QueryKey.ACCOUNT_BY_ID, id],
        (client) => getAccountById(client, id),
    );

    if (!account.isSuccess) {
        return null;
    }

    return (
        <Stack gap={8} align="center">
            <Link to={`${basePath}/objects/Account/${id}/view`}>
                {account.data.Name}
            </Link>
            <ExternalLink url={getObjectPermalink(settings, `/lightning/r/Account/${account.data.Id}/view`)} />
        </Stack>
    );
};