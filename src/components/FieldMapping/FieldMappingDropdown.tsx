import { Button, Dropdown, DropdownItemType, DropdownTargetProps } from "@deskpro/app-sdk";
import { faExternalLinkAlt, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Field } from "../../api/types";
import { DropdownValueType } from "@deskpro/deskpro-ui";

type FieldMappingDropdownProps = {
    fields: Field[],
    onSelect: (field: Field) => void;
    fieldFilter: (field: Field) => boolean;
    selectedNames?: string[];
};

export const FieldMappingDropdown = ({ fields, fieldFilter, onSelect, selectedNames = [] }: FieldMappingDropdownProps) => {
    const [input, setInput] = useState<string>("");

    const options = fields
        .filter((field) => selectedNames.length === 0 || !selectedNames.includes(field.name))
        .filter(fieldFilter)
        .filter((field) => field.name.toLowerCase().includes(input.toLowerCase()))
        .map<DropdownItemType<string>>((field) => ({
            key: field.name,
            label: field.label,
            type: "value",
            value: field.name,
        }))
    ;

    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            inputValue={input}
            onInputChange={setInput}
            options={options}
            showInternalSearch
            hideIcons
            onSelectOption={(selected: DropdownValueType<string>) => {
                onSelect(fields.filter((f) => f.name === selected.value)[0] as Field);
            }}
        >
            {({ active, targetProps, targetRef }: DropdownTargetProps<HTMLButtonElement>) => (
                <Button ref={targetRef} {...targetProps} active={active} text="Add" icon={faPlus} intent="secondary" />
            )}
        </Dropdown>
    );
};
