import { H1, Stack } from "@deskpro/deskpro-ui";
import {
  HorizontalDivider,
  useDeskproAppTheme,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useMemo } from "react";
import { getAllChildrenFromSobject } from "../../../api/api";
import { Lead } from "../../../api/types";
import { Container } from "../../../components/Container/Container";
import { ExternalLink } from "../../../components/ExternalLink/ExternalLink";
import { PropertyLayout } from "../../../components/PropertyLayout/PropertyLayout";
import { LayoutObject } from "../../../components/types";
import { useBasePath, useQueryWithClient } from "../../../hooks";
import { QueryKey } from "../../../query";
import {
  getObjectPermalink,
  getScreenLayout,
  sObjectsWithMappings,
} from "../../../utils";
import { ObjectProperty } from "../../admin/types";
import { Link } from "react-router-dom";
import { Settings } from "../../../types";

type LeadScreenProps = {
  lead: Lead;
};

export const LeadScreen = ({ lead }: LeadScreenProps) => {
  const { theme } = useDeskproAppTheme();
  const { context } = useDeskproLatestAppContext<never, Settings>();

  const basePath = useBasePath();

  const layout = useMemo(
    () => getScreenLayout(context?.settings, "Lead", "home"),
    [context?.settings]
  );

  const objects = layout.objects_order.flat().map((e) => e?.property);

  const objectsData = useQueryWithClient(
    [QueryKey.ACCOUNT_BY_ID, "Lead", lead, objects],
    (client) =>
      getAllChildrenFromSobject(client, objects as ObjectProperty[], lead),
    {
      enabled: !!objects.length && !!lead,
    }
  );

  if (!objectsData.isSuccess) {
    return null;
  }

  return (
    <>
      <Container>
        <Stack gap={5} vertical>
          <Stack
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            <H1 style={{ color: theme.colors.cyan100 }}>
              <Link to={`${basePath}/objects/Lead/${lead.Id}/view`}>Lead</Link>
            </H1>
            <ExternalLink
              url={getObjectPermalink(
                context?.settings,
                `/lightning/r/Lead/${lead.Id}/view`
              )}
            />
          </Stack>
          <PropertyLayout
            properties={layout.root}
            object={lead as unknown as LayoutObject}
          />
          <div style={{ width: "100%" }}>
            <HorizontalDivider />
          </div>
          {objects.map((object, idx) => {
            if (!object) return;
            const data = objectsData.data.find(
              (e) =>
                (
                  e as unknown as {
                    attributes: { type: string };
                  }[]
                )[0]?.attributes.type === object?.name
            ) as {
              attributes: { type: string };
              Id: string;
            }[];

            if (!data?.length) return;

            const hasMapping = sObjectsWithMappings.includes(
              data[0].attributes.type
            );

            return (
              <Fragment key={idx}>
                <Fragment key={idx}>
                  <Stack
                    justify="space-between"
                    align="center"
                    gap={5}
                    style={{
                      verticalAlign: "baseline",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {hasMapping ? (
                      <Link
                        to={`${basePath}/objects/${object.name}/${object.field}/${lead.Id}/list`}
                      >
                        <H1 style={{ color: theme.colors.cyan100 }}>
                          {object.label}
                        </H1>
                      </Link>
                    ) : (
                      <H1>{object.label}</H1>
                    )}
                    {hasMapping && (
                      <Link to={`/addoredit/${object.name}/LeadId/${lead.Id}`}>
                        <Stack style={{ color: theme.colors.grey500 }}>
                          <FontAwesomeIcon
                            icon={faPlus as IconProp}
                            size="sm"
                            style={{
                              alignSelf: "center",
                              cursor: "pointer",
                              marginBottom: "2px",
                            }}
                          ></FontAwesomeIcon>
                        </Stack>
                      </Link>
                    )}
                  </Stack>
                  <Stack gap={14} style={{ width: "100%" }} vertical>
                    {data?.map((sobj) => (
                      <Fragment key={idx}>
                        <PropertyLayout
                          properties={layout.objects[object?.name as string]}
                          object={sobj as unknown as LayoutObject}
                          externalUrl={
                            hasMapping
                              ? getObjectPermalink(
                                context?.settings,
                                `/lightning/r/${object.name}/${(sobj as { Id: string }).Id
                                }/view`
                              )
                              : undefined
                          }
                          internalUrl={
                            hasMapping
                              ? `${basePath}/objects/${object.name}/${sobj.Id}/view`
                              : undefined
                          }
                        />
                        <div style={{ width: "100%" }}>
                          <HorizontalDivider />
                        </div>
                      </Fragment>
                    ))}
                    {(!data || data?.length === 0) && (
                      <div style={{ width: "100%" }}>
                        <HorizontalDivider />
                      </div>
                    )}
                  </Stack>
                </Fragment>
              </Fragment>
            );
          })}
        </Stack>
      </Container>
    </>
  );
};
