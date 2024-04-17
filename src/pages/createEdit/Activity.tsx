/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, H2, Stack } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z, ZodObject, ZodTypeAny } from "zod";
import {
  editData,
  getObjectById,
  getObjectMeta,
  postData,
} from "../../api/api";
import { Field } from "../../api/types";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import eventJson from "../../resources/default_layout/event.json";
import taskJson from "../../resources/default_layout/task.json";
import { getMetadataBasedSchema } from "../../schemas/default";
import {
  buttonLabels,
  capitalizeFirstLetter,
  mapErrorMessage,
} from "../../utils";

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
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));

  const location = useLocation();

  const search = location.search;

  const type = location.pathname?.split("/")[2];

  const queryParams = new URLSearchParams(search);

  const typeParam = queryParams.get("type");

  const { client } = useDeskproAppClient();

  const { object, id } = useParams();

  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema as ZodObject<any>),
  });

  const submitType = object === "edit" ? "edit" : "create";

  useInitialisedDeskproAppClient((client) => {
    client.setTitle(`${capitalizeFirstLetter(submitType)} ${type}`);
    client.deregisterElement("salesforceEditButton");
    client.deregisterElement("salesforcePlusButton");
  }, []);

  useEffect(() => {
    if (typeParam) {
      setValue("Type", typeParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam]);

  useEffect(() => {
    if (id && object !== "edit") {
      setValue(object as string, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, object]);

  const activityMetadata = useQueryWithClient(
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

  const activityById = useQueryWithClient(
    [QueryKey.ACTIVITY_BY_ID, id],
    (client) => getObjectById(client, typeParam as string, id as string),
    {
      enabled: object === "edit",
    }
  );

  const activityNamesMeta = activityMetadata.data?.fields.map((e) => e.name);

  const fields = activityTypes
    ?.find((e) => e.label === type)
    ?.fields.filter((e) => activityNamesMeta?.includes(e?.name as string));

  const activity = activityById.data as any;

  useEffect(() => {
    if (!type || !activityMetadata.data) return;

    const customFields: { [key: string]: ZodTypeAny } = {};

    for (const field of activityMetadata?.data.fields as Field[]) {
      if (field.type === "reference") {
        customFields[field.name] = z.string().min(1).optional();
      }

      if (
        (field.type === "date" || field.type === "datetime") &&
        !field.nillable &&
        !field.defaultedOnCreate
      ) {
        customFields[field.name] = z
          .string()
          .min(1)
          .optional()
          .refine(
            (val) => val && new Date(val).getTime() - new Date().getTime() > 0,
            {
              message: "Dates must be in the future",
            }
          );
        continue;
      }

      if (!field.defaultedOnCreate && !field.nillable && field.createable) {
        customFields[field.name] = z.string().min(1);
      }
    }

    setSchema(
      getMetadataBasedSchema(activityMetadata.data.fields, customFields)
    );
    setValue(`${type}Subtype`, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityMetadata.isSuccess, type]);

  useEffect(() => {
    const fieldsEffect = activityTypes
      ?.find((e) => e.label === type)
      ?.fields.filter((e) => activityNamesMeta?.includes(e?.name as string));

    if (
      !activityById.isSuccess ||
      !activityMetadata.isSuccess ||
      !fieldsEffect ||
      fieldsEffect?.length === 0
    )
      return;

    const mappedFields = fieldsEffect?.map((e) => e.name as string);

    const newObj = Object.keys(activity)
      .filter(
        (e) =>
          mappedFields?.includes(e) &&
          activityMetadata.data.fields.find((findE) => findE.name === e)
            ?.updateable
      )
      .reduce((accObj: any, key: string) => {
        accObj[key] = activity[key];

        return accObj;
      }, {});

    reset({ ...newObj, Type: type });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityById.isSuccess, activityMetadata.isSuccess, type]);

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
    if (object === "edit") {
      await editData(
        client,
        activityTypes.find((e) => e.label === type)?.value as string,
        id as string,
        data
      )
        .then(() => navigate(-1))
        .catch((e: Error) => {
          setSubmissionError(mapErrorMessage(e));

          setIsSubmitting(false);
        });
    } else {
      await postData(
        client,
        activityTypes.find((e) => e.label === type)?.value as string,
        data
      )
        .then(() => navigate(-1))
        .catch((e: Error) => {
          setSubmissionError(mapErrorMessage(e));

          setIsSubmitting(false);
        });
    }
  };

  if (object === "edit" && activityById.isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <form onSubmit={handleSubmit(submit)} style={{ margin: "5px" }}>
      {type && (
        <Stack vertical gap={12}>
          {fields?.map((field, i) => {
            return (
              <Stack vertical style={{ width: "100%" }} key={i}>
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
                  fieldsMeta={activityMetadata.data?.fields as Field[]}
                  data-testid={`input-${field.name}`}
                />
                {field && errors[field.name] && (
                  <H2 style={{ color: "red" }}>
                    {errors[field.name]?.message}
                  </H2>
                )}
              </Stack>
            );
          })}
          <Stack
            style={{ justifyContent: "space-between", width: "100%" }}
            gap={5}
          >
            <Button
              type="submit"
              data-testid="submit-button"
              text={
                isSubmitting
                  ? buttonLabels.find((e) => e.id === submitType)?.submitting
                  : buttonLabels.find((e) => e.id === submitType)?.submit
              }
            ></Button>
            <Button
              text="Cancel"
              onClick={() => navigate(-1)}
              intent="secondary"
            ></Button>
          </Stack>
          {submissionError && (
            <H2 style={{ color: "red", whiteSpace: "pre-line" }}>
              {submissionError}
            </H2>
          )}
        </Stack>
      )}
    </form>
  );
};
