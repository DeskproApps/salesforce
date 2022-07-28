import {HomeLayout, ListLayout, ViewLayout} from "./screens/admin/types";

export interface Settings {
    client_key?: string;
    client_secret?: string;
    salesforce_instance_url?: string;
    global_access_token?: string;
    mapping_contact?: string;
    mapping_note?: string;
    mapping_opportunity?: string;
}

export type ContactLayout = {
    type: "Contact";
    home: HomeLayout;
    view: ViewLayout;
};

export type OpportunityLayout = {
    type: "Opportunity";
    list: ListLayout;
    view: ViewLayout;
};

export type NoteLayout = {
    type: "Note";
    list: ListLayout;
    view: ViewLayout;
};

export type Layout = ContactLayout | OpportunityLayout | NoteLayout; // todo: write others
