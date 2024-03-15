/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, H0, H2, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z, ZodTypeAny } from "zod";

import {
  editData,
  getObjectById,
  getObjectMeta,
  postData,
} from "../../api/api";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getMetadataBasedSchema } from "../../schemas/default";
import opportunityJson from "../../resources/default_layout/opportunity.json";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { Field } from "../../api/types";
import {
  buttonLabels,
  capitalizeFirstLetter,
  mapErrorMessage,
} from "../../utils";

const nonUsableFields = ["AccountId", "CreatedDate", "CreatedById"];

export const CreateOpportunity = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { object, id } = useParams();

  const { client } = useDeskproAppClient();

  const submitType = object === "edit" ? "edit" : "create";

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("salesforcePlusButton");
    client.setTitle(`${capitalizeFirstLetter(submitType)} Opportunity`);
    client.deregisterElement("salesforceEditButton");
  });

  useEffect(() => {
    if (id && object !== "edit") {
      setValue(object as string, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, object]);

  const opportunityMetadata = useQueryWithClient(
    [QueryKey.OPPORTUNITY_METADATA, "Opportunity"],
    (client) => getObjectMeta(client, "Opportunity")
  );

  const opportunityById = useQueryWithClient(
    [QueryKey.OPPORTUNITY_BY_ID, id],
    (client) => getObjectById(client, "Opportunity", id as string),
    {
      enabled: object === "edit",
    }
  );

  const opNamesMeta = opportunityMetadata.data?.fields.map((e) => e.name);

  const fields = opportunityJson.view.root
    .map((e) => e[0]?.property)
    .filter(
      (e) =>
        !nonUsableFields.includes(e?.name as string) &&
        opNamesMeta?.includes(e?.name as string)
    );

  useEffect(() => {
    const mappedFields = fields?.map((e) => e?.name as string);

    const opportunity = opportunityById.data as any;

    if (opportunityById.isSuccess) {
      const newObj = Object.keys(opportunity)
        .filter(
          (e) =>
            mappedFields.includes(e) &&
            opportunityMetadata.data?.fields.find((findE) => findE.name === e)
              ?.createable
        )
        .reduce((accObj: any, key: string) => {
          if (opportunity[key]) accObj[key] = opportunity[key];

          return accObj;
        }, {});

      reset(newObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityById.isSuccess, opportunityMetadata.isSuccess]);

  useEffect(() => {
    if (!opportunityMetadata.data) return;

    const customFields: { [key: string]: ZodTypeAny } = {};

    for (const field of opportunityMetadata.data.fields) {
      if (field.type === "reference") {
        customFields[field.name] = z.string().min(1).optional();
        continue;
      }
      if (field.type === "currency") {
        customFields[field.name] = z.preprocess(
          (val) => (isNaN(Number(val)) ? undefined : Number(val)),
          z.number().optional()
        );
        continue;
      }

      if (field.type === "percent") {
        customFields[field.name] = z.preprocess(
          (val) => Number(val),
          z.number().min(0).max(100)
        );
        continue;
      }

      if (
        (field.type === "date" || field.type === "datetime") &&
        !field.nillable &&
        !field.defaultedOnCreate
      ) {
        customFields[field.name] = z
          .string()
          .min(1)
          .refine((val) => new Date(val).getTime() - new Date().getTime() > 0, {
            message: "Dates must be in the future",
          });
        continue;
      }

      if (!field.defaultedOnCreate && !field.nillable && field.createable) {
        customFields[field.name] = z.string().min(1);
        continue;
      }
    }
    setSchema(
      getMetadataBasedSchema(opportunityMetadata.data.fields, customFields)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityMetadata.isSuccess]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = async (data: any) => {
    if (!client) return;

    setSubmitting(true);
    if (object === "edit") {
      await editData(client, "Opportunity", id as string, data)
        .then(() => navigate(-1))
        .catch((e) => {
          setSubmissionError(mapErrorMessage(e));

          setSubmitting(false);
        });
    } else {
      await postData(client, "Opportunity", data)
        .then(() => navigate(-1))
        .catch((e) => {
          setSubmissionError(mapErrorMessage(e));

          setSubmitting(false);
        });
    }
  };

  return (
    <form style={{ margin: "5px" }} onSubmit={handleSubmit(submit)}>
      <Stack vertical gap={12}>
        <Stack vertical gap={12} style={{ width: "100%" }}>
          {fields.map((field, i) => {
            const fieldMeta = opportunityMetadata.data?.fields.find(
              (e) => e.name === field?.name
            ) as Field;
            return (
              <Stack vertical gap={8} style={{ width: "100%" }} key={i}>
                {field && field.name === "DeliveryInstallationStatus__c" && (
                  <H0>Additional Fields</H0>
                )}
                <FieldMappingInput
                  field={
                    field as {
                      name: string;
                      label: string;
                      type: string;
                    }
                  }
                  required={
                    !fieldMeta.defaultedOnCreate &&
                    !fieldMeta.nillable &&
                    fieldMeta.createable
                  }
                  key={i}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  data-testid={`input-${field?.name}`}
                  fieldsMeta={opportunityMetadata.data?.fields as Field[]}
                />
                {field && errors[field.name] && (
                  <H2 style={{ color: "red" }}>
                    {errors[field.name]?.message}
                  </H2>
                )}
              </Stack>
            );
          })}
        </Stack>
        <Stack
          style={{ justifyContent: "space-between", width: "100%" }}
          gap={5}
        >
          <Button
            loading={submitting}
            disabled={submitting}
            data-testid="submit-button"
            type="submit"
            text={
              submitting
                ? buttonLabels.find((e) => e.id === submitType)?.submitting
                : buttonLabels.find((e) => e.id === submitType)?.submit
            }
          ></Button>
          <Button
            disabled={submitting}
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
    </form>
  );
};
