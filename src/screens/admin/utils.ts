import {Field, ObjectMeta, ObjectType} from "../../api/types";
import {FieldProperty, LinkedObjects, ObjectProperty} from "./types";

export const getFieldByName = (meta: ObjectMeta, name: string): Field|null => meta.fields.filter((f) => f.name === name)[0] ?? null;

export const fieldToPropertyMapper = (field: Field): FieldProperty => ({
    name: field.name,
    label: field.label,
});

export const linkedObjectsToProperties = (linkedObjects: LinkedObjects): ObjectProperty[] => Object.keys(linkedObjects).map((name) => ({
    name: name,
    label: linkedObjects[name][0],
    object: linkedObjects[name][1],
}));
