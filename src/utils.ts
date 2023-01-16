import {
  AccountLayout,
  ContactLayout,
  LeadLayout,
  TaskLayout,
  OpportunityLayout,
  Settings,
  NoteLayout,
  EventLayout,
} from "./types";
import { match } from "ts-pattern";
import defaultContactLayout from "./resources/default_layout/contact.json";
import defaultNoteLayout from "./resources/default_layout/note.json";
import defaultOpportunityLayout from "./resources/default_layout/opportunity.json";
import defaultLeadLayout from "./resources/default_layout/lead.json";
import defaultTaskLayout from "./resources/default_layout/task.json";
import defaultEventLayout from "./resources/default_layout/event.json";
import defaultAccountLayout from "./resources/default_layout/account.json";
import {
  HomeLayout,
  LayoutType,
  ListLayout,
  ViewLayout,
} from "./screens/admin/types";

export const getObjectPermalink = (
  settings: Settings | null | undefined,
  path: string
) => (settings ? `${settings.salesforce_instance_url}${path}` : "#");

export function getScreenLayout(
  settings: Settings | undefined,
  object: string,
  screen: "home"
): HomeLayout;
export function getScreenLayout(
  settings: Settings | undefined,
  object: string,
  screen: "list"
): ListLayout;
export function getScreenLayout(
  settings: Settings | undefined,
  object: string,
  screen: "view"
): ViewLayout;
export function getScreenLayout(
  settings: Settings | undefined,
  object: string,
  screen: "home" | "list" | "view"
): LayoutType | null {
  return match([object, screen])
    .with(["Contact", "home"], () => {
      const layout: ContactLayout = settings?.mapping_contact
        ? JSON.parse(settings.mapping_contact)
        : defaultContactLayout;
      return layout.home;
    })
    .with(["Contact", "view"], () => {
      const layout: ContactLayout = settings?.mapping_contact
        ? JSON.parse(settings.mapping_contact)
        : defaultContactLayout;
      return layout.view;
    })
    .with(["Note", "list"], () => {
      const layout: NoteLayout = settings?.mapping_note
        ? JSON.parse(settings.mapping_note)
        : defaultNoteLayout;
      return layout.list;
    })
    .with(["Note", "view"], () => {
      const layout: NoteLayout = settings?.mapping_note
        ? JSON.parse(settings.mapping_note)
        : defaultNoteLayout;
      return layout.view;
    })
    .with(["Opportunity", "list"], () => {
      const layout: OpportunityLayout = settings?.mapping_opportunity
        ? JSON.parse(settings.mapping_opportunity)
        : defaultOpportunityLayout;
      return layout.list;
    })
    .with(["Opportunity", "view"], () => {
      const layout: OpportunityLayout = settings?.mapping_opportunity
        ? JSON.parse(settings.mapping_opportunity)
        : defaultOpportunityLayout;
      return layout.view;
    })
    .with(["Lead", "home"], () => {
      const layout: LeadLayout = settings?.mapping_lead
        ? JSON.parse(settings.mapping_lead)
        : defaultLeadLayout;
      return layout.home;
    })
    .with(["Lead", "view"], () => {
      const layout: LeadLayout = settings?.mapping_lead
        ? JSON.parse(settings.mapping_lead)
        : defaultLeadLayout;
      return layout.view;
    })
    .with(["Account", "home"], () => {
      const layout: AccountLayout = settings?.mapping_account
        ? JSON.parse(settings.mapping_account)
        : defaultAccountLayout;
      return layout.home;
    })
    .with(["Account", "view"], () => {
      const layout: AccountLayout = settings?.mapping_account
        ? JSON.parse(settings.mapping_account)
        : defaultAccountLayout;
      return layout.view;
    })
    .with(["Task", "list"], () => {
      const layout: TaskLayout = settings?.mapping_task
        ? JSON.parse(settings.mapping_task)
        : defaultTaskLayout;

      return layout.list;
    })
    .with(["Task", "view"], () => {
      const layout: TaskLayout = settings?.mapping_task
        ? JSON.parse(settings.mapping_task)
        : defaultTaskLayout;

      return layout.list;
    })
    .with(["Event", "list"], () => {
      const layout: EventLayout = settings?.mapping_note
        ? JSON.parse(settings.mapping_note)
        : defaultEventLayout;
      return layout.list;
    })
    .with(["Event", "view"], () => {
      const layout: EventLayout = settings?.mapping_note
        ? JSON.parse(settings.mapping_note)
        : defaultEventLayout;
      return layout.list;
    })
    .otherwise(() => null);
}
export const mapErrorMessage = (error: Error): string | null => {
  const parsedErr = JSON.parse(error.message) as {
    status: number;
    message: string;
  };
  const parsedSalesforceErr = JSON.parse(parsedErr.message) as {
    errorCode: string;
    fields: string[];
    message: string;
  }[];
  console.log(parsedSalesforceErr);
  return parsedSalesforceErr.reduce((acc, curr) => {
    return (
      acc +
      match([curr.message])
        .with(["Event duration cannot be negative"], () => {
          return "The dates are invalid, perhaps you have set the start date after the end date?\n\n";
        })
        .otherwise(() => {
          return match([curr.errorCode, curr.fields])
            .with(["REQUIRED_FIELD_MISSING", ["ActivityDateTime"]], () => {
              return `Please set a start date.\n\n`;
            })
            .with(["REQUIRED_FIELD_MISSING", ["DurationInMinutes"]], () => {
              return `Please set an end date.\n\n`;
            })
            .otherwise(() => {
              return `${curr.message}\n\n`;
            });
        })
    );
  }, "");
};
