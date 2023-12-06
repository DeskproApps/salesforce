import {
  HorizontalDivider,
  LoadingSpinner,
  Property,
  PropertyRow,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  H3,
} from "@deskpro/app-sdk";
import { AnyIcon, Button, Checkbox, Input, Stack } from "@deskpro/deskpro-ui";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/debounce";
import { useLinkContact } from "../../hooks/link";
import { Title } from "../../styles";
import { getContactsByEmails } from "../../api/api";
import { useQueryWithClient } from "../../hooks";

export const LinkContact = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const { linkContact } = useLinkContact();
  const navigate = useNavigate();

  const { debouncedValue: debouncedText } = useDebounce(prompt, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Link Contact");

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("plusButton");

    client.deregisterElement("menuButton");
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  const contactsQuery = useQueryWithClient(
    ["getContactsByEmail", debouncedText],
    (client) => getContactsByEmails(client, [debouncedText]),
    {
      enabled: debouncedText.length > 2,
    }
  );

  const contacts = contactsQuery.data;

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Stack vertical gap={6} style={{ width: "100%" }}>
        <Input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Enter Email Address"
          type="text"
          leftIcon={faMagnifyingGlass as AnyIcon}
        />
        <Stack vertical style={{ width: "100%" }} gap={5}>
          <Stack
            style={{ width: "100%", justifyContent: "space-between" }}
            gap={5}
          >
            <Button
              onClick={() => selectedContact && linkContact(selectedContact)}
              disabled={selectedContact == null}
              text="Link Contact"
            ></Button>
            <Button
              disabled={selectedContact == null}
              text="Cancel"
              intent="secondary"
              onClick={() => setSelectedContact(null)}
            ></Button>
          </Stack>
          <HorizontalDivider />
        </Stack>
        {contactsQuery.isFetching ? (
          <LoadingSpinner />
        ) : contactsQuery.isSuccess && contacts?.length !== 0 ? (
          <Stack vertical gap={5} style={{ width: "100%" }}>
            {contacts?.map((contact, i) => {
              return (
                <Stack key={i} gap={6} style={{ width: "100%" }}>
                  <Stack style={{ marginTop: "2px" }}>
                    <Checkbox
                      checked={selectedContact === contact.Id}
                      onChange={() => {
                        if (selectedContact == null) {
                          setSelectedContact(contact.Id);
                        } else {
                          setSelectedContact(null);
                        }
                      }}
                    ></Checkbox>
                  </Stack>
                  <Stack style={{ width: "100%" }} vertical gap={5} key={i}>
                    <H3>{contact.Name}</H3>
                    <PropertyRow>
                      <Property title={"Email"}>{contact.Email}</Property>
                      <Property title={"Phone"}>{contact.Phone}</Property>
                    </PropertyRow>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          contactsQuery.isSuccess && <Title>No Contacts Found.</Title>
        )}
      </Stack>
    </Stack>
  );
};
