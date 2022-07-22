import {Properties} from "../../components/Mapper/PropertyLayout";

export type FieldProperty = {
    name: string;
    label: string;
};

export type ObjectProperty = {
    name: string;
    label: string;
    object: string;
};

export type LinkedObjects = Record<string, [string, string]>;

export type HomeLayout = {
    root: Properties<FieldProperty>;
    objects: Properties<ObjectProperty>;
    [object: string]: Properties<FieldProperty>;
};

export type ListLayout = {
    root: Properties<FieldProperty>;
};

export type ViewLayout = {
    root: Properties<FieldProperty>;
};

export type LayoutType = HomeLayout | ListLayout | ViewLayout;
