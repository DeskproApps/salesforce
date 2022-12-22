import { Button, Stack, useDeskproAppClient } from "@deskpro/app-sdk";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { postData } from "../../api/api";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { NoteSubmit } from "../../types";
import { noteSchema } from "../../schemas/note";

export const CreateNote = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { client } = useDeskproAppClient();

  const { parentId } = useParams();

  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<NoteSubmit>({
    resolver: zodResolver(noteSchema),
  });

  useEffect(() => {
    if (parentId) {
      setValue("ParentId", parentId);
    }
  }, [ parentId, setValue]);

  const submit = async (data: NoteSubmit) => {
    if (!client) return;

    setIsSubmitting(true);

    await postData(client, "note", data);

    navigate(-1);
  };

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
            text={isSubmitting ? "Creating..." : "Create"}
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
