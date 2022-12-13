import {Stack, VerticalDivider} from "@deskpro/app-sdk";
import {Fragment} from "react";
import {PropertyView} from "../PropertyView/PropertyView";
import {Properties} from "../Mapper/PropertyLayout";
import {FieldProperty} from "../../screens/admin/types";
import {LayoutObject} from "../types";

type PropertyLayoutProps = {
    properties: Properties<FieldProperty>;
    object: LayoutObject;
    internalUrl?: string;
    externalUrl?: string;
};

export const PropertyLayout = ({ object, properties, internalUrl, externalUrl }: PropertyLayoutProps) => {
    return (
        <>
            {properties.map((row, rowIdx) => (
                <Stack gap={6} justify="space-between" style={{ width: "100%" }} align="stretch" key={rowIdx}>
                    {row.filter((r) => r !== null).map((column, colIdx) => (column ?
                        <Fragment key={colIdx}>
                            <div style={{ width: "100%" }}>
                                <PropertyView
                                    name={column?.property.name}
                                    object={object}
                                    internalUrl={internalUrl}
                                    externalUrl={externalUrl}
                                    isFirst={rowIdx === 0 && colIdx === 0}
                                />
                            </div>
                            {row.filter((r) => r !== null).length !== (colIdx + 1) && <VerticalDivider />}
                        </Fragment>
                        : null))}
                </Stack>
            ))}
        </>
    );
};