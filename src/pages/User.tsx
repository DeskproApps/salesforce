import {
  Dropdown,
  DropdownItemType,
  Input,
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproAppTheme,
  useDeskproElements,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  faCaretDown,
  faCheck,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import {
  getContactByEmail,
  getContactById,
  getLeadsByEmails,
} from "../api/api";
import { Contact, Lead, ObjectType } from "../api/types";
import { Container } from "../components/Container/Container";
import { useQueryWithClient } from "../hooks";
import { useLinkContact } from "../hooks/link";
import { QueryKey } from "../query";
import { ContactScreen } from "../screens/home/Contact/ContactScreen";
import { LeadScreen } from "../screens/home/Lead/LeadScreen";

export const User = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { theme } = useDeskproAppTheme();
  const { unlinkContact, getLinkedContact } = useLinkContact();
  const navigate = useNavigate();

  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [contactId, setContactId] = useState<string | null | undefined>(
    undefined
  );

  useDeskproElements(({ registerElement, deRegisterElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    deRegisterElement("salesforcePlusButton");
    deRegisterElement("salesforceEditButton");

    registerElement("menuButton", {
      type: "menu",
      items: [
        {
          title: "Unlink Contact",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "menuButton":
          unlinkContact().then(() => navigate("/findOrCreate"));
      }
    },
  });

  const emails: string[] = context?.data?.user?.emails ?? [];

  const contacts = useQueryWithClient<Contact>(
    [QueryKey.USER_CONTACTS_BY_EMAIL, JSON.stringify(contactId), ...emails],
    (client) =>
      contactId === null
        ? getContactByEmail(client, emails[0])
        : getContactById(client, contactId as string),
    {
      onError: () => {
        navigate("/findOrCreate");
      },
      enabled: contactId !== undefined,
      onSuccess(data) {
        if (!data) {
          unlinkContact().then(() => navigate("/findOrCreate"));

          return;
        }
      },
      useErrorBoundary: false,
    }
  );

  useEffect(
    () => {
      (async () => {
        if (!context || !client) return;

        const linkedContact = await getLinkedContact();

        if (!linkedContact || linkedContact.length === 0) {
          return setContactId(null);
        }

        setContactId(linkedContact[0]);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context]
  );

  const leads = useQueryWithClient(
    [QueryKey.USER_LEADS_BY_EMAIL, ...emails],
    (client) => getLeadsByEmails(client, emails)
  );

  const leadsAndContacts = [
    ...(leads.data ?? []),
    ...(contacts.data ? [contacts.data] : []),
  ];

  useInitialisedDeskproAppClient(
    (client) => {
      client.setBadgeCount(leadsAndContacts.length);
    },
    [leadsAndContacts]
  );

  if (!contacts.isSuccess || !leads.isSuccess) {
    return <LoadingSpinner />;
  }

  if (!leadsAndContacts.length) {
    return (
      <Container>
        <em style={{ color: theme.colors.grey40, fontSize: "12px" }}>
          No Matching Salesforce Records Found
        </em>
      </Container>
    );
  }

  if (leadsAndContacts.length === 1) {
    if (leads.data.length) {
      client?.setTitle("Lead");
      return <LeadScreen lead={leads.data[0]} />;
    } else if (contacts.data) {
      client?.setTitle("Contact");
      return <ContactScreen contact={contacts.data} />;
    }
  }

  const options: DropdownItemType<string>[] = leadsAndContacts.map(
    (object) =>
      ({
        key: object.Id,
        label: `${object.FirstName} ${object.LastName} (${object.attributes.type})`,
        type: "value" as const,
        value: object.Id,
      } as DropdownItemType<string>)
  );

  const selectedObject: Lead | Contact =
    leadsAndContacts.filter((object) => object.Id === selectedObjectId)[0] ??
    contacts.data ??
    leads.data[0];

  client?.setTitle(selectedObject.attributes.type);

  return (
    <>
      <Container>
        <Dropdown
          fetchMoreText={"Fetch more"}
          autoscrollText={"Autoscroll"}
          selectedIcon={faCheck}
          externalLinkIcon={faExternalLinkAlt}
          placement="bottom-start"
          inputValue={
            selectedObject
              ? `${selectedObject.FirstName} ${selectedObject.LastName} (${selectedObject.attributes.type})`
              : ""
          }
          onInputChange={setSelectedObjectId}
          options={options}
          onSelectOption={(option) => {
            option.value && setSelectedObjectId(option.value);
          }}
          hideIcons
        >
          {({ inputProps, inputRef }) => (
            <Input
              ref={inputRef}
              {...inputProps}
              rightIcon={faCaretDown}
              variant="inline"
            />
          )}
        </Dropdown>
      </Container>
      {match<ObjectType>(selectedObject.attributes.type)
        .with("Lead", () => <LeadScreen lead={selectedObject as Lead} />)
        .with("Contact", () => (
          <ContactScreen contact={selectedObject as Contact} />
        ))
        .otherwise(() => null)}
    </>
  );
};
