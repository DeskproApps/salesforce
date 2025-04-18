import { Dropdown, DropdownItemType, Input } from "@deskpro/deskpro-ui";
import {
    LoadingSpinner,
    useDeskproAppTheme,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";
import { useState } from "react";
import { getAccountsByName } from "../api/api";
import { Container } from "../components/Container/Container";
import { useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { AccountScreen } from "../screens/home/Account/AccountScreen";
import { Settings } from "../types";

export const Organization = () => {
    const { context } = useDeskproLatestAppContext<{ user: { emails: string[] }, organisation?: { name: string } }, Settings>();
    const { theme } = useDeskproAppTheme();

    const [selectedObjectId, setSelectedObjectId] = useState<string>("");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        registerElement("refresh", { type: "refresh_button" });
        deRegisterElement("salesforcePlusButton");
        deRegisterElement("salesforceEditButton");
    });

    const name = context?.data?.organisation?.name as string;

    const accounts = useQueryWithClient(
        [QueryKey.ORG_ACCOUNTS_BY_NAME, name],
        (client) => getAccountsByName(client, name),
        { enabled: !! name }
    );

    useInitialisedDeskproAppClient((client) => {
        client.setBadgeCount((accounts?.data ?? []).length);
        client?.setTitle("Account");
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
