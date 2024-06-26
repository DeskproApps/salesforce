import { Stack, H1, P1 } from "@deskpro/deskpro-ui";
import { QueryKey } from "../../../../query";
import { getObjectMetaPreInstalled } from "../../../../api/preInstallationApi";
import {Properties, PropertyLayout} from "../../../../components/Mapper/PropertyLayout";
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
    [QueryKey.ADMIN_OBJECT_META, "Event"],
    (client, settings) => getObjectMetaPreInstalled(client, settings, "Event")
  );

  const [layout, setLayout] = useState<ListLayout>(value);

  useEffect(() => {
    onChange(layout);
  }, [layout, onChange]);

  const setRootLayout = useCallback(
    (properties: Properties<FieldProperty>) => setLayout((layout) => ({ ...layout, root: properties })),
    []
  );

  if (!meta.isSuccess) {
    return null;
  }

  const contactFieldOptions = meta.data.fields.map(fieldToPropertyMapper);

  return (
    <Stack gap={22} vertical>
      <Stack gap={6} style={{ width: "100%" }} vertical>
        <H1>Event Details</H1>
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
