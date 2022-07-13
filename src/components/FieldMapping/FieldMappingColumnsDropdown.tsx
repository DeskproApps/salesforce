import { DivAsInput, Dropdown, DropdownItemType } from "@deskpro/app-sdk";
import { faExternalLinkAlt, faCheck, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { DropdownValueType } from "@deskpro/deskpro-ui";
import { useState } from "react";

const columnCounts = [
    1,
    2,
];

type FieldMappingColumnsDropdownProps = {
    value: number;
    onSelect: (count: number) => void;
};

export const FieldMappingColumnsDropdown = ({ value, onSelect }: FieldMappingColumnsDropdownProps) => {
    const [currentSelection, setCurrentSelection] = useState<number>(value);

    const options = columnCounts
        .map<DropdownItemType<string>>((count) => ({
            key: count.toString(),
            label: count.toString(),
            type: "value",
            value: count.toString(),
        }))
    ;

    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            options={options}
            hideIcons
            onSelectOption={(selected: DropdownValueType<string>) => {
                onSelect(parseInt(selected.value));
                setCurrentSelection(parseInt(selected.value));
            }}
        >
            {({ targetProps, inputRef } ) => (
                <div style={{ width: "50px" }}>
                    <DivAsInput
                        ref={inputRef}
                        {...targetProps}
                        value={currentSelection}
                        inputsize="small"
                        type="text"
                        rightIcon={faCaretDown}
                    />
                </div>
            )}
        </Dropdown>
    );
};
