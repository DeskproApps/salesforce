import { Button, Stack, TextArea, useDeskproAppClient } from "@deskpro/app-sdk";
import { useState, useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { postData } from "../../api/api";
import { getObjectsByQuery } from "../../api/api";
import { ActivitySchema, ActivitySubmit } from "../../types";
import { DropdownSelect } from "../../components/DropdownSelect/DropdownSelect";
import {
  CallSchema,
  EmailSchema,
  EventSchema,
  TaskSchema,
} from "../../schemas/activity";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { DateField } from "../../components/DateField/DateField";

const unusableNames = [
  "Security User",
  "Chatter Expert",
  "Data.com Clean",
  "Platform Integration User",
  "Automated Process",
  "Integration User",
];

const StatusOptions = [
  {
    key: "Not Started",
    value: "Not Started",
  },
  {
    key: "In Progress",
    value: "In Progress",
  },
  {
    key: "Completed",
    value: "Completed",
  },
  {
    key: "Deferred",
    value: "Deferred",
  },
  {
    key: "Waiting on someone else",
    value: "Waiting on someone else",
  },
];

const activityTypes = [
  {
    value: "Task",
    label: "Task",
    fields: [
      {
        name: "ActivityDate",
        label: "Due Date",
        type: "date",
      },
      {
        name: "Subject",
        label: "Subject",
        type: "text",
      },
      {
        name: "Status",
        label: "Status",
        type: "Dropdown",
      },
      {
        name: "OwnerId",
        label: "Assigned To",
        type: "Dropdown",
      },
    ],
  },
  {
    value: "Event",
    label: "Event",
    fields: [
      {
        name: "ActivityDateTime",
        label: "Start Date",
        type: "date",
      },
      {
        name: "EndDateTime",
        label: "End Date",
        type: "date",
      },
      {
        name: "Subject",
        label: "Subject",
        type: "text",
      },
      {
        name: "Location",
        label: "Location",
        type: "text",
      },
      {
        name: "OwnerId",
        label: "Assigned To",
        type: "Dropdown",
      },
    ],
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
    fields: [
      {
        name: "Subject",
        label: "Subject",
        type: "text",
        required: false,
      },
      {
        name: "Description",
        label: "Comments",
        type: "textarea",
      },
    ],
  },
];

export const CreateActivity = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { client } = useDeskproAppClient();

  const { object, parentId } = useParams();

  const navigate = useNavigate();

  const schemaReducer = (
    state: {
      schema: ActivitySchema;
    },
    action: {
      Type: string;
    }
  ): {
    schema: ActivitySchema;
  } => {
    switch (action.Type) {
      case "Task":
        return { schema: TaskSchema };
      case "Event":
        return { schema: EventSchema };
      case "Email":
        return { schema: EmailSchema };
      case "Call":
        return { schema: CallSchema };
      default:
        return { schema: TaskSchema };
    }
  };

  const [schemaState, dispatchSchema] = useReducer(schemaReducer, {
    schema: TaskSchema,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ActivitySubmit>({
    resolver: zodResolver(schemaState?.schema as typeof CallSchema),
  });

  const [type] = watch(["Type"]);

  useEffect(() => {
    if (parentId) {
      setValue(object as keyof ActivitySubmit, parentId);
    }
  }, [parentId, setValue, object]);

  const people = useQueryWithClient(
    [QueryKey.ACCOUNT_BY_ID],
    (client) => getObjectsByQuery(client, "SELECT Id, Name FROM User", 200),
    {
      enabled: !!activityTypes
        .find((e) => e.value === type)
        ?.fields.findIndex((e) => e.name === "OwnerId"),
    }
  );

  const submit = async (data: ActivitySubmit) => {
    if (!client) return;

    setIsSubmitting(true);

    delete data.Type;

    if (data.EventSubtype) {
      data.DurationInMinutes =
        (new Date(data.EndDateTime as string).getTime() -
          new Date(data.ActivityDateTime as string).getTime()) /
        1000 /
        60;
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
          dispatchSchema({ Type: e });
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
              let values: { value: string }[] = [];

              if (field.type === "Dropdown") {
                switch (field.name) {
                  case "Status":
                    values = StatusOptions;
                    break;
                  case "OwnerId":
                    values = people.data
                      ?.filter((e) => !unusableNames.includes(e.Name))
                      .map((e) => ({
                        key: e.Id,
                        value: e.Name,
                      })) as { value: string }[];
                }
              }
              switch (field.type) {
                case "text":
                  return (
                    <InputWithTitle
                      key={i}
                      register={register(field.name as keyof ActivitySubmit)}
                      title={field.label}
                      error={!!errors[field.name as keyof ActivitySubmit]}
                      required={field?.required}
                    ></InputWithTitle>
                  );
                case "textarea":
                  return (
                    <TextArea
                      key={i}
                      variant="inline"
                      value={watch(field.name as keyof ActivitySubmit)}
                      error={!!errors[field.name as keyof ActivitySubmit]}
                      onChange={(e) =>
                        setValue(
                          field.name as keyof ActivitySubmit,
                          e.target.value
                        )
                      }
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
                        !!errors?.[field.name as keyof ActivitySubmit] && {
                          borderBottomColor: "red",
                        }
                      }
                      label={field.label}
                      error={!!errors?.[field.name as keyof ActivitySubmit]}
                      {...register(field.name as keyof ActivitySubmit)}
                      onChange={(e: [Date]) =>
                        setValue(
                          field.name as keyof ActivitySubmit,
                          e[0].toISOString()
                        )
                      }
                    />
                  );
                case "Dropdown":
                  return (
                    <DropdownSelect
                      key={i}
                      title={field.label}
                      value={
                        (watch(field.name as keyof ActivitySubmit) as string) ||
                        ""
                      }
                      error={!!errors[field.name as keyof ActivitySubmit]}
                      onChange={(e) =>
                        setValue(field.name as keyof ActivitySubmit, e)
                      }
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
