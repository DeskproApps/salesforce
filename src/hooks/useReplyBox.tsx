import { useMemo, useCallback, useContext, createContext } from "react";
import { get, size, map, has, truncate } from "lodash";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { postData } from "../api/api";
import { capitalize } from "../utils";
import { APP_PREFIX } from "../constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (userEmail: string, selected: boolean, type: ReplyBoxType) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (userEmail: string, type: ReplyBoxType) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (userEmail: string, type: ReplyBoxType) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
  setSelectionState: SetSelectionState,
  getSelectionState: GetSelectionState,
  deleteSelectionState: DeleteSelectionState,
};

const isEmail = (type: ReplyBoxType): boolean => (type === "email");

const storeKey = (type: ReplyBoxType) => (userEmail: string) => {
  return `${APP_PREFIX}/${type}/user/${userEmail}`.toLowerCase();
};

const getStore = {
  note: storeKey("note"),
  email: storeKey("email"),
};

const registerTargetAction = (type: "email"|"note") => (
  client: IDeskproClient,
  userEmail: string,
): void|Promise<void> => {
  const actionName = `${APP_PREFIX}ReplyBox${capitalize(type)}Additions`;
  const actionType = isEmail(type) ? "reply_box_email_item_selection" : "reply_box_note_item_selection";
  const key = getStore[type];

  if (!userEmail) {
    return client.deregisterTargetAction(actionName);
  }

  return client.getState<{ selected: boolean }>(key(userEmail))
    .then(() => {
      return client.registerTargetAction(actionName, actionType, {
        title: "Add to Salesforce",
        payload: [{
          id: userEmail,
          title: userEmail,
          selected: true,
        }],
      });
    });
};

const registerReplyBoxNotesAdditionsTargetAction = registerTargetAction("note");

const registerReplyBoxEmailsAdditionsTargetAction = registerTargetAction("email");

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
  setSelectionState: () => {},
  getSelectionState: () => {},
  deleteSelectionState: () => {},
});

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const userEmail = context?.data?.user.primaryEmail;
  const isCommentOnNote = context?.settings?.default_comment_on_ticket_note;
  const isCommentOnEmail = context?.settings?.default_comment_on_ticket_reply;

  const setSelectionState: SetSelectionState = useCallback((userEmail, selected, type) => {
    if (!client) {
      return;
    }

    if (type === "note" && isCommentOnNote) {
      return client.setState(getStore.note(userEmail), { id: userEmail, selected })
        .then(() => registerReplyBoxNotesAdditionsTargetAction(client, userEmail))
        .catch(() => {})
    }

    if (type === "email" && isCommentOnEmail) {
      return client.setState(getStore.email(userEmail), { id: userEmail, selected })
        .then(() => registerReplyBoxEmailsAdditionsTargetAction(client, userEmail))
        .catch(() => {})
    }
  }, [client, isCommentOnNote, isCommentOnEmail]);

  const getSelectionState: GetSelectionState = useCallback((userEmail, type) => {
    if (!client) {
      return
    }

    return client?.getState<string>(getStore[type](userEmail))
  }, [client]);

  const deleteSelectionState: DeleteSelectionState = useCallback((userEmail, type) => {
    if (!client) {
      return;
    }


    return client.deleteState(getStore[type](userEmail))
      .then(() => {
        const register = (type === "email") ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;
        return register(client, userEmail);
      })
  }, [client]);

  useInitialisedDeskproAppClient((client) => {
    if (isCommentOnNote && userEmail) {
      registerReplyBoxNotesAdditionsTargetAction(client, userEmail);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
    }

    if (isCommentOnEmail && userEmail) {
      registerReplyBoxEmailsAdditionsTargetAction(client, userEmail);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
    }
  }, [userEmail, isCommentOnNote, isCommentOnEmail]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => {
    match<string>(action.name)
      .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
        const email = action.payload.email;

        if (!userEmail || !email || !client) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(getStore.email("*"))
          .then(() => postData(client, "Note", { Body: email }))
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
        const note = action.payload.note;

        if (!userEmail || !note || !client) {
          return;
        }

        client.setBlocking(true);
        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(getStore.note("*"))
          .then(() => postData(client, "Note", { Body: note }))
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          client?.setState(getStore.email(userEmail), { id: selection.id, selected: selection.selected })
            .then((result) => {
              if (result.isSuccess) {
                registerReplyBoxEmailsAdditionsTargetAction(client, userEmail);
              }
            });
        })
      })
      .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          client?.setState(getStore.note(userEmail), { id: selection.id, selected: selection.selected })
            .then((result) => {
              if (result.isSuccess) {
                registerReplyBoxNotesAdditionsTargetAction(client, userEmail);
              }
            });
        })
      })
      .run()
  }, 200 );

  useDeskproAppEvents({
    onTargetAction: debounceTargetAction,
  }, [context?.data]);

  return (
    <ReplyBoxContext.Provider value={{
      setSelectionState,
      getSelectionState,
      deleteSelectionState,
    }}>
      {children}
    </ReplyBoxContext.Provider>
  );
};

export { useReplyBox, ReplyBoxProvider };
