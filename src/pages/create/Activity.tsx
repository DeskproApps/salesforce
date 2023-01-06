/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Stack, TextArea, useDeskproAppClient } from "@deskpro/app-sdk";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { getObjectMeta, postData } from "../../api/api";
import { getObjectsByQuery } from "../../api/api";
import { DropdownSelect } from "../../components/DropdownSelect/DropdownSelect";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { DateField } from "../../components/DateField/DateField";
import { z, ZodObject } from "zod";
import { getActivitySchema } from "../../schemas/activity";
import { Field } from "../../api/types";
import taskJson from "../../resources/default_layout/task.json";
import eventJson from "../../resources/default_layout/event.json";

const activityTypes = [
  {
    value: "Task",
    label: "Task",
    fields: [...taskJson.view.root.map((e) => e[0].property)],
  },
  {
    value: "Event",
    label: "Event",
    fields: eventJson.view.root.map((e) => e[0].property),
  },
  // {
  //   value: "Task",
  //   label: "Email",
  //   fields: [
  //     {
  //       name: "ToAddress",
  //       label: "To",
  //       type: "text",
  //       required: true,
  //     },
  //     {
  //       name: "Subject",
  //       label: "Subject",
  //       type: "text",
  //     },
  //     {
  //       name: "BccAddress",
  //       label: "Bcc",
  //       type: "text",
  //     },
  //     {
  //       name: "HtmlBody",
  //       label: "Body",
  //       type: "textarea",
  //     },
  //   ],
  // },
  {
    value: "Task",
    label: "Call",
    fields: taskJson.view.root
      .map((e) => e[0].property)
      .filter((e) => e.name === "Subject" || e.name === "Description"),
  },
];

export const CreateActivity = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { client } = useDeskproAppClient();

  const { object, parentId } = useParams();

  const navigate = useNavigate();

  const [schema, setSchema] = useState<ZodObject<any>>(z.object({}));

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(schema as ZodObject<any>),
  });

  const type = watch("Type");

  useEffect(() => {
    if (parentId) {
      setValue(object as string, parentId);
    }
  }, [parentId, setValue, object]);

  const ActivityMetadata = useQueryWithClient(
    [QueryKey.ACTIVITY_METADATA, type],
    (client) =>
      getObjectMeta(
        client,
        activityTypes.find((e) => e.label === type)?.value as string
      ),
    {
      enabled: !!type,
    }
  );

  const people = useQueryWithClient(
    [QueryKey.ACCOUNT_BY_ID],
    (client) =>
      getObjectsByQuery(
        client,
        "SELECT Id, Name FROM User WHERE UserPermissionsSFContentUser=true",
        200
      ),
    {
      enabled: !!activityTypes
        .find((e) => e.value === type)
        ?.fields.findIndex((e) => e.name === "OwnerId"),
    }
  );

  useEffect(() => {
    if (!type || !ActivityMetadata.data) return;

    const activityType = activityTypes.find((e) => e.label === type);

    setSchema(
      getActivitySchema(
        activityType?.fields as Field[],
        activityType?.value as string
      )
    );
    setValue(`${activityType?.value}Subtype`, activityType?.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ActivityMetadata.data, watch, type]);

  const submit = async (data: any) => {
    if (!client) return;

    setIsSubmitting(true);

    delete data.Type;

    if (data.EventSubtype) {
      data.DurationInMinutes = Math.abs(
        (new Date(data.EndDateTime as string).getTime() -
          new Date(data.ActivityDateTime as string).getTime()) /
          1000 /
          60
      );
    }

    await postData(
      client,
      activityTypes.find((e) => e.label === type)?.value as string,
      data
    );

    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit(submit)} style={{ margin: "5px" }}>
      <DropdownSelect
        title="Type"
        value={type || ""}
        onChange={(e) => {
          setValue("Type", e);
        }}
        error={!!errors.Type}
        data={activityTypes}
        keyName={"label"}
        valueName={"label"}
      />
      {type && (
        <Stack vertical gap={12}>
          {activityTypes
            .find((e) => e.label === type)
            ?.fields.map((field, i) => {
              let values: { value: string; key: string }[] = [];

              const fieldMeta = ActivityMetadata.data?.fields?.find(
                (e) => e.name === field.name
              );

              if (field.label === "Type") return;
              switch (field.type) {
                case "text":
                  return (
                    <InputWithTitle
                      key={i}
                      register={register(field.name)}
                      title={field.label}
                      error={!!errors[field.name]}
                    ></InputWithTitle>
                  );
                case "textarea":
                  return (
                    <TextArea
                      key={i}
                      variant="inline"
                      value={watch(field.name)}
                      error={!!errors[field.name]}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      placeholder="Enter text here..."
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
                      key={i}
                      style={
                        !!errors?.[field.name] && {
                          borderBottomColor: "red",
                        }
                      }
                      label={field.label}
                      error={!!errors?.[field.name]}
                      {...register(field.name)}
                      onChange={(e: [Date]) =>
                        setValue(field.name, e[0].toISOString())
                      }
                    />
                  );
                case "dropdown":
                  if (
                    fieldMeta?.picklistValues &&
                    fieldMeta.picklistValues.length > 0
                  ) {
                    values = ActivityMetadata.data?.fields
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
                      key={i}
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
            })}
          <Stack
            style={{ justifyContent: "space-between", width: "100%" }}
            gap={5}
          >
            <Button
              type="submit"
              text={isSubmitting ? "Creating..." : "Create"}
            ></Button>
            <Button
              text="Cancel"
              onClick={() => navigate(-1)}
              intent="secondary"
            ></Button>
          </Stack>
        </Stack>
      )}
    </form>
  );
};
