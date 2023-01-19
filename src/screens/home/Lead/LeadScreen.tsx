import {
  H1,
  HorizontalDivider,
  Stack,
  useDeskproAppTheme,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useBasePath, useQueryWithClient } from "../../../hooks";
import { QueryKey } from "../../../query";
import {
  getAccountById,
  getAllActivities,
  getObjectMeta,
  getObjectsByFk,
  getUserById,
} from "../../../api/api";
import { Container } from "../../../components/Container/Container";
import { ExternalLink } from "../../../components/ExternalLink/ExternalLink";
import { getObjectPermalink, getScreenLayout } from "../../../utils";
import { Lead, ObjectMeta } from "../../../api/types";
import { Fragment, useMemo } from "react";
import { PropertyLayout } from "../../../components/PropertyLayout/PropertyLayout";
import { LayoutObject } from "../../../components/types";
import { match } from "ts-pattern";
import { Link } from "../../../components/Link/Link";

type LeadScreenProps = {
  lead: Lead;
};

export const LeadScreen = ({ lead }: LeadScreenProps) => {
  const { theme } = useDeskproAppTheme();
  const { context } = useDeskproLatestAppContext();

  const basePath = useBasePath();

  const opportunitiesMax = 3;
  const notesMax = 3;
  const activitiesMax = 3;

  const layout = useMemo(
    () => getScreenLayout(context?.settings, "Lead", "home"),
    [context?.settings]
  );

  const objects = layout.objects_order.map(([object]) => object?.property.name);

  const meta = useQueryWithClient<ObjectMeta>(
    [QueryKey.OBJECT_META, "Lead"],
    (client) => getObjectMeta(client, "Lead")
  );

  const account = useQueryWithClient(
    [QueryKey.ACCOUNT_BY_ID, lead.ConvertedAccountId],
    (client) => getAccountById(client, lead.ConvertedAccountId as string),
    { enabled: !!lead.ConvertedAccountId && objects.includes("Account") }
  );

  const owner = useQueryWithClient(
    [QueryKey.USER_BY_ID, lead.OwnerId],
    (client) => getUserById(client, lead.OwnerId as string),
    { enabled: !!lead.OwnerId && objects.includes("User") }
  );

  const opportunities = useQueryWithClient(
    [
      QueryKey.OBJECTS_BY_FK,
      "Opportunity",
      "LeadSource",
      lead.Id,
      opportunitiesMax,
    ],
    (client) =>
      getObjectsByFk(
        client,
        "Opportunity",
        "LeadSource",
        lead.Id,
        opportunitiesMax
      ),
    { enabled: objects.includes("Opportunity") }
  );

  const notes = useQueryWithClient(
    [QueryKey.NOTES_BY_PARENT_ID, "Note", "ParentID", lead.Id, notesMax],
    (client) => getObjectsByFk(client, "Note", "ParentID", lead.Id, notesMax),
    { enabled: objects.includes("Note") }
  );

  const activities = useQueryWithClient(
    [
      QueryKey.ACTIVITIES_BY_WHO_ID,
      "Activities",
      "WhoId",
      lead.Id,
      activitiesMax,
    ],
    (client) => getAllActivities(client, lead.Id, "WhoId", activitiesMax),
    { enabled: objects.includes("Task") || objects.includes("Event") }
  );

  if (!meta.isSuccess) {
    return null;
  }

  return (
    <>
      <Container>
        <Stack gap={14} vertical>
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

          {objects.map((object, idx) => (
            <Fragment key={idx}>
              {match(object)
                .with("Opportunity", () => (
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
                      <Link
                        to={`${basePath}/objects/Opportunity/LeadSource/${lead.Id}/list`}
                      >
                        <H1 style={{ color: theme.colors.cyan100 }}>
                          Opportunities
                        </H1>
                      </Link>
                      <Link to={`/addoredit/opportunity/LeadSource/${lead.Id}`}>
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
                    </Stack>
                    <Stack gap={14} style={{ width: "100%" }} vertical>
                      {opportunities.data?.map((opportunity, idx) => (
                        <Fragment key={idx}>
                          <PropertyLayout
                            properties={layout.objects.Opportunity}
                            object={opportunity as unknown as LayoutObject}
                            externalUrl={getObjectPermalink(
                              context?.settings,
                              `/lightning/r/Opportunity/${opportunity.Id}/view`
                            )}
                            internalUrl={`${basePath}/objects/Opportunity/${opportunity.Id}/view`}
                          />
                          <div style={{ width: "100%" }}>
                            <HorizontalDivider />
                          </div>
                        </Fragment>
                      ))}
                      {(!opportunities.data ||
                        opportunities.data?.length === 0) && (
                        <div style={{ width: "100%" }}>
                          <HorizontalDivider />
                        </div>
                      )}
                    </Stack>
                  </Fragment>
                ))
                .with("Task", () => (
                  <Fragment key={idx}>
                    <Stack
                      justify="space-between"
                      align="center"
                      style={{ width: "100%" }}
                    >
                      <Stack
                        gap={5}
                        style={{
                          verticalAlign: "baseline",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to={`${basePath}/objects/activity/AccountId/${lead.Id}/list`}
                        >
                          <H1>Activity</H1>
                        </Link>
                        <Link to={`/addoredit/activity/WhoId/${lead.Id}`}>
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
                      </Stack>
                    </Stack>
                    <Stack gap={14} style={{ width: "100%" }} vertical>
                      {activities.data?.map((activity, idx) => {
                        const usedLayout =
                          activity.Type === "Task"
                            ? layout.objects.Task
                            : layout.objects.Event;

                        return (
                          <Fragment key={idx}>
                            <PropertyLayout
                              properties={usedLayout}
                              object={activity as unknown as LayoutObject}
                              externalUrl={getObjectPermalink(
                                context?.settings,
                                `/lightning/r/${
                                  activity.TaskSubtype ? "Task" : "Event"
                                }/${activity.Id}/view`
                              )}
                              internalUrl={`${basePath}/objects/${activity.Type}/${activity.Id}/view`}
                            />
                            <div style={{ width: "100%" }}>
                              <HorizontalDivider />
                            </div>
                          </Fragment>
                        );
                      })}
                      {(!activities.data || activities.data?.length === 0) && (
                        <div style={{ width: "100%" }}>
                          <HorizontalDivider />
                        </div>
                      )}
                    </Stack>
                  </Fragment>
                ))
                .with("Note", () => (
                  <Fragment key={idx}>
                    <Stack
                      justify="space-between"
                      align="center"
                      style={{ width: "100%" }}
                    >
                      <Stack
                        gap={5}
                        style={{
                          verticalAlign: "baseline",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to={`${basePath}/objects/Note/ParentID/${lead.Id}/list`}
                        >
                          <H1>Notes</H1>
                        </Link>
                        <Link to={`/addoredit/note/ParentId/${lead.Id}`}>
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
                      </Stack>
                    </Stack>
                    <Stack gap={14} style={{ width: "100%" }} vertical>
                      {notes.data?.map((note, idx) => (
                        <Fragment key={idx}>
                          <PropertyLayout
                            properties={layout.objects.Note}
                            object={note as unknown as LayoutObject}
                            externalUrl={getObjectPermalink(
                              context?.settings,
                              `/lightning/r/Note/${note.Id}/view`
                            )}
                            internalUrl={`${basePath}/objects/Note/${note.Id}/view`}
                          />
                          <div style={{ width: "100%" }}>
                            <HorizontalDivider />
                          </div>
                        </Fragment>
                      ))}
                      {(!notes.data || notes.data?.length === 0) && (
                        <div style={{ width: "100%" }}>
                          <HorizontalDivider />
                        </div>
                      )}
                    </Stack>
                  </Fragment>
                ))
                .with(
                  "OwnerID",
                  () =>
                    owner.data && (
                      <Fragment key={idx}>
                        <Stack
                          justify="space-between"
                          align="center"
                          style={{ width: "100%" }}
                        >
                          <H1>Owner</H1>
                          <ExternalLink
                            url={getObjectPermalink(
                              context?.settings,
                              `/lightning/r/User/${lead.OwnerId}/view`
                            )}
                          />
                        </Stack>
                        <PropertyLayout
                          properties={layout.objects.OwnerID}
                          object={owner.data as unknown as LayoutObject}
                        />
                        <div style={{ width: "100%" }}>
                          <HorizontalDivider />
                        </div>
                      </Fragment>
                    )
                )
                .with(
                  "ConvertedAccountId",
                  () =>
                    account.data && (
                      <Fragment key={idx}>
                        <Stack
                          justify="space-between"
                          align="center"
                          style={{ width: "100%" }}
                        >
                          <H1>
                            <Link
                              to={`${basePath}/objects/Account/${lead.ConvertedAccountId}/view`}
                            >
                              Converted Account
                            </Link>
                          </H1>
                          <ExternalLink
                            url={getObjectPermalink(
                              context?.settings,
                              `/lightning/r/Account/${lead.ConvertedAccountId}/view`
                            )}
                          />
                        </Stack>
                        <PropertyLayout
                          properties={layout.objects.ConvertedAccountId}
                          object={account.data as unknown as LayoutObject}
                        />
                        <div style={{ width: "100%" }}>
                          <HorizontalDivider />
                        </div>
                      </Fragment>
                    )
                )
                .otherwise(() => null)}
            </Fragment>
          ))}
        </Stack>
      </Container>
    </>
  );
};
