import { z } from "zod";
import { Field } from "../api/types";

export const getMetadataBasedSchema = (
  fields: Field[],
  customInputs: {
    [key: string]: z.ZodTypeAny;
  }
) => {
  const newObj: {
    [key: string]: z.ZodTypeAny;
  } = {};

  for (const field of fields) {
    newObj[field.name] = z.string().optional();
  }

  for (const key of Object.keys(customInputs)) {
    newObj[key as keyof typeof newObj] =
      customInputs[key as keyof typeof newObj];
  }

  const schema = z
    .object({
      ...newObj,
    })
    .transform((obj) => {
      for (const key of Object.keys(obj)) {
        if (obj[key as keyof typeof obj] === "") {
          delete obj[key as keyof typeof obj];
        }
      }
      return obj;
    });

  return schema;
};
