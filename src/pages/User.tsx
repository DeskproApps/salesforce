import { Dropdown, DropdownItemType, Input } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  TargetAction,
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
import { useState } from "react";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  createUserComment,
  getContactsByEmails,
  getLeadsByEmails,
} from "../api/api";
import { Contact, Lead, ObjectType } from "../api/types";
import { Container } from "../components/Container/Container";
import { useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { ContactScreen } from "../screens/home/Contact/ContactScreen";
import { LeadScreen } from "../screens/home/Lead/LeadScreen";
import {
  registerReplyBoxEmailsAdditionsTargetAction,
  registerReplyBoxNotesAdditionsTargetAction,
  ticketReplyEmailsSelectionStateKey,
  ticketReplyNotesSelectionStateKey,
} from "../utils";

export const User = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { theme } = useDeskproAppTheme();

  const [selectedObjectId, setSelectedObjectId] = useState<string>("");

  useDeskproElements(({ registerElement, deRegisterElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    deRegisterElement("salesforcePlusButton");
    deRegisterElement("salesforceEditButton");
  });

  const emails: string[] = context?.data?.user?.emails ?? [];

  const contacts = useQueryWithClient(
    [QueryKey.USER_CONTACTS_BY_EMAIL, ...emails],
    (client) => getContactsByEmails(client, emails)
  );

  const leads = useQueryWithClient(
    [QueryKey.USER_LEADS_BY_EMAIL, ...emails],
    (client) => getLeadsByEmails(client, emails)
  );

  const leadsAndContacts = [...(leads.data ?? []), ...(contacts.data ?? [])];

  useInitialisedDeskproAppClient(
    (client) => {
      client.setBadgeCount(leadsAndContacts.length);
    },
    [leadsAndContacts]
  );

  const debounceTargetAction = useDebouncedCallback<
    (
      a: TargetAction<
        {
          id: string;
          selected: boolean;
        }[]
      >
    ) => void
  >((action: TargetAction) => {
    match<string>(action.name)
      .with("sfReplyBoxNoteAdditions", () => {
        console.log("a");

        (action.payload ?? []).forEach(
          (selection: { id: string; selected: boolean }) => {
            const ticketId = action.subject;
            if (context?.data.ticket.id) {
              client
                ?.setState(
                  ticketReplyNotesSelectionStateKey(ticketId, selection.id),
                  { id: selection.id, selected: selection.selected }
                )
                .then((result) => {
                  if (result.isSuccess) {
                    registerReplyBoxNotesAdditionsTargetAction(
                      client,
                      context.data.ticket.id,
                      leadsAndContacts
                    );
                  }
                });
            }
          }
        );
      })
      .with("sfReplyBoxEmailAdditions", () => {
        console.log("b");
        (action.payload ?? []).forEach(
          (selection: { id: string; selected: boolean }) => {
            const ticketId = action.subject;

            if (context?.data.ticket.id) {
              client
                ?.setState(
                  ticketReplyEmailsSelectionStateKey(ticketId, selection.id),
                  { id: selection.id, selected: selection.selected }
                )
                .then((result) => {
                  if (result.isSuccess) {
                    registerReplyBoxEmailsAdditionsTargetAction(
                      client,
                      context.data.ticket.id,
                      leadsAndContacts
                    );
                  }
                });
            }
          }
        );
      })
      .with("sfOnReplyBoxNote", () => {
        const ticketId = action.subject;
        const note = action.payload.note;

        if (!ticketId || !note || !client) {
          return;
        }

        if (ticketId !== context?.data.ticket.id) {
          return;
        }

        client.setBlocking(true);

        return Promise.all(
          leadsAndContacts.map((object) => {
            switch (object.attributes.type) {
              case "Lead":
                return createUserComment(client, object.Id, note);
              case "Contact":
                return createUserComment(client, object.Id, note);
            }
          })
        ).finally(() => client.setBlocking(false));
      })
      .with("sfOnReplyBoxEmail", () => {
        const ticketId = action.subject;
        const email = action.payload.email;

        if (!ticketId || !email || !client) {
          return;
        }

        if (ticketId !== context?.data.ticket.id) {
          return;
        }

        client.setBlocking(true);

        return Promise.all(
          leadsAndContacts.map((object) => {
            switch (object.attributes.type) {
              case "Lead":
                return createUserComment(client, object.Id, email);
              case "Contact":
                return createUserComment(client, object.Id, email);
            }
          })
        ).finally(() => client.setBlocking(false));
      })
      .run();
  }, 500);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!context || leadsAndContacts.length === 0) return;

      registerReplyBoxNotesAdditionsTargetAction(
        client,
        context?.data.user.id,
        leadsAndContacts
      );

      registerReplyBoxEmailsAdditionsTargetAction(
        client,
        context?.data.user.id,
        leadsAndContacts
      );
      const commentOnNote =
        context.settings?.default_comment_on_ticket_note === true;
      const commentOnReply =
        context.settings?.default_comment_on_ticket_reply === true;

      commentOnNote &&
        client.registerTargetAction("sfOnReplyBoxNote", "on_reply_box_note");
      commentOnReply &&
        client.registerTargetAction("sfOnReplyBoxEmail", "on_reply_box_email");
    },
    [context, leadsAndContacts]
  );

  useDeskproAppEvents({
    onTargetAction: (a) => debounceTargetAction(a as TargetAction),
  });

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
    } else if (contacts.data.length) {
      client?.setTitle("Contact");
      return <ContactScreen contact={contacts.data[0]} />;
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
    contacts.data[0] ??
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
