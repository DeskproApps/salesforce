import { HashRouter } from "react-router-dom";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import * as React from "react";
import { EditProfile } from "../../../src/pages/createEdit/Profile";
import * as APIFn from "../../../src/api/api";

const renderPage = () => {
  return render(
    <HashRouter>
      <ThemeProvider theme={lightTheme}>
        <EditProfile />
      </ThemeProvider>
    </HashRouter>
  );
};

jest.mock("../../../src/api/api", () => ({
  ...jest.requireActual("../../../src/api/api"),
  getObjectMeta: jest.fn().mockReturnValue({
    fields: [
      {
        name: "LastName",
        label: "Last Name",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "Company",
        label: "Company",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "OwnerId",
        label: "OwnerId",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: ["User"],
      },
    ],
  }),
  getObjectById: () => ({
    LastName: "Abdhul",
    OwnerId: "005680000019W11AAE",
    Company: "Deskpro",
  }),
  getObjectsByQuery: () => [
    {
      Id: "005680000019W11AAE",
      Name: "Test User",
    },
  ],
  editData: jest.fn(() => new Promise((resolve) => resolve(null))),
}));

jest.mock("../../../src/utils", () => ({
  ...jest.requireActual("../../../src/utils"),
  getScreenLayout: () => ({
    root: [
      [
        {
          id: "LastName",
          property: {
            name: "LastName",
            label: "Last Name",
            type: "string",
          },
        },
      ],
      [
        {
          id: "OwnerId",
          property: {
            name: "OwnerId",
            label: "Owner Id",
            type: "reference",
          },
        },
      ],
      [
        {
          id: "Company",
          property: {
            name: "Company",
            label: "Company",
            type: "string",
          },
        },
      ],
    ],
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ search: "?type=Event" }),
  useParams: () => ({ id: "123", object: "Lead" }),
}));

describe("Edit Activity", () => {
  test("Edit a profile with correct data should pass", async () => {
    const { findByTestId } = renderPage();

    await waitFor(async () => {
      await act(async () => {
        fireEvent.change(await findByTestId("input-Company"), {
          target: { value: "AJP" },
        });
        fireEvent(await findByTestId("submit-button"), new MouseEvent("click"));
      });

      expect(APIFn.editData).toHaveBeenCalledWith(
        expect.anything(),
        "Lead",
        "123",
        {
          LastName: "Abdhul",
          Company: "AJP",
          OwnerId: "005680000019W11AAE",
        }
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
