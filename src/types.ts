import { ObjectType } from "./api/types";

export interface Settings {
    client_key?: string;
    client_secret?: string;
    salesforce_instance_url?: string;
    global_access_token?: string;
}

export type ViewType = "Home" | "List" | "View";

export interface FieldMap {
    sections: Record<ObjectType, FieldMapViews>;
}

export interface FieldMapViews {
    views: Record<ViewType, FieldMapObjects>;
}

export interface FieldMapObjects {
    objects: Record<ObjectType, FieldMapFields>;
}

export interface FieldMapFields {
    fields: Record<string, FieldMapField>;
    columns: number;
}

export interface FieldMapField {
    order: number;
}
