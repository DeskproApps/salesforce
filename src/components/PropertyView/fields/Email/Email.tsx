import {useDeskproAppTheme} from "@deskpro/app-sdk";

type EmailProps = {
    value: string;
};

export const Email = ({ value }: EmailProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <a href={`mailto:${value}`} style={{ color: theme.colors.cyan100, textDecoration: "none" }}>
            {value}
        </a>
    );
};
