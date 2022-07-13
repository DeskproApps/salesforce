import { FieldMapping } from "../../../../components/FieldMapping/FieldMapping";
import { Field } from "../../../../api/types";
import { Stack } from "@deskpro/app-sdk";

export const ListScreen = () => {
    const fieldFilter = (field: Field) => (field.createable || field.updateable) && field.type !== "reference";

    return (
        <Stack gap={20} style={{ padding: "16px" }} vertical>
            <FieldMapping type="Contact" fieldFilter={fieldFilter} columns />
            <FieldMapping type="Opportunity" fieldFilter={fieldFilter} columns />
            <FieldMapping type="Note" fieldFilter={fieldFilter} columns />
        </Stack>
    );
};
