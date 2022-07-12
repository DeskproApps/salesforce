import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { Logo } from "../Logo/Logo";
import "./ExternalLink.css";

type ExternalLinkProps = {
    url: string;
    logo?: boolean;
};

export const ExternalLink = ({ url, logo = true }: ExternalLinkProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <a href={url} target="_blank" className="sf-external-link" style={{ backgroundColor: theme.colors.brandShade10 }}>
            {logo && <Logo style={{ height: "10px", marginRight: "6px" }} />}
            <FontAwesomeIcon icon={faExternalLink} size="xs" color={theme.colors.brandShade100} />
        </a>
    );
};
