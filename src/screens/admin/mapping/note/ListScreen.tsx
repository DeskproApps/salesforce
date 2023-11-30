import { Stack, H1, P1 } from "@deskpro/app-sdk";
import { QueryKey } from "../../../../query";
import { getObjectMetaPreInstalled } from "../../../../api/preInstallationApi";
import { PropertyLayout } from "../../../../components/Mapper/PropertyLayout";
import { FieldProperty, ListLayout } from "../../types";
import { useAdminQuery } from "../../hooks";
import { fieldToPropertyMapper } from "../../utils";
import { useCallback, useEffect, useState } from "react";

type ListScreenProps = {
  onChange: (layout: ListLayout) => void;
  value?: ListLayout;
};

export const ListScreen = ({
  onChange,
  value = { root: [] },
}: ListScreenProps) => {
  const meta = useAdminQuery(
    [QueryKey.ADMIN_OBJECT_META, "Note"],
    (client, settings) => getObjectMetaPreInstalled(client, settings, "Note")
  );

  const [layout, setLayout] = useState<ListLayout>(value);

  useEffect(() => {
    onChange(layout);
  }, [layout, onChange]);

  const setRootLayout = useCallback(
    (properties) => setLayout((layout) => ({ ...layout, root: properties })),
    []
  );

  if (!meta.isSuccess) {
    return null;
  }

  const contactFieldOptions = meta.data.fields.map(fieldToPropertyMapper);

  return (
    <Stack gap={22} vertical>
      <Stack gap={6} style={{ width: "100%" }} vertical>
        <H1>Note Details</H1>
        <P1>Fields</P1>
        <PropertyLayout<FieldProperty>
          options={contactFieldOptions}
          propertyId={(option) => option.name}
          propertyLabel={(option) => option.label}
          onChange={setRootLayout}
          maxColumns={2}
          value={value.root}
        />
      </Stack>
    </Stack>
  );
};
