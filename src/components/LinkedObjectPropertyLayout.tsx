import { H1, P1, Stack } from "@deskpro/app-sdk";
import { Properties, PropertyLayout } from "./Mapper/PropertyLayout";
import { FieldProperty } from "../screens/admin/types";
import { useAdminQuery } from "../screens/admin/hooks";
import { QueryKey } from "../query";
import { getObjectMetaPreInstalled } from "../api/preInstallationApi";
import { fieldToPropertyMapper } from "../screens/admin/utils";
import { useCallback } from "react";

type LinkedObjectPropertyLayoutProps = {
  label: string;
  name: string;
  object: string;
  onChange: (
    properties: Properties<FieldProperty>,
    name: string,
    object: string
  ) => void;
  value?: Properties<FieldProperty>;
};

export const LinkedObjectPropertyLayout = ({
  object,
  name,
  label,
  onChange,
  value,
}: LinkedObjectPropertyLayoutProps) => {
  const meta = useAdminQuery(
    [QueryKey.OBJECT_META, object],
    (client, settings) => getObjectMetaPreInstalled(client, settings, object)
  );

  const onPropsChange = useCallback(
    (props: Properties<FieldProperty>) => onChange(props, name, object),
    [name, object, onChange]
  );

  if (!meta.isSuccess) {
    return null;
  }

  const fieldOptions = meta.data.fields.map(fieldToPropertyMapper);

  return (
    <Stack gap={6} style={{ width: "100%" }} vertical>
      <H1>{label}</H1>
      <P1>Fields</P1>
      <PropertyLayout<FieldProperty>
        options={fieldOptions}
        propertyId={(option) => option.name}
        propertyLabel={(option) => option.label}
        onChange={onPropsChange}
        maxColumns={2}
        value={value}
      />
    </Stack>
  );
};
