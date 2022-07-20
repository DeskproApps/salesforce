import {Field, ObjectType} from "../../api/types";
import {FieldProperty, LinkedObjects, ObjectProperty} from "./types";

export const fieldToPropertyMapper = (field: Field): FieldProperty => ({ name: field.name, label: field.label });

export const linkedObjectsToProperties = (linkedObjects: LinkedObjects): ObjectProperty[] => Object.keys(linkedObjects).map((name, idx) => ({
    name: name as ObjectType,
    label: `${idx + 1}. ${linkedObjects[name]}`,
}));
