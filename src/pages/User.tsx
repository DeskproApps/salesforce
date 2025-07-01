/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  useDeskproElements,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { Container } from "../components/Container/Container";

export const User = () => {
  useDeskproElements(({ registerElement, deRegisterElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    deRegisterElement("salesforcePlusButton");
    deRegisterElement("salesforceEditButton");
  });

  const [errorState, setErrorState] = useState<string | null>(null)

  useEffect(() => {
    if (errorState === "left") {
      throw new Error("Hello from Salesforce")
    }

    if (errorState === "right") {
      throw "HI from Salesforce"
    }
  }, [errorState])

  return (
    <Container>
      <Button
        text="Left Error"
        onClick={() => { setErrorState("left") }}
      />
      <Button
        text="Right Error"
        onClick={() => { setErrorState("right") }}
      />
      <LoadingSpinner />
    </Container>
  );
};
