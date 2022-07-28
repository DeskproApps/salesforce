import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { Logo } from "../Logo/Logo";
import "./ExternalLink.css";
import {CSSProperties} from "react";

type ExternalLinkProps = {
    url: string;
    logo?: boolean;
    style?: CSSProperties;
};

export const ExternalLink = ({ url, style = {}, logo = true }: ExternalLinkProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <a href={url} target="_blank" className="sf-external-link" style={{ backgroundColor: theme.colors.brandShade10, ...style }}>
            {logo && <Logo style={{ height: "10px", marginRight: "6px" }} />}
            <FontAwesomeIcon icon={faExternalLink} size="xs" color={theme.colors.brandShade100} />
        </a>
    );
};
