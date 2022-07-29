import {AccountLayout, ContactLayout, LeadLayout, NoteLayout, OpportunityLayout, Settings} from "./types";
import { match } from "ts-pattern";
import defaultContactLayout from "./resources/default_layout/contact.json";
import defaultNoteLayout from "./resources/default_layout/note.json";
import defaultOpportunityLayout from "./resources/default_layout/opportunity.json";
import defaultLeadLayout from "./resources/default_layout/lead.json";
import defaultAccountLayout from "./resources/default_layout/account.json";
import {HomeLayout, LayoutType, ListLayout, ViewLayout} from "./screens/admin/types";

export const getObjectPermalink = (settings: Settings|null|undefined, path: string) => settings ? `${settings.salesforce_instance_url}${path}` : '#';

export function getScreenLayout(settings: Settings|undefined, object: string, screen: "home"): HomeLayout;
export function getScreenLayout(settings: Settings|undefined, object: string, screen: "list"): ListLayout;
export function getScreenLayout(settings: Settings|undefined, object: string, screen: "view"): ViewLayout;
export function getScreenLayout(settings: Settings|undefined, object: string, screen: "home"|"list"|"view"): LayoutType|null {
    return match([object, screen])
        .with(["Contact", "home"], () => {
            const layout: ContactLayout = settings?.mapping_contact
                ? JSON.parse(settings.mapping_contact)
                : defaultContactLayout
            ;

            return layout.home;
        })
        .with(["Contact", "view"], () => {
            const layout: ContactLayout = settings?.mapping_contact
                ? JSON.parse(settings.mapping_contact)
                : defaultContactLayout
            ;

            return layout.view;
        })
        .with(["Note", "list"], () => {
            const layout: NoteLayout = settings?.mapping_note
                ? JSON.parse(settings.mapping_note)
                : defaultNoteLayout
            ;

            return layout.list;
        })
        .with(["Note", "view"], () => {
            const layout: NoteLayout = settings?.mapping_note
                ? JSON.parse(settings.mapping_note)
                : defaultNoteLayout
            ;

            return layout.view;
        })
        .with(["Opportunity", "list"], () => {
            const layout: OpportunityLayout = settings?.mapping_opportunity
                ? JSON.parse(settings.mapping_opportunity)
                : defaultOpportunityLayout
            ;

            return layout.list;
        })
        .with(["Opportunity", "view"], () => {
            const layout: OpportunityLayout = settings?.mapping_opportunity
                ? JSON.parse(settings.mapping_opportunity)
                : defaultOpportunityLayout
            ;

            return layout.view;
        })
        .with(["Lead", "home"], () => {
            const layout: LeadLayout = settings?.mapping_lead
                ? JSON.parse(settings.mapping_lead)
                : defaultLeadLayout
            ;

            return layout.home;
        })
        .with(["Lead", "view"], () => {
            const layout: LeadLayout = settings?.mapping_lead
                ? JSON.parse(settings.mapping_lead)
                : defaultLeadLayout
            ;

            return layout.view;
        })
        .with(["Account", "home"], () => {
            const layout: AccountLayout = settings?.mapping_account
                ? JSON.parse(settings.mapping_account)
                : defaultAccountLayout
            ;

            return layout.home;
        })
        .with(["Account", "view"], () => {
            const layout: AccountLayout = settings?.mapping_account
                ? JSON.parse(settings.mapping_account)
                : defaultAccountLayout
            ;

            return layout.view;
        })
        .otherwise(() => null)
    ;
}
