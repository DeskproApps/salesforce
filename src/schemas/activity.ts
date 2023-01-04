import { z } from "zod";

export const activitySchema = z
  .object({
    Type: z.string().optional(),
    DueDate: z.string(),
    Subject: z.string(),
    Status: z.string(),
    AssignedTo: z.string(),
    ActivityDateTime: z.string(),
    EndDateTime: z.string(),
    EndDate: z.string(),
    Location: z.string(),
    To: z.string(),
    Bcc: z.string(),
    Body: z.string(),
    Comments: z.string(),
    Description: z.string(),
  })
  .transform((obj) => {
    const newObj = {
      ...obj,
      [obj.Type === "Event" ? "EventSubtype" : "TaskSubtype"]: obj.Type,
    };

    delete newObj.Type;
    return newObj;
  });

export const TaskSchema = z
  .object({
    Type: z.string().optional(),
    ActivityDate: z.string(),
    Subject: z.string().min(1),
    Status: z.string().min(1),
    OwnerId: z.string(),
  })
  .transform((obj) => {
    const newObj = {
      ...obj,
      ["TaskSubtype"]: obj.Type,
    };

    delete newObj.Type;

    return newObj;
  });

export const EventSchema = z
  .object({
    Type: z.string().optional(),
    ActivityDateTime: z.string(),
    EndDateTime: z.string().min(1),
    Subject: z.string().min(1),
    Location: z.string().min(1),
    OwnerId: z.string(),
  })
  .transform((obj) => {
    const newObj = {
      ...obj,
      ["EventSubtype"]: obj.Type,
    };

    delete newObj.Type;

    return newObj;
  });

export const EmailSchema = z
  .object({
    Type: z.string().optional(),
    ToAddress: z.string().min(1),
    BccAddress: z.string().optional(),
    Subject: z.string().min(1),
    HtmlBody: z.string().min(1),
  })
  .transform((obj) => {
    const newObj = {
      ...obj,
      ["TaskSubtype"]: obj.Type,
    };

    delete newObj.Type;

    return newObj;
  });

export const CallSchema = z
  .object({
    Type: z.string().optional(),
    Subject: z.string().min(1),
    Description: z.string().min(1),
  })
  .transform((obj) => {
    const newObj = {
      ...obj,
      ["TaskSubtype"]: obj.Type,
    };

    delete newObj.Type;

    return newObj;
  });
