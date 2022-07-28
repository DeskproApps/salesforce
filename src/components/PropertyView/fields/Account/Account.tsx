import {useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getAccountById} from "../../../../api/api";
import {getObjectPermalink} from "../../../../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {Stack, useDeskproAppTheme} from "@deskpro/app-sdk";
import {Settings} from "../../../../types";
import {Account as AccountType} from "../../../../api/types";

type AccountProps = {
    id: string;
    settings: Settings;
};

export const Account = ({ id, settings }: AccountProps) => {
    const { theme } = useDeskproAppTheme();

    const account = useQueryWithClient<AccountType>(
        [QueryKey.ACCOUNT_BY_ID, id],
        (client) => getAccountById(client, id),
    );

    if (!account.isSuccess) {
        return null;
    }

    return (
        <Stack gap={8} align="center">
            {account.data.Name}
            <a href={getObjectPermalink(settings, `/lightning/r/Account/${account.data.Id}/view`)} target="_blank">
                <FontAwesomeIcon icon={faExternalLink} color={theme.colors.grey40} size="sm" />
            </a>
        </Stack>
    );
};