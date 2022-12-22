type TextAreaProps = {
  value: string;
};

export const TextArea = ({ value }: TextAreaProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: value?.replaceAll("\n", "<br>") }}
      style={{ wordBreak: "break-word" }}
    ></div>
  );
};
