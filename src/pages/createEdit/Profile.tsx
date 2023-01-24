/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  H2,
  Stack,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getObjectById, getObjectMeta } from "../../api/api";
import { Field } from "../../api/types";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getScreenLayout } from "../../utils";
import { z, ZodObject, ZodTypeAny } from "zod";

export const EditProfile = () => {
  const { object, id } = useParams();
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));
  const [saving, setSaving] = useState(false);
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

  const profileMetadata = useQueryWithClient(
    [QueryKey.ACTIVITY_METADATA, object],
    (client) => getObjectMeta(client, object as string),
    {
      enabled: !!object,
    }
  );

  const layout = useMemo(
    () => getScreenLayout(context?.settings, object as string, "view"),
    [context?.settings, object]
  );

  const profileById = useQueryWithClient(
    [QueryKey.ACTIVITY_BY_ID, id],
    (client) => getObjectById(client, object as string, id as string),
    {
      enabled: !!object && !!id,
    }
  );

  const layoutMap = layout.root.map((e) => e[0]?.id);

  useEffect(() => {
    const profile = profileById.data as any;

    if (!profileById.isSuccess) return;

    const newObj = Object.keys(profile)
      .filter(
        (e) =>
          layoutMap.includes(e) &&
          profileMetadata.data?.fields.find((f) => f.name === e)?.updateable
      )
      .reduce((obj: any, key) => {
        if (obj[key]) obj[key] = profile[key];
        return obj;
      }, {});
    reset(newObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileById.isSuccess, profileMetadata.isSuccess]);

  //only 2 are being detected lol
  const usableFields = profileMetadata.data?.fields.filter(
    (e) => e.updateable && layoutMap.includes(e.name)
  );

  const submit = () => {
    setSaving(true);
    setSubmissionError(null);
  };

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
            loading={saving}
            disabled={saving}
            type="submit"
            text={saving ? "Saving..." : "Save"}
          ></Button>
          <Button
            disabled={saving}
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
