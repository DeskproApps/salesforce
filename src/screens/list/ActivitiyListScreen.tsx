import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getAllActivities } from "../../api/api";
import { Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  HorizontalDivider,
} from "@deskpro/app-sdk";
import { getObjectPermalink, getScreenLayout, logger } from "../../utils";
import { LayoutObject } from "../../components/types";
import { PropertyLayout } from "../../components/PropertyLayout/PropertyLayout";
import { Container } from "../../components/Container/Container";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

type ListScreenProps = {
  id: string;
  field: string;
};

export const ActivityListScreen = ({ id, field }: ListScreenProps) => {
  const { context } = useDeskproLatestAppContext();
  const { pathname } = useLocation();

  useInitialisedDeskproAppClient(
    (client) => client.setTitle(`Activities List`),
    []
  );

  const basePath = useMemo(
    () => `/${pathname.split("/").filter((f) => f)[0]}`,
    [pathname]
  );

  const maxItems = 200;

  const { data, isSuccess } = useQueryWithClient<unknown[]>(
    [QueryKey.OBJECTS_BY_FK, id, maxItems],
    (client) => getAllActivities(client, id, field, maxItems)
  );

  if (!isSuccess) {
    return null;
  }

  if (!context?.settings) {
    return null;
  }

  const layoutTask = getScreenLayout(context.settings, "Task", "list");

  const layoutEvent = getScreenLayout(context.settings, "Event", "list");

  if (!layoutTask || !layoutEvent) {
    logger.error(`No layout found for "Activities":list`);
    return null;
  }

  return (
    <Container>
      <Stack gap={5} vertical>
        {data?.map((item) => {
          const typedItem = item as LayoutObject;

          const layout = typedItem.EventSubtype ? layoutEvent : layoutTask;

          const objectType = (typedItem as LayoutObject).EventSubtype
            ? "Event"
            : "Task";

          return (
            <Stack gap={14} style={{ width: "100%" }} vertical>
              <PropertyLayout
                properties={layout.root}
                object={typedItem}
                externalUrl={getObjectPermalink(
                  context?.settings,
                  `/lightning/r/${objectType}/${typedItem.Id}/view`
                )}
                internalUrl={`${basePath}/objects/${objectType}/${typedItem.Id}/view`}
              />
              <div style={{ width: "100%" }}>
                <HorizontalDivider />
              </div>
            </Stack>
          );
        })}
      </Stack>
    </Container>
  );
};
