import { useDeskproElements } from "@deskpro/app-sdk";

export const Organization = () => {
    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    return <>Organization Page</>;
};
