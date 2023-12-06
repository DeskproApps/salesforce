import {
  useDeskproAppTheme,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getObjectPermalink } from "../../../../utils";

type UrlLinkProps = {
  value: string;
};

export const UrlLink = ({ value }: UrlLinkProps) => {
  const { theme } = useDeskproAppTheme();
  const { context } = useDeskproLatestAppContext();

  if (!context?.settings) {
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
        href={getObjectPermalink(context.settings, value)}
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
