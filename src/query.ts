import { QueryClient } from "react-query";

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false,
    },
  },
});

export enum QueryKey {
  USER_CONTACTS_BY_EMAIL = "user_contacts_by_emails",
  USER_LEADS_BY_EMAIL = "user_leads_by_emails",
  USER_ACCOUNT_BY_ID = "user_account_by_id",
  USER_ACCOUNT_OWNER_BY_ID = "user_account_owner_by_id",
  ORG_ACCOUNTS_BY_NAME = "org_accounts_by_name",
  ORG_ACCOUNT_OWNER_BY_ID = "org_account_owner_by_id",
  ADMIN_OBJECT_META = "admin_object_meta",
  QUERYABLE_OBJECTS = "queryable_objects",

  OPPORTUNITY_BY_ID = "opportunity_by_id",
  ACTIVITY_BY_ID = "activity_by_id",
  NOTE_BY_ID = "note_by_id",
  OPPORTUNITY_METADATA = "opportunity_metadata",
  ACTIVITY_METADATA = "activity_metadata",
  OBJECT_META = "object_meta",
  USER_BY_ID = "user_by_id",
  ACCOUNT_BY_ID = "account_by_id",
  CONTACT_BY_ID = "contact_by_id",
  OPPORTUNITIES_BY_CONTACT_ID = "opportunities_by_contact_id",
  NOTES_BY_PARENT_ID = "notes_by_parent_id",
  CONTACT_ACTIVITY_HISTORY_BY_WHO_ID = "activity_history_by_who_id",
  ACTIVITIES_BY_WHO_ID = "activities_by_who_id",
  ACTIVITIES_BY_ACCOUNT_ID = "activities_by_account_id",
  OBJECTS_BY_FK = "objects_by_fk",
  OBJECT_BY_ID = "objects_by_id",
}
