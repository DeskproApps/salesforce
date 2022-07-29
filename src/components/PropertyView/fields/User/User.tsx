import {useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getUserById} from "../../../../api/api";
import {getObjectPermalink} from "../../../../utils";
import {Stack} from "@deskpro/app-sdk";
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
            <img src={user.data.SmallPhotoUrl} style={{ width: "16px", borderRadius: "100%" }} />
            {user.data.FirstName} {user.data.LastName}
            <ExternalLink url={getObjectPermalink(settings, `/lightning/r/User/${user.data.Id}/view`)} />
        </Stack>
    );
};