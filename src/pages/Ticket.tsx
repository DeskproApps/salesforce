import { useDeskproElements } from "@deskpro/app-sdk";

export const Ticket = () => {
    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    return <>Ticket Page</>;
};
