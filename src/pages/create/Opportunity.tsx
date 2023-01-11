/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
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

const requiredFields = ["Name", "StageName", "CloseDate"];

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

  useEffect(() => {
    register("StageName", {
      required: true,
    });
    register("CloseDate", {
      required: true,
    });
  });

  const opportunityMetadata = useQueryWithClient(
    [QueryKey.OPPORTUNITY_METADATA, "Opportunity"],
    (client) => getObjectMeta(client, "opportunity"),
    {
      onSuccess(data) {
        setSchema(
          getMetadataBasedSchema(data.fields, {
            Name: z.string().min(1),
            StageName: z.string().min(1),
            CloseDate: z.string().min(1),
            Probability: z.preprocess(
              (val) => Number(val),
              z.number().min(0).max(100)
            ),
          })
        );
      },
    }
  );

  const fields = opportunityJson.view.root
    .map((e) => e[0]?.property)
    .filter((e) => !nonUsableFields.includes(e?.name as string));

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
      <Stack vertical gap={12} style={{ width: "100%" }}>
        <Stack vertical gap={12} style={{ width: "100%" }}>
          {fields.map((field, i) => (
            <Stack vertical gap={8} style={{ width: "100%" }}>
              <FieldMappingInput
                field={
                  field as {
                    name: string;
                    label: string;
                    type: string;
                  }
                }
                required={requiredFields.includes(field?.name as string)}
                key={i}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                fieldsMeta={opportunityMetadata.data?.fields as Field[]}
              />
              {field?.name === "Probability" && (
                <H2 style={{ color: "red" }}>
                  {errors.Probability &&
                    "Probability must be between 0 and 100"}
                </H2>
              )}
            </Stack>
          ))}
        </Stack>
        <Stack
          style={{ justifyContent: "space-around", width: "100%" }}
          gap={5}
        >
          {}
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
          <H2 style={{ color: "red" }}>
            {errors.submit && errors.submit.message}
          </H2>
        </Stack>
      </Stack>
    </form>
  );
};
