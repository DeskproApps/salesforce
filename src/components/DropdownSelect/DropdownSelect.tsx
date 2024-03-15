import {
  H1,
  Label,
  Stack,
  DivAsInput,
  Dropdown as DropdownComponent,
  DropdownTargetProps,
} from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import {
  faCheck,
  faExternalLinkAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";

interface Status {
  key: string;
  value: string;
  label: JSX.Element;
  type: string;
}

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  onChange: (key: string) => void;
  title: string;
  value: string;
  error: boolean;
  keyName: string;
  valueName: string;
  required?: boolean;
};
export const DropdownSelect = ({
  data,
  onChange,
  title,
  value,
  error,
  keyName,
  valueName,
  required,
}: Props) => {
  const { theme } = useDeskproAppTheme();
  // This works fine but the types are completely wrong
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataOptions = useMemo<any>(() => {
    return data?.map((dataInList) => ({
      key: dataInList[keyName],
      label: <Label label={dataInList[valueName]}></Label>,
      value: dataInList[valueName],
      type: "value" as const,
    }));
  }, [data, valueName, keyName]);
  return (
    <Stack
      vertical
      style={{ marginTop: "5px", color: theme.colors.grey80, width: "100%" }}
    >
      <Stack>
        <H1>{title}</H1>
        {required && (
          <Stack style={{ color: "red" }}>
            <H1>⠀*</H1>
          </Stack>
        )}
      </Stack>
      <DropdownComponent<Status, HTMLDivElement>
        placement="bottom-start"
        options={dataOptions}
        fetchMoreText={"Fetch more"}
        autoscrollText={"Autoscroll"}
        selectedIcon={faCheck}
        externalLinkIcon={faExternalLinkAlt}
        onSelectOption={(option) => onChange(option.key)}
      >
        {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
          <DivAsInput
            error={error}
            ref={targetRef}
            {...targetProps}
            variant="inline"
            rightIcon={faCaretDown}
            placeholder="Enter value"
            value={
              dataOptions.find(
                (e: { value: string; key: string }) => e.key == value
              )?.value ?? ""
            }
          />
        )}
      </DropdownComponent>
    </Stack>
  );
};
