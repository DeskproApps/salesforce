import { useState } from "react";
import { Field, ObjectType } from "../../api/types";
import { Stack, useDeskproLatestAppContext, H1, useDeskproAppTheme } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../hooks";
import { getObjectMetaPreInstalled } from "../../api/preInstallationApi";
import { QueryKey } from "../../query";
import { FieldMappingDropdown } from "./FieldMappingDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FieldMappingColumnsDropdown } from "./FieldMappingColumnsDropdown";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {maxBy, range} from "lodash";
import "./FieldMapping.css";

type FieldMappingProps = {
    type: ObjectType;
    allowedFieldFilter: (field: Field) => boolean;
    columns?: boolean;
};

export const FieldMapping = ({ type, allowedFieldFilter, columns = false }: FieldMappingProps) => {

    type ColumnField = Field & {
        __column: number;
    };

    const { context } = useDeskproLatestAppContext();
    const { theme } = useDeskproAppTheme();

    const [columnCount, setColumnCount] = useState(1);
    const [selectedFields, setSelectedFields] = useState<ColumnField[]>([]);

    const canRequestMeta = !! context?.settings?.global_access_token;

    const meta = useQueryWithClient(
        [QueryKey.ADMIN_OBJECT_META, type],
        (client) => getObjectMetaPreInstalled(client, context?.settings, type),
        { enabled: canRequestMeta }
    );

    if (!(meta.isSuccess && canRequestMeta)) {
        return null;
    }

    type MaxColumn = { column: number; count: number; };

    const countPerColumn = range(columnCount).reduce<MaxColumn[]>((a, c) => [
        ...a,
        ...[{ column: c, count: selectedFields.filter((f) => f.__column === c).length }]
    ], []);

    const maxColumn = maxBy(countPerColumn, (c) => c.count) as MaxColumn;

    return (
        <DragDropContext onDragEnd={console.log}>
            <Stack gap={10} vertical className="sf-field-mapping" style={{ borderColor: theme.colors.brandShade20 }}>
                <H1 style={{ fontSize: "14px" }}>{type}</H1>
                <div className="sf-field-mapping-list" style={{ borderColor: theme.colors.brandShade40 }}>
                    {selectedFields.length === 0 && (
                        <div className="sf-field-mapping-list-item-empty">
                            No fields mapped
                        </div>
                    )}
                    <div className="sf-field-mapping-list-columns">
                        {range(columnCount).map((column, idx) => (
                            <div className="sf-field-mapping-list-column" style={{ width: `${(1 / columnCount) * 100}%` }} key={idx}>
                                <Droppable droppableId={`droppable_${column}`}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {range(maxColumn.count).map((count, idx) => {
                                                const field = selectedFields.filter((f) => f.__column === column)[count] ?? null;

                                                if (!field) {
                                                    return (
                                                        <div className="sf-field-mapping-list-item-drag-empty">&nbsp;</div>

                                                        // <Draggable draggableId={`${column}_${idx}`} index={idx} key={idx}>
                                                        //     {() => (
                                                        //         <div className="sf-field-mapping-list-item-drag-empty">&nbsp;</div>
                                                        //     )}
                                                        // </Draggable>
                                                    );
                                                } else {
                                                    return (
                                                        <Draggable draggableId={`${column}_${idx}`} index={idx} key={idx}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    className="sf-field-mapping-list-item"
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
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
                                                            )}
                                                        </Draggable>
                                                    );
                                                }
                                            })}
                                            {provided.placeholder}


                                            {/*{selectedFields.filter((f) => f.__column === column).map((field, idx) => (*/}
                                            {/*    <Draggable draggableId={field.name} index={idx} key={idx}>*/}
                                            {/*        {(provided, snapshot) => (*/}
                                            {/*            <div*/}
                                            {/*                className="sf-field-mapping-list-item"*/}
                                            {/*                ref={provided.innerRef}*/}
                                            {/*                {...provided.draggableProps}*/}
                                            {/*                {...provided.dragHandleProps}*/}
                                            {/*            >*/}
                                            {/*                <div>*/}
                                            {/*                    <FontAwesomeIcon*/}
                                            {/*                        icon={faGripVertical}*/}
                                            {/*                        color={theme.colors.grey40}*/}
                                            {/*                        className="sf-field-mapping-list-item-grip"*/}
                                            {/*                    />*/}
                                            {/*                    <span>{field.label}</span>*/}
                                            {/*                </div>*/}
                                            {/*                <FontAwesomeIcon*/}
                                            {/*                    icon={faTrash}*/}
                                            {/*                    color={theme.colors.grey40}*/}
                                            {/*                    className="sf-field-mapping-list-item-trash"*/}
                                            {/*                    onClick={() => setSelectedFields((s) => s.filter((f) => f.name !== field.name))}*/}
                                            {/*                />*/}
                                            {/*            </div>*/}
                                            {/*        )}*/}
                                            {/*    </Draggable>*/}
                                            {/*))}*/}
                                            {/*{provided.placeholder}*/}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
                <Stack justify="space-between" style={{ width: "100%" }}>
                    <FieldMappingDropdown
                        fields={meta.data.fields}
                        allowedFieldFilter={allowedFieldFilter}
                        onSelect={(f) => {
                            setSelectedFields((s) => [...s, {...f, __column: 0} as ColumnField]);
                        }}
                        selectedNames={selectedFields.map((f) => f.name)}
                    />
                    {columns && (
                        <Stack align="center" gap={6}>
                            <span style={{ fontSize: "12px" }}>Number of columns</span>
                            <FieldMappingColumnsDropdown onSelect={setColumnCount} value={1} />
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </DragDropContext>
    );
};
