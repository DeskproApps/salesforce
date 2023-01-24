import { render } from "@testing-library/react";
import * as React from "react";
import { waitFor } from "@testing-library/react";
import { CreateNote } from "../../../src/pages/createEdit/Note";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import * as APIFn from "../../../src/api/api";

jest.mock("../../../src/api/api", () => ({
    ...jest.requireActual("../../../src/api/api"),
    getObjectById: jest.fn().mockResolvedValue({
        Title: "Test title",
        Body: "Test body",
    }),
}));

test("Edit note", async () => {
  const { getByText } = render(<ThemeProvider theme={lightTheme}><CreateNote /></ThemeProvider>);

  await waitFor(() => {
    const headingElement = getByText(/Body/i);

    expect(headingElement).toBeInTheDocument();
  });
});
