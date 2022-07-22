import {useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getUserById} from "../../../../api/api";
import {getObjectPermalink} from "../../../../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {Stack, useDeskproAppTheme} from "@deskpro/app-sdk";
import {Settings} from "../../../../types";
import {User as UserType} from "../../../../api/types";

type UserProps = {
    id: string;
    settings: Settings;
};

export const User = ({ id, settings }: UserProps) => {
    const { theme } = useDeskproAppTheme();

    const user = useQueryWithClient<UserType>(
        [QueryKey.USER_BY_ID, id],
        (client) => getUserById(client, id),
    );

    if (!user.isSuccess) {
        return null;
    }

    return (
        <Stack gap={8} align="center">
            <img src={user.data.SmallPhotoUrl} style={{ width: "16px", borderRadius: "100%" }} />
            {user.data.FirstName} {user.data.LastName}
            <a href={getObjectPermalink(settings, `/lightning/r/User/${user.data.Id}/view`)} target="_blank">
                <FontAwesomeIcon icon={faExternalLink} color={theme.colors.grey40} size="sm" />
            </a>
        </Stack>
    );
};