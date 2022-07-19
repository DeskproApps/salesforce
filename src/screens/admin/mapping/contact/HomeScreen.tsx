import { FieldMapping } from "../../../../components/FieldMapping/FieldMapping";
import { Field } from "../../../../api/types";
import {Stack, useDeskproLatestAppContext} from "@deskpro/app-sdk";
import {useQueryWithClient} from "../../../../hooks";
import {QueryKey} from "../../../../query";
import {getObjectMetaPreInstalled} from "../../../../api/preInstallationApi";
import {PropertyLayout} from "../../../../components/Mapper/PropertyLayout";

export const HomeScreen = () => {
    const allowedFieldFilter = (field: Field) => !["id"].includes(field.type);








    const { context } = useDeskproLatestAppContext();

    const canRequestMeta = !! context?.settings?.global_access_token;

    const meta = useQueryWithClient(
        [QueryKey.ADMIN_OBJECT_META, "Contact"],
        (client) => getObjectMetaPreInstalled(client, context?.settings, "Contact"),
        { enabled: canRequestMeta }
    );

    if (!meta.isSuccess) {
        return null;
    }



    type FieldProperty = {
        name: string;
        label: string;
    };

    const properties = meta.data.fields.map((f) => ({ name: f.name, label: f.label } as FieldProperty));

    const value = [
        [
            {
                "id": "IsDeleted",
                "property": {
                    "name": "IsDeleted",
                    "label": "Deleted"
                }
            },
            null
        ],
        [
            null,
            {
                "id": "MasterRecordId",
                "property": {
                    "name": "MasterRecordId",
                    "label": "Master Record ID"
                }
            }
        ]
    ];

    return (
        <Stack gap={20} style={{ padding: "16px" }} vertical>




            <PropertyLayout<FieldProperty>
                options={properties}
                propertyId={(option) => option.name}
                propertyLabel={(option) => option.label}
                onChange={(properties) => console.log("CHANGE", properties)}
                value={value}
            />





            <FieldMapping type="Contact" allowedFieldFilter={allowedFieldFilter} />
            <FieldMapping type="Opportunity" allowedFieldFilter={allowedFieldFilter} columns />
            <FieldMapping type="Note" allowedFieldFilter={allowedFieldFilter} columns />
        </Stack>
    );
};
