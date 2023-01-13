/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  H0,
  H2,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z, ZodTypeAny } from "zod";

import { getObjectMeta, postData } from "../../api/api";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getMetadataBasedSchema } from "../../schemas/default";
import opportunityJson from "../../resources/default_layout/opportunity.json";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { Field } from "../../api/types";

const nonUsableFields = ["AccountId", "CreatedDate", "CreatedById"];

export const CreateOpportunity = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));
  const { object, parentId } = useParams();

  const { client } = useDeskproAppClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(schema),
  });
  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("salesforcePlusButton");
    client.setTitle("Add Opportunity");
  });

  useEffect(() => {
    if (parentId) {
      setValue(object as string, parentId);
    }
  }, [parentId, setValue, object]);

  const opportunityMetadata = useQueryWithClient(
    [QueryKey.OPPORTUNITY_METADATA, "Opportunity"],
    (client) => getObjectMeta(client, "opportunity")
  );

  useEffect(() => {
    if (!opportunityMetadata.data) return;

    const customFields: { [key: string]: ZodTypeAny } = {};

    for (const field of opportunityMetadata.data.fields) {
      if (field.type === "reference") {
        customFields[field.name] = z.string().min(1).optional();
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
            message: "Close date must be in the future",
          });
        continue;
      }

      if (!field.defaultedOnCreate && !field.nillable && field.createable) {
        customFields[field.name] = z.string().min(1);
      }
    }
    setSchema(
      getMetadataBasedSchema(opportunityMetadata.data.fields, customFields)
    );
  }, [opportunityMetadata.data]);

  const opNamesMeta = opportunityMetadata.data?.fields.map((e) => e.name);

  const fields = opportunityJson.view.root
    .map((e) => e[0]?.property)
    .filter(
      (e) =>
        !nonUsableFields.includes(e?.name as string) &&
        opNamesMeta?.includes(e?.name as string)
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = async (data: any) => {
    if (!client) return;

    setSubmitting(true);

    await postData(client, "Opportunity", data).then(() => {
      navigate(-1);

      setSubmitting(false);
    });
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
              <Stack vertical gap={8} style={{ width: "100%" }}>
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
            type="submit"
            text={submitting ? "Creating..." : "Create"}
          ></Button>
          <Button
            disabled={submitting}
            text="Cancel"
            onClick={() => navigate(-1)}
            intent="secondary"
          ></Button>
        </Stack>
        <H2 style={{ color: "red" }}>
          {errors.submit && errors.submit.message}
        </H2>
      </Stack>
    </form>
  );
};
