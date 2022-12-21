import {Stack, H1, P1} from "@deskpro/app-sdk";
import {QueryKey} from "../../../../query";
import {getObjectMetaPreInstalled} from "../../../../api/preInstallationApi";
import {PropertyLayout} from "../../../../components/Mapper/PropertyLayout";
import {FieldProperty, ViewLayout} from "../../types";
import {useAdminQuery} from "../../hooks";
import {fieldToPropertyMapper} from "../../utils";
import {useCallback, useEffect, useState} from "react";

type ViewScreenProps = {
    onChange: (layout: ViewLayout) => void;
    value?: ViewLayout;
};

export const ViewScreen = ({ onChange, value = { root: [] } }: ViewScreenProps) => {
    const meta = useAdminQuery(
        [QueryKey.ADMIN_OBJECT_META, "Event"],
        (client, context) => getObjectMetaPreInstalled(client, context?.settings, "Event"),
    );

    const [layout, setLayout] = useState<ViewLayout>(value);

    useEffect(() => {
        onChange(layout);
    }, [layout, onChange]);

    const setRootLayout = useCallback(
        (properties) => setLayout((layout) => ({ ...layout, root: properties })),
        []
    );

    if (!meta.isSuccess) {
        return null;
    }

    const contactFieldOptions = meta.data.fields.map(fieldToPropertyMapper);

    return (
        <Stack gap={22} vertical>
            <Stack gap={6} style={{ width: "100%" }} vertical>
                <H1>Event Details</H1>
                <P1>Fields</P1>
                <PropertyLayout<FieldProperty>
                    options={contactFieldOptions}
                    propertyId={(option) => option.name}
                    propertyLabel={(option) => option.label}
                    onChange={setRootLayout}
                    maxColumns={2}
                    value={value.root}
                />
            </Stack>
        </Stack>
    );
};
