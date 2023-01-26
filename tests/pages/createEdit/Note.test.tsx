import { fireEvent, render, screen, act } from "@testing-library/react";
import * as React from "react";
import { waitFor } from "@testing-library/react";
import { CreateNote } from "../../../src/pages/createEdit/Note";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import * as APIFn from "../../../src/api/api";

jest.mock("../../../src/api/api", () => ({
  ...jest.requireActual("../../../src/api/api"),
  getObjectById: jest.fn().mockReturnValue({
    Title: "Test title",
    Body: "Test body",
  }),
  editData: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ search: {} }),
  useParams: () => ({
    id: "123",
    object: "edit",
  }),
}));

test("Edit note", async () => {
  render(
    <ThemeProvider theme={lightTheme}>
      <CreateNote />
    </ThemeProvider>
  );

  await waitFor(async () => {
    await act(async () => {
      fireEvent.change(screen.getByTestId("title-input"), {
        target: { value: "Test title" },
      });
      fireEvent.change(screen.getByTestId("body-input"), {
        target: { value: "Test body" },
      });
      fireEvent(screen.getByTestId("submit-button"), new MouseEvent("click"));
    });

    expect(APIFn.editData).toHaveBeenCalledWith(
      expect.anything(),
      "Note",
      "123",
      {
        Title: "Test title",
        Body: "Test body",
      }
    );
  });
});
