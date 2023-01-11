/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextArea } from "@deskpro/app-sdk";
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

export const FieldMappingInput = ({
  fieldsMeta,
  usersEnabled,
  field,
  required,
  errors,
  watch,
  setValue,
  register,
}: Props) => {
  const people = useQueryWithClient(
    [QueryKey.ACCOUNT_BY_ID],
    (client) =>
      getObjectsByQuery(
        client,
        "SELECT Id, Name FROM User WHERE UserPermissionsSFContentUser=true",
        200
      ),
    {
      enabled: !usersEnabled,
    }
  );

  let values: { value: string; key: string }[] = [];

  const fieldMeta = fieldsMeta?.find((e) => e.name === field.name);

  if (field.label === "Type") return null;
  switch (field.type) {
    case "text":
    case "number":
      return (
        <InputWithTitle
          register={register(field.name)}
          title={field.label}
          error={!!errors[field.name]}
          type={field.type}
          required={required}
        ></InputWithTitle>
      );
    case "textarea":
      return (
        <TextArea
          variant="inline"
          value={watch(field.name)}
          error={!!errors[field.name]}
          onChange={(e) => setValue(field.name, e.target.value)}
          placeholder="Enter text here..."
          required={required}
          style={{
            resize: "none",
            minHeight: "5em",
            maxHeight: "100%",
            height: "auto",
            width: "100%",
            overflow: "hidden",
          }}
        />
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
          label={field.label}
          error={!!errors?.[field.name]}
          {...register(field.name)}
          onChange={(e: [Date]) => setValue(field.name, e[0].toISOString())}
        />
      );
    case "dropdown":
      if (fieldMeta?.picklistValues && fieldMeta.picklistValues.length > 0) {
        values = fieldsMeta
          ?.find((e) => e.name === field.name)
          ?.picklistValues.filter((e) => e.active)
          .map((e) => ({ key: e.label, value: e.value })) as {
          value: string;
          key: string;
        }[];
      } else if (fieldMeta?.referenceTo.includes("User")) {
        values = people.data?.map((e) => ({
          key: e.Id,
          value: e.Name,
        })) as { value: string; key: string }[];
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
        />
      );
  }
  return null;
};
