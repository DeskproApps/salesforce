import {ContactLayout, NoteLayout, OpportunityLayout, Settings} from "./types";
import { match } from "ts-pattern";
import defaultContactLayout from "./resources/default_layout/contact.json";
import defaultNoteLayout from "./resources/default_layout/note.json";
import defaultOpportunityLayout from "./resources/default_layout/opportunity.json";
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
        .otherwise(() => null)
    ;
}
