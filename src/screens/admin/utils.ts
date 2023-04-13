import { Field, ObjectMeta } from "../../api/types";
import { FieldProperty, ObjectProperty } from "./types";

export const getFieldByName = (meta: ObjectMeta, name: string): Field | null =>
  meta.fields.filter((f) => f.name === name)[0] ?? null;

export const fieldToPropertyMapper = (field: Field): FieldProperty => ({
  name: field.name,
  label: field.label,
});

export const linkedObjectsToProperties = (
  linkedObjects: {
    sobject: string;
    label: string;
    field: string;
    associationType: string;
  }[]
): ObjectProperty[] =>
  linkedObjects.map((obj) => ({
    name: obj.sobject,
    label: obj.label,
    object: obj.sobject,
    field: obj.field,
    associationType: obj.associationType,
  }));
