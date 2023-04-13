import { Properties } from "../../components/Mapper/PropertyLayout";

export type FieldProperty = {
  name: string;
  label: string;
};

export type ObjectProperty = {
  name: string;
  label: string;
  object: string;
  field: string;
  associationType: string;
};

export type LinkedObjects = Record<string, [string, string]>;

export type HomeLayout = {
  root: Properties<FieldProperty>;
  objects: Record<string, Properties<FieldProperty>>;
  objects_order: Properties<ObjectProperty>;
};

export type ListLayout = {
  root: Properties<FieldProperty>;
};

export type ViewLayout = {
  root: Properties<FieldProperty>;
};

export type LayoutType = HomeLayout | ListLayout | ViewLayout;
