import { useDeskproElements } from "@deskpro/app-sdk";

export const Ticket = () => {
  useDeskproElements(({ registerElement, deRegisterElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    deRegisterElement("salesforcePlusButton");
    deRegisterElement("salesforceEditButton");
  });

  return <>Ticket Page</>;
};
