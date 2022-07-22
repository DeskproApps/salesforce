import {
    H1, HorizontalDivider,
    Stack,
    useDeskproAppTheme,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../../hooks";
import { QueryKey } from "../../../query";
import {
    getAccountById,
    getNotesByParentId,
    getObjectMeta,
    getOpportunitiesByContactId,
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

type ContactScreenProps = {
    contact: Contact;
};

export const ContactScreen = ({ contact }: ContactScreenProps) => {
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext();

    const opportunitiesMax = 3;
    const notesMax = 3;

    const layout = useMemo(
        () => getScreenLayout(context?.settings, "Contact", "home"),
        [context?.settings]
    );

    const objects = layout.objects.map(([object]) => object?.property.name);

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
        [QueryKey.OPPORTUNITIES_BY_CONTACT_ID, contact.Id, opportunitiesMax],
        (client) => getOpportunitiesByContactId(client, contact.Id, opportunitiesMax),
        { enabled: objects.includes("Opportunity") }
    );

    const notes = useQueryWithClient(
        [QueryKey.NOTES_BY_PARENT_ID, contact.Id, notesMax],
        (client) => getNotesByParentId(client, contact.Id, notesMax),
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
                        <H1 style={{ color: theme.colors.cyan100 }}>Contact</H1>
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
                                    .with("Opportunity", () => opportunities.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1 style={{ color: theme.colors.cyan100 }}>Opportunities</H1>
                                            </Stack>
                                            <Stack gap={20} style={{ width: "100%" }} vertical>
                                                {opportunities.data.map((opportunity, idx) => (
                                                    <PropertyLayout properties={layout.Opportunity} object={(opportunity as unknown) as LayoutObject} key={idx} />
                                                ))}
                                            </Stack>
                                        </Fragment>
                                    ))
                                    .with("Note", () => notes.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1 style={{ color: theme.colors.cyan100 }}>Notes</H1>
                                            </Stack>
                                            <Stack gap={20} style={{ width: "100%" }} vertical>
                                                {notes.data.map((note, idx) => (
                                                    <PropertyLayout properties={layout.Note} object={(note as unknown) as LayoutObject} key={idx} />
                                                ))}
                                            </Stack>
                                        </Fragment>
                                    ))
                                    .with("User", () => owner.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1 style={{ color: theme.colors.cyan100 }}>Owner</H1>
                                            </Stack>
                                            <PropertyLayout properties={layout.User} object={(owner.data as unknown) as LayoutObject} />
                                        </Fragment>
                                    ))
                                    .with("Account", () => account.data && (
                                        <Fragment key={idx}>
                                            <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                                                <H1 style={{ color: theme.colors.cyan100 }}>Account</H1>
                                            </Stack>
                                            <PropertyLayout properties={layout.Account} object={(account.data as unknown) as LayoutObject} />
                                        </Fragment>
                                    ))
                                    .otherwise(() => null)
                            }
                            <div style={{ width: "100%" }}>
                                <HorizontalDivider />
                            </div>
                        </Fragment>
                    ))}
                </Stack>
            </Container>
        </>
    );
};
