import { fireEvent, render, act, cleanup } from "@testing-library/react";
import * as React from "react";
import { waitFor } from "@testing-library/react";
import { CreateNote } from "../../../src/pages/createEdit/Note";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import * as APIFn from "../../../src/api/api";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <CreateNote />
    </ThemeProvider>
  );
};

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

describe("Edit note", () => {
  test("Editing a note with correct data should pass", async () => {
    const { findByTestId } = renderPage();

    await waitFor(async () => {
      await act(async () => {
        fireEvent.change(await findByTestId("title-input"), {
          target: { value: "Test title" },
        });
        fireEvent.change(await findByTestId("body-input"), {
          target: { value: "Test body" },
        });
        fireEvent(await findByTestId("submit-button"), new MouseEvent("click"));
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

  test("Editing a note with no title should fail", async () => {
    const { findByTestId } = renderPage();

    await act(async () => {
      fireEvent.change(await findByTestId("title-input"), {
        target: { value: "" },
      });
      fireEvent.change(await findByTestId("body-input"), {
        target: { value: "Test body" },
      });
      fireEvent(await findByTestId("submit-button"), new MouseEvent("click"));
    });

    expect(APIFn.editData).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
