import { useDeskproAppEvents, useDeskproAppTheme } from "@deskpro/app-sdk";
import { getObjectPermalink } from "../../../../utils";
import { useState } from "react";
import { Settings } from "../../../../types";

type UrlLinkProps = {
  value: string;
};

export const UrlLink = ({ value }: UrlLinkProps) => {
  const { theme } = useDeskproAppTheme();
  const [settings, setSettings] = useState<Settings>();
  useDeskproAppEvents({
    onAdminSettingsChange: setSettings,
  });

  if (!settings) {
    return <>value</>;
  }

  const style = {
    color: theme.colors.cyan100,
    textDecoration: "none",
  };

  if (/^https?:/.test(value)) {
    return (
      <a href={value} target="_blank" style={style}>
        {value}
      </a>
    );
  }

  if (/^\//.test(value)) {
    return (
      <a
        href={getObjectPermalink(settings, value)}
        target="_blank"
        style={style}
      >
        View
      </a>
    );
  }

  return (
    <a href={`https://${value}`} target="_blank" style={style}>
      {value}
    </a>
  );
};
