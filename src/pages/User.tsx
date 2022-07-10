import { useDeskproElements } from "@deskpro/app-sdk";

export const User = () => {
    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    return <>User Page</>;
};
