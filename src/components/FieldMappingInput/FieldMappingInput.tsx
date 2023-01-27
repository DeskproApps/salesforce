/* eslint-disable @typescript-eslint/no-explicit-any */
import { H1, Stack, TextArea, useDeskproAppTheme } from "@deskpro/app-sdk";
import { FieldErrorsImpl } from "react-hook-form";
import { DateField } from "../DateField/DateField";
import { Field } from "../../api/types";
import { DropdownSelect } from "../DropdownSelect/DropdownSelect";
import { InputWithTitle } from "../InputWithTitle/InputWithTitle";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getObjectsByQuery } from "../../api/api";
import { forwardRef } from "react";

type Props = {
  fieldsMeta: Field[];
  errors: Partial<FieldErrorsImpl<any>>;
  field: {
    name: string;
    label: string;
    type: string;
  };
  required?: boolean;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  usersEnabled?: boolean;
};

export const FieldMappingInput = forwardRef(({
  fieldsMeta,
  usersEnabled,
  field,
  required,
  errors,
  watch,
  setValue,
  register,
  ...attributes
}: Props,ref) => {
  const { theme } = useDeskproAppTheme();

  const people = useQueryWithClient(
    [QueryKey.ACCOUNT_BY_ID],
    (client) =>
      getObjectsByQuery(
        client,
        "SELECT Id, Name FROM User WHERE UserPermissionsSFContentUser=true",
        200
      ),
    {
      enabled: usersEnabled,
    }
  );

  let values: { value: string; key: string }[] = [];

  const fieldMeta = fieldsMeta?.find((e) => e.name === field.name);

  const value = watch(field.name);

  if (field.label === "Type") return null;
  switch (field.type) {
    case "text":
    case "number":
    case "email":
    case "phone":
    case "string":
    case "url":
      return (
        <InputWithTitle
          register={register(field.name)}
          title={field.label}
          error={!!errors[field.name]}
          type={field.type}
          required={required}
          {...attributes}
        ></InputWithTitle>
      );
    case "textarea":
      return (
        <Stack
          vertical
          gap={4}
          style={{ width: "100%", color: theme.colors.grey80 }}
        >
          <H1>{field.label}</H1>
          <TextArea
            variant="inline"
            value={watch(field.name)}
            error={!!errors[field.name]}
            onChange={(e) => setValue(field.name, e.target.value)}
            placeholder="Enter text here..."
            required={required}
            title={field.label}
            {...attributes}
            style={{
              resize: "none",
              minHeight: "5em",
              maxHeight: "100%",
              height: "auto",
              width: "100%",
              overflow: "hidden",
            }}
          />
        </Stack>
      );
    case "date":
      return (
        <DateField
        required={required}
        style={
          !!errors?.[field.name] && {
            borderBottomColor: "red",
          }
        }
        ref={ref}
        value={value ? new Date(value) : null}
        label={field.label}
        error={!!errors?.[field.name]}
        {...attributes}
        onChange={(e: [Date]) => setValue(field.name, e[0].toISOString())}
        />
      );
    case "reference":
    case "dropdown":
    case "picklist":
      if (fieldMeta?.picklistValues && fieldMeta.picklistValues.length > 0) {
        values = fieldsMeta
          ?.find((e) => e.name === field.name)
          ?.picklistValues.filter((e) => e.active)
          .map((e) => ({ key: e.label, value: e.value })) as {
          value: string;
          key: string;
        }[];
      } else if (fieldMeta?.referenceTo.includes("User")) {
        values =
          people.data?.map((e) => ({
            key: e.Id,
            value: e.Name,
          })) || ([] as { value: string; key: string }[]);
      }
      return (
        <DropdownSelect
          required={required}
          title={field.label}
          value={(watch(field.name) as string) || ""}
          error={!!errors[field.name]}
          onChange={(e) => setValue(field.name, e)}
          data={values}
          keyName={"key"}
          valueName={"value"}
          {...attributes}
        />
      );
  }
  return null;
});
