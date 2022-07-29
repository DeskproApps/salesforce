import {useBasePath, useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getContactById} from "../../../../api/api";
import {getObjectPermalink} from "../../../../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {Stack, useDeskproAppTheme} from "@deskpro/app-sdk";
import {Settings} from "../../../../types";
import {Contact as ContactType} from "../../../../api/types";
import {Link} from "../../../Link/Link";

type ContactProps = {
    id: string;
    settings: Settings;
};

export const Contact = ({ id, settings }: ContactProps) => {
    const { theme } = useDeskproAppTheme();

    const basePath = useBasePath();

    const contact = useQueryWithClient<ContactType>(
        [QueryKey.CONTACT_BY_ID, id],
        (client) => getContactById(client, id),
    );

    if (!contact.isSuccess) {
        return null;
    }

    return (
        <Stack gap={8} align="center">
            <Link to={`${basePath}/objects/Contact/${contact.data.Id}/view`}>
                {contact.data.Name}
            </Link>
            <a href={getObjectPermalink(settings, `/lightning/r/Contact/${contact.data.Id}/view`)} target="_blank">
                <FontAwesomeIcon icon={faExternalLink} color={theme.colors.grey40} size="sm" />
            </a>
        </Stack>
    );
};