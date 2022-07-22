import {Stack, VerticalDivider} from "@deskpro/app-sdk";
import {Fragment} from "react";
import {PropertyView} from "../PropertyView/PropertyView";
import {Properties} from "../Mapper/PropertyLayout";
import {FieldProperty} from "../../screens/admin/types";
import {LayoutObject} from "../types";

type PropertyLayoutProps = {
    properties: Properties<FieldProperty>;
    object: LayoutObject;
};

export const PropertyLayout = ({ object, properties }: PropertyLayoutProps) => {
    return properties.map((row, idx) => (
        <Stack gap={6} justify="space-between" style={{ width: "100%" }} align="stretch" key={idx}>
            {row.filter((r) => r !== null).map((column, idx) => (column ?
                <Fragment key={idx}>
                    <div style={{ width: "100%" }}>
                        <PropertyView name={column?.property.name} object={object} />
                    </div>
                    {row.filter((r) => r !== null).length !== (idx + 1) && <VerticalDivider width={2} />}
                </Fragment>
                : null))}
        </Stack>
    ));
};