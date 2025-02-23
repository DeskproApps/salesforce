import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getObjectsByFk } from "../../api/api";
import { Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  HorizontalDivider,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { getObjectPermalink, getScreenLayout, logger } from "../../utils";
import { LayoutObject } from "../../components/types";
import { PropertyLayout } from "../../components/PropertyLayout/PropertyLayout";
import { Container } from "../../components/Container/Container";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Settings } from "../../types";

type ListScreenProps = {
  object: string;
  field: string;
  id: string;
};

export const ListScreen = ({ object, field, id }: ListScreenProps) => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext<never, Settings>();
  const { pathname } = useLocation();

  useInitialisedDeskproAppClient(
    (client) => {
      client.setTitle(`${object} List`);

      client.registerElement("salesforcePlusButton", {
        type: "plus_button",
      });
    },
    [object]
  );

  useDeskproAppEvents({
    onElementEvent(elementId) {
      switch (elementId) {
        case "salesforcePlusButton":
          navigate(`/addoredit/${object}/${field}/${id}`);
          break;
      }
    },
  });

  const basePath = useMemo(
    () => `/${pathname.split("/").filter((f) => f)[0]}`,
    [pathname]
  );

  const maxItems = 200; // Constrained by Salesforce to max = 200

  const { data, isSuccess } = useQueryWithClient<unknown[]>(
    [QueryKey.OBJECTS_BY_FK, object, field, id, maxItems],
    (client) => getObjectsByFk(client, object, field, id, maxItems)
  );

  if (!isSuccess) {
    return null;
  }

  if (!context?.settings) {
    return null;
  }

  const layout = getScreenLayout(context.settings, object, "list");

  if (!layout) {
    logger.error(`No layout found for ${object}:list`);
    return null;
  }

  return (
    <Container>
      <Stack gap={5} vertical>
        {data?.map((item) => (
          <Stack gap={5} style={{ width: "100%" }} vertical>
            <PropertyLayout
              properties={layout.root}
              object={item as unknown as LayoutObject}
              externalUrl={getObjectPermalink(
                context?.settings,
                `/lightning/r/${object}/${(item as LayoutObject).Id}/view`
              )}
              internalUrl={`${basePath}/objects/${object}/${(item as LayoutObject).Id
                }/view`}
            />
            <div style={{ width: "100%" }}>
              <HorizontalDivider />
            </div>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
};
