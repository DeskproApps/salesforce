/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  H0,
  H2,
  Stack,
  TextArea,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z, ZodTypeAny } from "zod";

import { getObjectMeta, postData } from "../../api/api";
import { CheckboxTitle } from "../../components/CheckboxTitle/CheckboxTitle";
import { DateField } from "../../components/DateField/DateField";
import { DropdownSelect } from "../../components/DropdownSelect/DropdownSelect";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getMetadataBasedSchema } from "../../schemas/default";

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
  const [privateParam, stage, type, description, dlStatus] = watch([
    "Private",
    "StageName",
    "LeadSource",
    "Description",
    "DeliveryInstallationStatus__c",
  ]);

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
          <InputWithTitle
            title="Opportunity Name"
            register={register("Name", {
              required: true,
            })}
            error={!!errors.Name}
            required
          />
          <DropdownSelect
            title="Type"
            data={
              opportunityMetadata.data?.fields.find(
                (e) => e.name === "LeadSource"
              )?.picklistValues
            }
            keyName="label"
            valueName="value"
            value={type}
            error={false}
            onChange={(e) => setValue("LeadSource", e)}
          />
          <CheckboxTitle
            title="Private"
            checked={privateParam}
            onChange={() => setValue("Private", !privateParam)}
          ></CheckboxTitle>
          <InputWithTitle
            title="Amount"
            register={register("Amount")}
            error={!!errors.Amount}
            type="number"
          />
          <InputWithTitle
            title="Probability"
            register={register("Probability", {
              max: 6,
            })}
            error={!!errors.Probability}
            type="number"
          />
          {errors.Probability && (
            <H2 style={{ color: "red" }}>
              Probability must be between 0 and 100
            </H2>
          )}
          <InputWithTitle
            title="Next Step"
            register={register("NextStep")}
            error={!!errors.NextStep}
          />
          <DateField
            label="Close Date"
            onChange={(e: any) => setValue("CloseDate", e[0].toISOString())}
            required
            error={!!errors.CloseDate}
          ></DateField>
          <DropdownSelect
            title="Stage"
            required
            data={
              opportunityMetadata.data?.fields.find(
                (e) => e.name === "StageName"
              )?.picklistValues
            }
            keyName="label"
            valueName="value"
            value={stage}
            error={!!errors.StageName}
            onChange={(e) => setValue("StageName", e)}
          />
        </Stack>
        <H0>Additional Information</H0>
        <Stack vertical gap={12} style={{ width: "100%" }}>
          <InputWithTitle
            title="Order Number"
            register={register("OrderNumber")}
            error={!!errors.OrderNumber}
          />
          <DropdownSelect
            title="Delivery/Installation Status"
            data={
              opportunityMetadata.data?.fields.find(
                (e) => e.name === "DeliveryInstallationStatus__c"
              )?.picklistValues
            }
            keyName="label"
            valueName="value"
            value={dlStatus}
            error={!!errors.DeliveryInstallationStatus__c}
            onChange={(e) => setValue("DeliveryInstallationStatus__c", e)}
          />
          <InputWithTitle
            title="Tracking Number"
            register={register("TrackingNumber__c")}
            error={!!errors.TrackingNumber__c}
          />
          <InputWithTitle
            title="Main Competitors"
            register={register("MainCompetitors__c")}
            error={!!errors.MainCompetitors__c}
          />
          <InputWithTitle
            title="Current Generator"
            register={register("CurrentGenerators__c")}
            error={!!errors.CurrentGenerators__c}
          />
          <TextArea
            variant="inline"
            title="Description"
            value={description}
            error={!!errors.Description}
            onChange={(e) => setValue("Description", e.target.value)}
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
        </Stack>
        <Stack
          style={{ justifyContent: "space-between", width: "100%" }}
          gap={5}
        >
          <Button
            type="submit"
            text={submitting ? "Creating..." : "Create"}
          ></Button>
          <Button
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
