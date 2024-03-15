import {useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getUserById} from "../../../../api/api";
import {getObjectPermalink} from "../../../../utils";
import {Stack} from "@deskpro/deskpro-ui";
import {Settings} from "../../../../types";
import {User as UserType} from "../../../../api/types";
import {ExternalLink} from "../../../ExternalLink/ExternalLink";

type UserProps = {
    id: string;
    settings: Settings;
};

export const User = ({ id, settings }: UserProps) => {
    const user = useQueryWithClient<UserType>(
        [QueryKey.USER_BY_ID, id],
        (client) => getUserById(client, id),
    );

    if (!user.isSuccess) {
        return null;
    }

    return (
        <Stack gap={8} align="center">
            {user.data.FirstName} {user.data.LastName}
            <ExternalLink url={getObjectPermalink(settings, `/lightning/r/User/${user.data.Id}/view`)} />
        </Stack>
    );
};
