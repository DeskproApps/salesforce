import React, { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, DropdownItemType, DropdownTargetProps, DropdownValueType, DivAsInput } from "@deskpro/deskpro-ui";
import {
    faCaretDown,
    faCheck,
    faExternalLinkAlt,
    faGripVertical,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { every, flatten, max, range, tap } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { useDrag, useDrop } from "react-dnd";
import * as S from "./styles";

export type Properties<T extends object> = PropertyRow<T>[];

export type PropertyRow<T extends object> = ({
    id: string;
    property: T;
}|null)[];

type MoveItem = (id: string, rowIdx: number, columnIdx: number) => void;

type OrderItem = (id: string, target: string, columnIdx: number, type: "before"|"after") => void;

type PropertyLayoutProps<T extends object> = {
    options: T[];
    propertyId: (option: T) => string;
    propertyLabel: (option: T) => string;
    maxColumns?: number;
    onChange?: (properties: Properties<T>) => void;
    emptyMessage?: string;
    value?: Properties<T>;
};

export function PropertyLayout<T extends object>({ options, propertyId, propertyLabel, onChange, value = [], emptyMessage = "Empty", maxColumns = 2 }: PropertyLayoutProps<T>) {
    const [optionSearch, setOptionSearch] = useState("");
    const [rows, setRows] = useState<Properties<T>>(value);

    const findOptionById = (id: string): T|null => options.filter((option) => propertyId(option) === id)[0] ?? null;

    const getColumnsMax = useCallback(
        (): number => max(rows.map((row) => row.length)) ?? 1,
        [rows])
    ;

    useEffect(() => {
        onChange && onChange(rows);
    }, [rows, onChange]);

    const dropdownOptions = options
        .filter((option) => !flatten(rows.map((column) => column)).filter((p) => p).map((p) => propertyId(p?.property as T)).includes(propertyId(option)))
        .filter((option) => propertyLabel(option).toLowerCase().includes(optionSearch.toLowerCase()))
        .map<DropdownItemType<string>>((option) => ({
            key: propertyId(option),
            label: propertyLabel(option),
            type: "value",
            value: propertyId(option),
        }))
    ;

    const columnOptions = range(1, maxColumns + 1)
        .map<DropdownItemType<string>>((option) => ({
            key: option.toString(),
            label: option.toString(),
            type: "value",
            value: option.toString(),
        }))
    ;

    const moveItem = useCallback<MoveItem>((id, rowIdx, columnIdx) => {
        const newRows = [...rows];
        let property = null;

        for (const [ri, row] of newRows.entries()) {
            for (const [pi, prop] of row.entries()) {
                if (prop && prop.id === id) {
                    property = prop;
                    newRows[ri][pi] = null;
                }
            }
        }

        newRows[rowIdx][columnIdx] = property;

        for (const [ri, row] of newRows.entries()) {
            if (every(row.map((item) => item === null))) {
                newRows.splice(ri, 1);
            }
        }

        for (const [ri, row] of newRows.entries()) {
            for (const c of range(getColumnsMax())) {
                if (row[c] === undefined) {
                    newRows[ri][c] = null;
                }
            }
        }

        setRows(newRows);
    }, [rows, setRows, getColumnsMax]);

    const orderItem = useCallback<OrderItem>((id, target, columnIdx, type) => {

        const newRows = [...rows];

        let property = null;

        let rem: number[]|null = null;
        let place: number|null = null;

        for (const [ri, row] of newRows.entries()) {
            for (const [pi, prop] of row.entries()) {
                if (prop && prop.id === id) {
                    property = prop;
                    rem = [ri, pi];
                }

                if (prop && prop.id === target) {
                    place = ri;
                }
            }
        }

        if (rem) {
            newRows[rem[0]][rem[1]] = null;
        }

        if (place !== null) {
            for (const [ri, row] of newRows.entries()) {
                if (every(row.map((item) => item === null))) {
                    newRows.splice(ri, 1);
                }
            }

            for (const [ri, row] of newRows.entries()) {
                for (const c of range(getColumnsMax())) {
                    if (row[c] === undefined) {
                        newRows[ri][c] = null;
                    }
                }
            }

            place = type === "before" ? place : place + 1;

            if (place < 0) {
                place = 0;
            }

            newRows.splice(place, 0, [property]);

            for (const [ri, row] of newRows.entries()) {
                for (const c of range(getColumnsMax())) {
                    if (row[c] === undefined) {
                        newRows[ri][c] = null;
                    }
                }
            }

            setRows(newRows);
        }

    }, [rows, setRows, getColumnsMax]);

    const deleteProperty = (rowIdx: number, columnIdx: number) => {
        setRows((rows) => {
            const newRows = [...rows];

            newRows[rowIdx][columnIdx] = null;

            for (const [ri, row] of newRows.entries()) {
                if (every(row.map((item) => item === null))) {
                    newRows.splice(ri, 1);
                }
            }

            for (const [ri, row] of newRows.entries()) {
                for (const c of range(getColumnsMax())) {
                    if (row[c] === undefined) {
                        newRows[ri][c] = null;
                    }
                }
            }

            return newRows;
        });
    };

    const updateColumns = (newColumnCount: number) => {
        const columns = getColumnsMax();

        if (newColumnCount === columns) {
            return;
        }

        if (newColumnCount > columns) {
            setRows((rows) => rows.map((row) => [...row, ...range(newColumnCount - columns).map(() => null)]));
        }

        if (newColumnCount < columns) {
            const indices = range(columns).slice(-(columns - newColumnCount));

            setRows((rows) => {
                const newRows = [...rows];
                const moves = [];

                for (const [ri, row] of newRows.entries()) {
                    for (const [ci, col] of row.entries()) {
                        if (indices.includes(ci)) {
                            if (col && col.property !== null) {
                                moves.push(col);
                            }
                            newRows[ri].splice(ci, 1);
                        }
                    }
                }

                newRows.push(...moves.map((move) => [move]));

                for (const [ri, row] of newRows.entries()) {
                    if (row.length === 1 && row[0] === null) {
                        newRows.splice(ri, 1);
                    }
                }

                let rem: number|null = null;

                for (const [ri, row] of newRows.entries()) {
                    if (every(row.map((item) => item === null))) {
                        rem = ri;
                    }
                }

                if (rem !== null) {
                    newRows.splice(rem, 1);
                }

                for (const [ri, row] of newRows.entries()) {
                    for (const c of range(getColumnsMax())) {
                        if (row[c] === undefined) {
                            newRows[ri][c] = null;
                        }
                    }
                }

                return newRows;
            });
        }
    };

    return (
        <S.Container>
            <S.Layout>
                {rows.length > 0 ? rows.map((row, rowIdx) => (
                    <S.Row key={rowIdx}>
                        {range(getColumnsMax()).map((columnIdx) => {
                            const property = row[columnIdx] ?? null;

                            if (property && property.property) {
                                return (
                                    <Item
                                        key={columnIdx}
                                        columnIdx={columnIdx}
                                        id={propertyId(property.property)}
                                        label={propertyLabel(property.property)}
                                        orderItem={orderItem}
                                        onDelete={() => deleteProperty(rowIdx, columnIdx)}
                                    />
                                );
                            }

                            return (
                                <Placeholder
                                    key={columnIdx}
                                    rowIdx={rowIdx}
                                    columnIdx={columnIdx}
                                    moveItem={moveItem}
                                />
                            );
                        })}
                    </S.Row>
                )) : <S.EmptyMessage>{emptyMessage}</S.EmptyMessage>}
            </S.Layout>
            <S.Controls>
                <S.ControlsStart>
                    <S.Control>
                        <Dropdown
                            fetchMoreText={"Fetch more"}
                            autoscrollText={"Autoscroll"}
                            selectedIcon={faCheck}
                            externalLinkIcon={faExternalLinkAlt}
                            placement="bottom-start"
                            inputValue={optionSearch}
                            onInputChange={setOptionSearch}
                            options={dropdownOptions}
                            showInternalSearch
                            hideIcons
                            onSelectOption={(selected: DropdownValueType<string>) => {
                                tap(
                                    findOptionById(selected.value),
                                    (option) => option && setRows((rows) => [
                                        ...rows,
                                        [{ id: propertyId(option), property: option }]
                                    ])
                                );

                                setRows((rows) => {
                                    const newRows = [...rows];

                                    for (const [ri, row] of newRows.entries()) {
                                        for (const c of range(getColumnsMax())) {
                                            if (row[c] === undefined) {
                                                newRows[ri][c] = null;
                                            }
                                        }
                                    }

                                    return newRows;
                                });
                            }}
                        >
                            {({ active, targetProps, targetRef }: DropdownTargetProps<HTMLButtonElement>) => (
                                <Button ref={targetRef} {...targetProps} active={active} text="Add" icon={faPlus} intent="secondary" />
                            )}
                        </Dropdown>
                    </S.Control>
                </S.ControlsStart>
                <S.ControlsEnd>
                    {(maxColumns > 1 && rows.length > 0) && (
                        <S.Control>
                            <S.ControlLabel>
                                Number of columns
                            </S.ControlLabel>
                            <Dropdown
                                fetchMoreText={"Fetch more"}
                                autoscrollText={"Autoscroll"}
                                selectedIcon={faCheck}
                                externalLinkIcon={faExternalLinkAlt}
                                placement="bottom-end"
                                options={columnOptions}
                                containerWidth={80}
                                onSelectOption={(selected: DropdownValueType<string>) => updateColumns(parseInt(selected.value))}
                                hideIcons
                            >
                                {({ targetProps, inputRef } ) => (
                                    <div style={{ width: "50px" }}>
                                        <DivAsInput
                                            ref={inputRef}
                                            {...targetProps}
                                            value={getColumnsMax()}
                                            inputsize="small"
                                            rightIcon={faCaretDown}
                                        />
                                    </div>
                                )}
                            </Dropdown>
                        </S.Control>
                    )}
                </S.ControlsEnd>
            </S.Controls>
        </S.Container>
    );
}

type DragItem = {
    id: string;
};

type ItemProps = {
    id: string;
    label: string;
    columnIdx: number;
    orderItem: OrderItem;
    onDelete: (id: string) => void;
};

const Item = ({ id, label, orderItem, onDelete, columnIdx }: ItemProps) => {
    const { theme } = useDeskproAppTheme();

    const [{ isDragging }, dragRef] = useDrag<DragItem, unknown, { isDragging: boolean; }>({
        type: 'item',
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOverStart }, dropRefStart] = useDrop<DragItem, unknown, { isOverStart: boolean; }>({
        accept: "item",
        drop: ({ id: src }) => orderItem(src, id, columnIdx, "before"),
        collect: (monitor) => ({
            isOverStart: monitor.isOver()
        })
    });

    const [{ isOverEnd }, dropRefEnd] = useDrop<DragItem, unknown, { isOverEnd: boolean; }>({
        accept: "item",
        drop: ({ id: src }) => orderItem(src, id, columnIdx, "after"),
        collect: (monitor) => ({
            isOverEnd: monitor.isOver()
        })
    });

    return (
        <S.ItemWrapper>
            {columnIdx === 0 ? <S.ItemOrderDrop ref={dropRefStart} isOver={isOverStart} /> : <S.ItemOrderDropDummy />}
            <S.Item ref={dragRef} isDragging={isDragging}>
                <S.ItemStart>
                    <FontAwesomeIcon
                        icon={faGripVertical}
                        color={theme.colors.grey40}
                        className="grab"
                    />
                    <span>{label}</span>
                </S.ItemStart>
                <S.ItemEnd>
                    <FontAwesomeIcon
                        icon={faTrash}
                        color={theme.colors.grey40}
                        className="trash"
                        onClick={() => onDelete(id)}
                    />
                </S.ItemEnd>
            </S.Item>
            {columnIdx === 0 ? <S.ItemOrderDrop ref={dropRefEnd} isOver={isOverEnd} /> : <S.ItemOrderDropDummy />}
        </S.ItemWrapper>
    );
};

type PlaceholderProps = {
    rowIdx: number;
    columnIdx: number;
    moveItem: MoveItem;
};

const Placeholder = ({ rowIdx, columnIdx, moveItem }: PlaceholderProps) => {
    const [{ isOver }, dropRef] = useDrop<DragItem, unknown, { isOver: boolean; }>({
        accept: "item",
        drop: ({ id }) => moveItem(id, rowIdx, columnIdx),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <S.ItemPlaceholder ref={dropRef} isOver={isOver} />
    );
};