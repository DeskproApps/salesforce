import {useDeskproAppTheme} from "@deskpro/app-sdk";
import "./PropertyEmpty.css";

export const PropertyEmpty = () => {
    const { theme } = useDeskproAppTheme();

    return (
        <span className="sf-property-empty" style={{ color: theme.colors.grey20 }}>
            ---
        </span>
    );
};
