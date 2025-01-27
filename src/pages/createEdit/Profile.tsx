/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "lodash";
import { Button, H2, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ZodObject, ZodTypeAny, z } from "zod";
import { editData, getObjectById, getObjectMeta } from "../../api/api";
import { Field } from "../../api/types";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getMetadataBasedSchema } from "../../schemas/default";
import { getScreenLayout, mapErrorMessage } from "../../utils";
import { Settings } from "../../types";

const UNUSABLE_FIELDS = ["AccountId", "ReportsToId"];

export const EditProfile = () => {
  const { object, id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const { context } = useDeskproLatestAppContext<never, Settings>();
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const isProfile = useMemo(() => {
    return ["Account", "Contact", "Lead"].some((item) => item === type);
  }, [type]);

  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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

  useInitialisedDeskproAppClient((client) => {
    client.setTitle(`Edit ${object}`);
    client.deregisterElement("salesforceEditButton");
  }, [object]);

  const profileMetadata = useQueryWithClient(
    [QueryKey.ACTIVITY_METADATA, object],
    (client) => getObjectMeta(client, (isProfile ? type : object) as string),
    { enabled: !!object }
  );

  const layout = useMemo(
    () => getScreenLayout(context?.settings, (isProfile ? type : object) as string, "view"),
    [context?.settings, object, isProfile, type]
  );

  const profileById = useQueryWithClient(
    [QueryKey.ACTIVITY_BY_ID, id],
    (client) => getObjectById(client, (isProfile ? type : object) as string, id as string),
    {
      enabled: !!object && !!id,
    }
  );

  const layoutMap = layout.root
    .map((e) => e.map((eMap) => eMap?.id))
    .flat()
    .filter((e) => e);

  useEffect(() => {
    if (!profileMetadata.data) return;

    const customFields: { [key: string]: ZodTypeAny } = {};

    for (const field of profileMetadata.data.fields) {
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

      if (field.type === "email") {
        customFields[field.name] = z.string().email().optional();

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
      }
    }
    setSchema(
      getMetadataBasedSchema(profileMetadata.data.fields, customFields)
    );
  }, [profileMetadata.data]);

  useEffect(() => {
    const profile = profileById.data as any;

    if (!profileById.isSuccess) return;

    const newObj = Object.keys(profile)
      .filter((e) => {
        const field = profileMetadata.data?.fields.find((f) => f.name === e);
        return (
          ((layoutMap.includes(e) && field?.updateable) ||
            (field?.updateable &&
              !field.nillable &&
              !field.defaultedOnCreate)) &&
          !UNUSABLE_FIELDS.includes(e)
        );
      })
      .reduce((obj: any, key) => {
        if (profile[key]) obj[key] = profile[key];
        return obj;
      }, {});
    reset(newObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileById.isSuccess, profileMetadata.isSuccess]);

  //only 2 are being detected lol
  const usableFields = profileMetadata.data?.fields.filter(
    (e) =>
      ((e.updateable && layoutMap.includes(e.name)) ||
        (e.updateable && !e.nillable && !e.defaultedOnCreate)) &&
      !UNUSABLE_FIELDS.includes(e.name)
  );

  const submit = useCallback((data: any) => {
    if (!client || !object) return;

    setSubmitting(true);

    return editData(client, (isProfile ? type : object) as string, id as string, data)
      .then(() => navigate(-2))
      .catch((e) => {
        setSubmissionError(mapErrorMessage(e));
        setSubmitting(false);
      });
  }, [client, object, isProfile, type, id, navigate]);

  return (
    <form style={{ margin: "5px" }} onSubmit={handleSubmit(submit)}>
      <Stack vertical gap={12}>
        <Stack vertical gap={12} style={{ width: "100%" }}>
          {usableFields?.map((field, i) => {
            return (
              <Stack vertical gap={8} style={{ width: "100%" }} key={i}>
                <FieldMappingInput
                  field={
                    field as {
                      name: string;
                      label: string;
                      type: string;
                    }
                  }
                  required={
                    !field.defaultedOnCreate &&
                    !field.nillable &&
                    field.createable
                  }
                  key={i}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  fieldsMeta={profileMetadata.data?.fields as Field[]}
                  data-testid={`input-${field.name}`}
                />
                {field && errors[field.name] && (
                  <H2 style={{ color: "red" }}>
                    {get(errors, [field.name, "message"])}
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
            text={submitting ? "Saving..." : "Save"}
            data-testid="submit-button"
          ></Button>
          <Button
            disabled={submitting}
            text="Cancel"
            onClick={() => navigate(-2)}
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
