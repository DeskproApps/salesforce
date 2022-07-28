import {useQueryWithClient} from "../../hooks";
import {QueryKey} from "../../query";
import {getObjectById} from "../../api/api";
import {useDeskproLatestAppContext, Stack, useInitialisedDeskproAppClient} from "@deskpro/app-sdk";
import {getObjectPermalink, getScreenLayout} from "../../utils";
import {LayoutObject} from "../../components/types";
import {PropertyLayout} from "../../components/PropertyLayout/PropertyLayout";
import {Container} from "../../components/Container/Container";

type ViewScreenProps = {
    object: string;
    id: string;
};

export const ViewScreen = ({ object, id }: ViewScreenProps) => {
    const { context } = useDeskproLatestAppContext();

    const { data, isSuccess } = useQueryWithClient(
        [QueryKey.OBJECT_BY_ID, object, id],
        (client) => getObjectById(client, object, id),
    );

    useInitialisedDeskproAppClient((client) => client.setTitle(object), [object]);

    if (!isSuccess) {
        return null;
    }

    if (!context?.settings) {
        return null;
    }

    const layout = getScreenLayout(context.settings, object, "view");

    if (!layout) {
        console.error(`No layout found for ${object}:view`);
        return null;
    }

    return (
        <Container>
            <Stack gap={14} vertical>
                <PropertyLayout
                    properties={layout.root}
                    object={(data as unknown) as LayoutObject}
                    externalUrl={getObjectPermalink(context.settings, `/lightning/r/${object}/${id}/view`)}
                />
            </Stack>
        </Container>
    );
};
