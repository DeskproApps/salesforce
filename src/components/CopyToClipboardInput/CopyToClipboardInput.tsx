import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Input, IconButton } from "@deskpro/app-sdk";
import type { FC } from "react";

type Props = {
  value: string,
};

export const CopyToClipboardInput: FC<Props> = ({ value }) => {
  const [isCopy, setIsCopy] = useState<boolean>(false);

  const onClickCopy = () => {
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 2000);
  };

  return (
    <Input
      disabled={true}
      value={value}
      rightIcon={(
        <CopyToClipboard text={value}>
          <IconButton
            minimal
            onClick={onClickCopy}
            icon={isCopy ? faCheck : faCopy}
            title="Copy"
            {...(isCopy ? { themeColor: "green100" } : {})}
          />
        </CopyToClipboard>
      )}
    />
  );
};
