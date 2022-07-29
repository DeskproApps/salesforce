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
import {Contact, ObjectMeta} from "../../../api/types";
import {Fragment, useMemo} from "react";
import {PropertyLayout} from "../../../components/PropertyLayout/PropertyLayout";
import {LayoutObject} from "../../../components/types";
import {match} from "ts-pattern";
import {Link} from "../../../components/Link/Link";

type ContactScreenProps = {
    contact: Contact;
};

export const ContactScreen = ({ contact }: ContactScreenProps) => {
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext();

    const basePath = useBasePath();

    const opportunitiesMax = 3;
    const notesMax = 3;

    const layout = useMemo(
        () => getScreenLayout(context?.settings, "Contact", "home"),
        [context?.settings]
    );

    const objects = layout.objects_order.map(([object]) => object?.property.name);

    const meta = useQueryWithClient<ObjectMeta>(
        [QueryKey.OBJECT_META, "Contact"],
        (client) => getObjectMeta(client, "Contact"),
    );

    const account = useQueryWithClient(
        [QueryKey.ACCOUNT_BY_ID, contact.AccountId],
        (client) => getAccountById(client, contact.AccountId as string),
        { enabled: !! contact.AccountId && objects.includes("Account") }
    );

    const owner = useQueryWithClient(
        [QueryKey.USER_BY_ID, contact.OwnerId],
        (client) => getUserById(client, contact.OwnerId as string),
        { enabled: !! contact.OwnerId && objects.includes("User") }
    );

    const opportunities = useQueryWithClient(
        [QueryKey.OBJECTS_BY_FK, "Opportunity", "ContactID", contact.Id, opportunitiesMax],
        (client) => getObjectsByFk(client, "Opportunity", "ContactID", contact.Id, opportunitiesMax),
        { enabled: objects.includes("Opportunity") }
    );

    const notes = useQueryWithClient(
        [QueryKey.NOTES_BY_PARENT_ID, "Note", "ParentID", contact.Id, notesMax],
        (client) => getObjectsByFk(client, "Note", "ParentID", contact.Id, notesMax),
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
                            <Link to={`${basePath}/objects/Contact/${contact.Id}/view`}>
                                Contact
                            </Link>
                        </H1>
                        <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Contact/${contact.Id}/view`)} />
                    </Stack>

                    <PropertyLayout properties={layout.root} object={(contact as unknown) as LayoutObject} />

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
                                                    <Link to={`${basePath}/objects/Opportunity/ContactID/${contact.Id}/list`}>
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
                                                    <Link to={`${basePath}/objects/Note/ParentID/${contact.Id}/list`}>
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
                                                <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/User/${contact.OwnerId}/view`)} />
                                            </Stack>
                                            <PropertyLayout properties={layout.objects.OwnerID} object={(owner.data as unknown) as LayoutObject} />
                                            <div style={{ width: "100%" }}>
                                                <HorizontalDivider />
                                            </div>
                                        </Fragment>
                                    ))
                                    .with("AccountID", () => account.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1>
                                                    <Link to={`${basePath}/objects/Account/${contact.AccountId}/view`}>
                                                        Account
                                                    </Link>
                                                </H1>
                                                <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Account/${contact.AccountId}/view`)} />
                                            </Stack>
                                            <PropertyLayout properties={layout.objects.AccountID} object={(account.data as unknown) as LayoutObject} />
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
