import {HomeLayout, ListLayout, ViewLayout} from "./screens/admin/types";

export interface Settings {
    client_key?: string;
    client_secret?: string;
    salesforce_instance_url?: string;
    global_access_token?: string;
    mapping_contact?: string;
}

export type ContactLayout = {
    type: "Contact";
    home: HomeLayout;
    view: ViewLayout;
};

export type OpportunityLayout = {
    type: "Opportunity";
    home: HomeLayout;
    list: ListLayout;
    view: ViewLayout;
};

export type Layout = ContactLayout | OpportunityLayout; // todo: write others
