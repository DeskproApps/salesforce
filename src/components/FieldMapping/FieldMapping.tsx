import { useState } from "react";
import { Field, ObjectType } from "../../api/types";
import { Stack, useDeskproLatestAppContext, H1, useDeskproAppTheme } from "@deskpro/app-sdk";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { useQueryWithClient } from "../../hooks";
import { getObjectMetaPreInstalled } from "../../api/preInstallationApi";
import { QueryKey } from "../../query";
import { FieldMappingDropdown } from "./FieldMappingDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FieldMappingColumnsDropdown } from "./FieldMappingColumnsDropdown";
import "./FieldMapping.css";

type FieldMappingProps = {
    type: ObjectType;
    fieldFilter: (field: Field) => boolean;
    columns?: boolean;
};

type SortableField = Field & ItemInterface;

export const FieldMapping = ({ type, fieldFilter, columns = false }: FieldMappingProps) => {
    const { context } = useDeskproLatestAppContext();
    const { theme } = useDeskproAppTheme();

    const [selectedFields, setSelectedFields] = useState<SortableField[]>([]);

    const canRequestMeta = !! context?.settings?.global_access_token;

    const meta = useQueryWithClient(
        [QueryKey.ADMIN_OBJECT_META, type],
        (client) => getObjectMetaPreInstalled(client, context?.settings, type),
        { enabled: canRequestMeta }
    );

    if (!(meta.isSuccess && canRequestMeta)) {
        return null;
    }

    return (
        <Stack gap={10} vertical className="sf-field-mapping" style={{ borderColor: theme.colors.brandShade20 }}>
            <H1 style={{ fontSize: "14px" }}>{type}</H1>
            <div className="sf-field-mapping-list" style={{ borderColor: theme.colors.brandShade40 }}>
                {selectedFields.length === 0 && (
                    <div className="sf-field-mapping-list-item-empty">
                        No fields mapped
                    </div>
                )}
                <ReactSortable list={selectedFields} setList={setSelectedFields}>
                    {selectedFields.map((field, idx) => (
                        <div className="sf-field-mapping-list-item" key={idx}>
                            <div>
                                <FontAwesomeIcon
                                    icon={faGripVertical}
                                    color={theme.colors.grey40}
                                    className="sf-field-mapping-list-item-grip"
                                />
                                <span>{field.label}</span>
                            </div>
                            <FontAwesomeIcon
                                icon={faTrash}
                                color={theme.colors.grey40}
                                className="sf-field-mapping-list-item-trash"
                                onClick={() => setSelectedFields((s) => s.filter((f) => f.name !== field.name))}
                            />
                        </div>
                    ))}
                </ReactSortable>
            </div>
            <Stack justify="space-between" style={{ width: "100%" }}>
                <FieldMappingDropdown
                    fields={meta.data.fields}
                    fieldFilter={fieldFilter}
                    onSelect={(f) => {
                        setSelectedFields((s) => [...s, f as SortableField]);
                    }}
                    selectedNames={selectedFields.map((f) => f.name)}
                />
                {columns && (
                    <Stack align="center" gap={6}>
                        <span style={{ fontSize: "12px" }}>Number of columns</span>
                        <FieldMappingColumnsDropdown onSelect={() => {}} value={1} />
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};
