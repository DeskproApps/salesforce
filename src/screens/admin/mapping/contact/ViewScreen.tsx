import { FieldMapping } from "../../../../components/FieldMapping/FieldMapping";
import { Field } from "../../../../api/types";
import { Stack } from "@deskpro/app-sdk";

export const ViewScreen = () => {
    const allowedFieldFilter = (field: Field) => !["reference", "id"].includes(field.type);

    return (
        <Stack gap={20} style={{ padding: "16px" }} vertical>
            <FieldMapping type="Contact" allowedFieldFilter={allowedFieldFilter} columns />
            <FieldMapping type="Opportunity" allowedFieldFilter={allowedFieldFilter} columns />
            <FieldMapping type="Note" allowedFieldFilter={allowedFieldFilter} columns />
        </Stack>
    );
};
