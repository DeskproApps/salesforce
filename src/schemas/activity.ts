import { z } from "zod";
import { Field } from "../api/types";

export const getActivitySchema = (fields: Field[], type: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: any = {};

  for (const field of fields) {
    newObj[field.name] = z.string().min(1);
  }
  console.log(`${type}Subtype`);
  const schema = z.object({
    ...newObj,
    WhoId: z.string().min(1).optional(),
    ParentID: z.string().min(1).optional(),
    [`${type}Subtype`]: z.string().min(1).optional(),
  });

  return schema;
};
