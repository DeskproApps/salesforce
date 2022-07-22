import {To} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import {ReactNode} from "react";
import {useDeskproAppTheme} from "@deskpro/app-sdk";

type LinkProps = {
    to: To;
    children: ReactNode;
};

export const Link = ({ to, children }: LinkProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <RouterLink to={to} style={{ color: theme.colors.cyan100, textDecoration: "none" }}>
            {children}
        </RouterLink>
    );
};