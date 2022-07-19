import { FieldMapping } from "../../../../components/FieldMapping/FieldMapping";
import { Field } from "../../../../api/types";
import { Stack } from "@deskpro/app-sdk";

export const HomeScreen = () => {
    const allowedFieldFilter = (field: Field) => !["id"].includes(field.type);

    return (
        <Stack gap={20} style={{ padding: "16px" }} vertical>
            <FieldMapping type="Lead" allowedFieldFilter={allowedFieldFilter} />
            <FieldMapping type="Note" allowedFieldFilter={allowedFieldFilter} columns />
        </Stack>
    );
};
