import {ObjectType} from "../../api/types";
import {Properties} from "../../components/Mapper/PropertyLayout";

export type FieldProperty = {
    name: string;
    label: string;
};

export type ObjectProperty = {
    name: ObjectType;
    label: string;
};

export type LinkedObjects = Record<string, string>;

export type HomeLayout = {
    root: Properties<FieldProperty>;
    objects: Properties<ObjectProperty>;
    [object: string]: Properties<FieldProperty>;
};

export type ViewLayout = {
    root: Properties<FieldProperty>;
};
