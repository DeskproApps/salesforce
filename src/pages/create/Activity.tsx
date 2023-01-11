/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Stack, useDeskproAppClient } from "@deskpro/app-sdk";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { getObjectMeta, postData } from "../../api/api";
import { DropdownSelect } from "../../components/DropdownSelect/DropdownSelect";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { z, ZodObject, ZodRawShape } from "zod";
import { getActivitySchema } from "../../schemas/activity";
import { Field } from "../../api/types";
import taskJson from "../../resources/default_layout/task.json";
import eventJson from "../../resources/default_layout/event.json";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";

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

  const [schema, setSchema] = useState<ZodObject<ZodRawShape>>(z.object({}));

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
            ?.fields.map((field, i) => (
              <FieldMappingInput
                field={field}
                key={i}
                usersEnabled={
                  !!activityTypes
                    .find((e) => e.value === type)
                    ?.fields.findIndex((e) => e.name === "OwnerId")
                }
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                fieldsMeta={ActivityMetadata.data?.fields as Field[]}
              />
            ))}
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
