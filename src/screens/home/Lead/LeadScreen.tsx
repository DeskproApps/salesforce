import {
    H1,
    Property,
    Stack,
    useDeskproAppTheme,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import { Container } from "../../../components/Container/Container";
import { ExternalLink } from "../../../components/ExternalLink/ExternalLink";
import { getObjectPermalink } from "../../../utils";
import { Lead } from "../../../api/types";

type LeadScreenProps = {
    lead: Lead;
};

export const LeadScreen = ({ lead }: LeadScreenProps) => {
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext();

    useInitialisedDeskproAppClient((client) => {
        client.resize();
    }, [context]);

    return (
        <Container>
            <Stack gap={14} vertical>
                <Stack justify="space-between" align="center" style={{ width: "100%" }}>
                    <H1 style={{ color: theme.colors.cyan100 }}>Details</H1>
                    <ExternalLink url={getObjectPermalink(context?.settings, `/lightning/r/Lead/${lead.Id}/view`)} />
                </Stack>
                <Property title="Name">
                    {lead.Salutation} {lead.FirstName} {lead.LastName}
                </Property>
                {lead.Title && <Property title="Title">
                    {lead.Title}
                </Property>}
                {lead.Company && <Property title="Company">
                    {lead.Company}
                </Property>}
                {lead.Phone && <Property title="Phone">
                    {lead.Phone}
                </Property>}
                {lead.MobilePhone && <Property title="Mobile">
                    {lead.MobilePhone}
                </Property>}
                {lead.Email && <Property title="Email">
                    {lead.Email}
                </Property>}
            </Stack>
        </Container>
    );
};
