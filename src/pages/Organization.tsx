import {
    Dropdown,
    DropdownItemType, Input,
    LoadingSpinner, useDeskproAppClient, useDeskproAppTheme,
    useDeskproElements,
    useDeskproLatestAppContext, useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import { useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { getAccountsByName } from "../api/api";
import { AccountScreen } from "../screens/home/Account/AccountScreen";
import { Container } from "../components/Container/Container";
import { useState } from "react";
import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {orderBy} from "lodash";

export const Organization = () => {
    const { context } = useDeskproLatestAppContext();
    const { theme } = useDeskproAppTheme();
    const { client } = useDeskproAppClient();

    const [selectedObjectId, setSelectedObjectId] = useState<string>("");

    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    const name = context?.data?.organisation?.name as string;

    const accounts = useQueryWithClient(
        [QueryKey.ORG_ACCOUNTS_BY_NAME, name],
        (client) => getAccountsByName(client, name),
        { enabled: !! name }
    );

    useInitialisedDeskproAppClient((client) => {
        client.setBadgeCount((accounts?.data ?? []).length);
    }, [accounts.data]);

    if (!name) {
        return null;
    }

    if (!accounts.isSuccess) {
        return <LoadingSpinner />;
    }

    if (!accounts.data.length) {
        return (
            <Container>
                <em style={{ color: theme.colors.grey40, fontSize: "12px" }}>
                    No Matching Salesforce Records Found
                </em>
            </Container>
        );
    }

    if (accounts.data.length === 1) {
        client?.setTitle("Account");
        return <AccountScreen account={accounts.data[0]} />
    }

    const accountsOrdered = orderBy(accounts.data, (item) => new Date(item.LastModifiedDate), "asc");

    const options: DropdownItemType<string>[] = accountsOrdered.map((object) => ({
        key: object.Id,
        label: object.Name,
        type: "value" as const,
        value: object.Id,
    } as DropdownItemType<string>));

    const selectedObject = accountsOrdered.filter((object) => object.Id === selectedObjectId)[0] ?? (
        accountsOrdered[0]
    );

    return (
        <>
            <Container>
                <Dropdown
                    fetchMoreText={"Fetch more"}
                    autoscrollText={"Autoscroll"}
                    selectedIcon={faCheck}
                    externalLinkIcon={faExternalLinkAlt}
                    placement="bottom-start"
                    inputValue={selectedObject ? selectedObject.Name : ""}
                    onInputChange={setSelectedObjectId}
                    options={options}
                    onSelectOption={(option) => {
                        option.value && setSelectedObjectId(option.value);
                    }}
                    hideIcons
                >
                    {({ inputProps, inputRef }) => (
                        <Input ref={inputRef} {...inputProps} rightIcon={faCaretDown} variant="inline" />
                    )}
                </Dropdown>
            </Container>
            <AccountScreen account={selectedObject} />
        </>
    );
};
