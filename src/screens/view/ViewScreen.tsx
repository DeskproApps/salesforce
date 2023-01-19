import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  Stack,
  useInitialisedDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";

import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getObjectById } from "../../api/api";
import { getObjectPermalink, getScreenLayout, logger } from "../../utils";
import { LayoutObject } from "../../components/types";
import { PropertyLayout } from "../../components/PropertyLayout/PropertyLayout";
import { Container } from "../../components/Container/Container";

type ViewScreenProps = {
  object: string;
  id: string;
};

export const ViewScreen = ({ object, id }: ViewScreenProps) => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();

  const { data, isSuccess } = useQueryWithClient(
    [QueryKey.OBJECT_BY_ID, object, id],
    (client) => getObjectById(client, object, id)
  );

  useInitialisedDeskproAppClient(
    (client) => {
      client.setTitle(object);

      client.registerElement("salesforceEditButton", {
        type: "edit_button",
      });
    },
    [object]
  );

  useDeskproAppEvents({
    onElementEvent(elementId) {
      switch (elementId) {
        case "salesforceEditButton":
          navigate(
            `/addoredit/${
              ["Task", "Event"].includes(object) ? "Activity" : object
            }/edit/${id}${
              ["Task", "Event"].includes(object) ? `?type=${object}` : ""
            }`
          );
          break;
      }
    },
  });

  if (!isSuccess) {
    return null;
  }

  if (!context?.settings) {
    return null;
  }

  const layout = getScreenLayout(context.settings, object, "view");

  if (!layout) {
    logger.error(`No layout found for ${object}:view`);
    return null;
  }

  return (
    <Container>
      <Stack gap={14} vertical>
        <PropertyLayout
          properties={layout.root}
          object={data as unknown as LayoutObject}
          externalUrl={getObjectPermalink(
            context.settings,
            `/lightning/r/${object}/${id}/view`
          )}
        />
      </Stack>
    </Container>
  );
};
