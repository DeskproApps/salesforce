import {
    H1, HorizontalDivider,
    Stack,
    useDeskproAppTheme,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {useBasePath, useQueryWithClient} from "../../../hooks";
import { QueryKey } from "../../../query";
import {
    getAccountById,
    getObjectMeta,
    getObjectsByFk,
    getUserById
} from "../../../api/api";
import { Container } from "../../../components/Container/Container";
import { ExternalLink } from "../../../components/ExternalLink/ExternalLink";
import {getObjectPermalink, getScreenLayout} from "../../../utils";
import {Lead, ObjectMeta} from "../../../api/types";
import {Fragment, useMemo} from "react";
import {PropertyLayout} from "../../../components/PropertyLayout/PropertyLayout";
import {LayoutObject} from "../../../components/types";
import {match} from "ts-pattern";
import {Link} from "../../../components/Link/Link";

type LeadScreenProps = {
    lead: Lead;
};

export const LeadScreen = ({ lead }: LeadScreenProps) => {
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext();

    const basePath = useBasePath();

    const opportunitiesMax = 3;
    const notesMax = 3;

    const layout = useMemo(
        () => getScreenLayout(context?.settings, "Lead", "home"),
        [context?.settings]
    );

    const objects = layout.objects_order.map(([object]) => object?.property.name);

    const meta = useQueryWithClient<ObjectMeta>(
        [QueryKey.OBJECT_META, "Lead"],
        (client) => getObjectMeta(client, "Lead"),
    );

    const account = useQueryWithClient(
        [QueryKey.ACCOUNT_BY_ID, lead.ConvertedAccountId],
        (client) => getAccountById(client, lead.ConvertedAccountId as string),
        { enabled: !! lead.ConvertedAccountId && objects.includes("Account") }
    );

    const owner = useQueryWithClient(
        [QueryKey.USER_BY_ID, lead.OwnerId],
        (client) => getUserById(client, lead.OwnerId as string),
        { enabled: !! lead.OwnerId && objects.includes("User") }
    );

    const opportunities = useQueryWithClient(
        [QueryKey.OBJECTS_BY_FK, "Opportunity", "LeadSource", lead.Id, opportunitiesMax],
        (client) => getObjectsByFk(client, "Opportunity", "LeadSource", lead.Id, opportunitiesMax),
        { enabled: objects.includes("Opportunity") }
    );

    const notes = useQueryWithClient(
        [QueryKey.NOTES_BY_PARENT_ID, "Note", "ParentID", lead.Id, notesMax],
        (client) => getObjectsByFk(client, "Note", "ParentID", lead.Id, notesMax),
        { enabled: objects.includes("Note") }
    );

    if (!meta.isSuccess) {
        return null;
    }

    return (
        <>
            <Container>
                <Stack gap={14} vertical>

                    <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                        <H1 style={{ color: theme.colors.cyan100 }}>
                            <Link to={`${basePath}/objects/Lead/${lead.Id}/view`}>
                                Lead
                            </Link>
                        </H1>
                        <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Lead/${lead.Id}/view`)} />
                    </Stack>

                    <PropertyLayout properties={layout.root} object={(lead as unknown) as LayoutObject} />

                    <div style={{ width: "100%" }}>
                        <HorizontalDivider />
                    </div>

                    {objects.map((object, idx) => (
                        <Fragment key={idx}>
                            {
                                match(object)
                                    .with("Opportunity", () => (opportunities.data && opportunities.data.length > 0) && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1 style={{ color: theme.colors.cyan100 }}>
                                                    <Link to={`${basePath}/objects/Opportunity/LeadSource/${lead.Id}/list`}>
                                                        Opportunities
                                                    </Link>
                                                </H1>
                                            </Stack>
                                            <Stack gap={14} style={{ width: "100%" }} vertical>
                                                {opportunities.data.map((opportunity, idx) => (
                                                    <Fragment key={idx}>
                                                        <PropertyLayout
                                                            properties={layout.objects.Opportunity}
                                                            object={(opportunity as unknown) as LayoutObject}
                                                            externalUrl={getObjectPermalink(context?.settings, `/lightning/r/Opportunity/${opportunity.Id}/view`)}
                                                            internalUrl={`${basePath}/objects/Opportunity/${opportunity.Id}/view`}
                                                        />
                                                        <div style={{ width: "100%" }}>
                                                            <HorizontalDivider />
                                                        </div>
                                                    </Fragment>
                                                ))}
                                            </Stack>
                                        </Fragment>
                                    ))
                                    .with("Note", () => (notes.data && notes.data.length > 0) && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1 style={{ color: theme.colors.cyan100 }}>
                                                    <Link to={`${basePath}/objects/Note/ParentID/${lead.Id}/list`}>
                                                        Notes
                                                    </Link>
                                                </H1>
                                            </Stack>
                                            <Stack gap={14} style={{ width: "100%" }} vertical>
                                                {notes.data.map((note, idx) => (
                                                    <Fragment key={idx}>
                                                        <PropertyLayout
                                                            properties={layout.objects.Note}
                                                            object={(note as unknown) as LayoutObject}
                                                            externalUrl={getObjectPermalink(context?.settings, `/lightning/r/Note/${note.Id}/view`)}
                                                            internalUrl={`${basePath}/objects/Note/${note.Id}/view`}
                                                        />
                                                        <div style={{ width: "100%" }}>
                                                            <HorizontalDivider />
                                                        </div>
                                                    </Fragment>
                                                ))}
                                            </Stack>
                                        </Fragment>
                                    ))
                                    .with("OwnerID", () => owner.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1>Owner</H1>
                                                <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/User/${lead.OwnerId}/view`)} />
                                            </Stack>
                                            <PropertyLayout properties={layout.objects.OwnerID} object={(owner.data as unknown) as LayoutObject} />
                                            <div style={{ width: "100%" }}>
                                                <HorizontalDivider />
                                            </div>
                                        </Fragment>
                                    ))
                                    .with("ConvertedAccountId", () => account.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1>
                                                    <Link to={`${basePath}/objects/Account/${lead.ConvertedAccountId}/view`}>
                                                        Converted Account
                                                    </Link>
                                                </H1>
                                                <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Account/${lead.ConvertedAccountId}/view`)} />
                                            </Stack>
                                            <PropertyLayout properties={layout.objects.ConvertedAccountId} object={(account.data as unknown) as LayoutObject} />
                                            <div style={{ width: "100%" }}>
                                                <HorizontalDivider />
                                            </div>
                                        </Fragment>
                                    ))
                                    .otherwise(() => null)
                            }
                        </Fragment>
                    ))}
                </Stack>
            </Container>
        </>
    );
};
