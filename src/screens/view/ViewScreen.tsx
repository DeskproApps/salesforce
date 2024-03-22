import { Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";

import { getObjectById } from "../../api/api";
import { Container } from "../../components/Container/Container";
import { PropertyLayout } from "../../components/PropertyLayout/PropertyLayout";
import { LayoutObject } from "../../components/types";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getObjectPermalink, getScreenLayout, logger } from "../../utils";

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
      let objectName;
      switch (elementId) {
        case "salesforceEditButton":
          switch (object) {
            case "Task":
            case "Event":
              objectName = "Activity";
              break;
            case "Account":
            case "Contact":
            case "Lead":
              objectName = "Profile";
              break;
            default:
              objectName = object;
          }
          navigate(
            `/addoredit/${objectName}/${object}/${id}${
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
      <Stack gap={5} vertical>
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
