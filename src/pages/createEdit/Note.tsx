import {
  Button,
  LoadingSpinner,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { editData, getObjectById, postData } from "../../api/api";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { NoteSubmit } from "../../types";
import { noteSchema } from "../../schemas/note";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { buttonLabels, capitalizeFirstLetter } from "../../utils";

export const CreateNote = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { client } = useDeskproAppClient();

  const { id, object } = useParams();

  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<NoteSubmit>({
    resolver: zodResolver(noteSchema),
  });

  const submitType = object === "edit" ? "edit" : "create";

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("salesforcePlusButton");
    client.setTitle(`${capitalizeFirstLetter(submitType)} Note`);
    client.deregisterElement("salesforceEditButton");
  });

  useEffect(() => {
    if (id && object !== "edit") {
      setValue("ParentId", id);
    }
  }, [id, setValue, object]);

  const noteById = useQueryWithClient(
    [QueryKey.NOTE_BY_ID, id],
    (client) => getObjectById(client, "Note", id as string),
    {
      enabled: object === "edit",
    }
  );

  useEffect(() => {
    const note = noteById.data as {
      Title: string;
      Body: string;
    };

    if (noteById.isSuccess) {
      reset({ Title: note.Title, Body: note.Body });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteById.isSuccess, reset]);

  const submit = async (data: NoteSubmit) => {
    if (!client) return;

    setIsSubmitting(true);

    if (object === "edit") {
      await editData(client, "Note", id as string, data);
    } else {
      await postData(client, "Note", data);
    }

    navigate(-1);
  };

  if (object === "edit" && noteById.isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <form onSubmit={handleSubmit(submit)} style={{ margin: "5px" }}>
      <Stack vertical gap={12}>
        <InputWithTitle
          title="Title"
          register={register("Title")}
          error={!!errors.Title}
        ></InputWithTitle>
        <InputWithTitle
          title="Body"
          register={register("Body")}
          error={!!errors.Body}
        ></InputWithTitle>
        <Stack
          style={{ justifyContent: "space-between", width: "100%" }}
          gap={5}
        >
          <Button
            type="submit"
            text={
              isSubmitting
                ? buttonLabels.find((e) => e.id === submitType)?.submitting
                : buttonLabels.find((e) => e.id === submitType)?.submit
            }
          ></Button>
          <Button
            text="Cancel"
            onClick={() => navigate(-1)}
            intent="secondary"
          ></Button>
        </Stack>
      </Stack>
    </form>
  );
};
