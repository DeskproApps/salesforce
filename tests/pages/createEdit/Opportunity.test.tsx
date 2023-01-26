import { fireEvent, render, act, cleanup } from "@testing-library/react";
import * as React from "react";
import { waitFor } from "@testing-library/react";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";

import { CreateOpportunity } from "../../../src/pages/createEdit/Opportunity";
import * as APIFn from "../../../src/api/api";

const NEWDATE = new Date().getTime();

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <CreateOpportunity />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => ({
  ...jest.requireActual("../../../src/api/api"),
  getObjectMeta: jest.fn().mockReturnValue({
    fields: [
      {
        name: "Probability",
        label: "Probability",
        type: "percent",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "CloseDate",
        label: "CloseDate",
        type: "date",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "Amount",
        label: "Amount",
        type: "currency",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "StageName",
        label: "StageName",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "Description",
        label: "Description",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "Name",
        label: "Name",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
    ],
  }),
  getObjectById: () => ({
    Name: "David Pinto Exists",
    Description: "Just a description",
    StageName: "Prospecting",
    Amount: 30,
    CloseDate: new Date(NEWDATE + 2 * 60 * 1000).toISOString(),
    Probability: 1,
  }),
  getObjectsByQuery: () => [
    {
      Id: "005680000019W11AAE",
      Name: "Test User",
    },
  ],
  editData: jest.fn(() => new Promise((resolve) => resolve(null))),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({
    id: "123",
    object: "edit",
  }),
}));

describe("test", () => {
  test("Editing an opportunity with correct data should pass", async () => {
    const { findByTestId } = renderPage();

    await waitFor(async () => {
      await act(async () => {
        fireEvent.change(await findByTestId("input-Description"), {
          target: { value: "Edited Description" },
        });
        fireEvent(await findByTestId("submit-button"), new MouseEvent("click"));
      });

      expect(APIFn.editData).toHaveBeenCalledWith(
        expect.anything(),
        "Opportunity",
        "123",
        {
          Name: "David Pinto Exists",
          Description: "Edited Description",
          StageName: "Prospecting",
          Amount: 30,
          CloseDate: new Date(NEWDATE + 2 * 60 * 1000).toISOString(),
          Probability: 1,
        }
      );
    });
  });

  test("Edit an opportunity with out of bounds probability should fail", async () => {
    const { findByTestId } = renderPage();

    await act(async () => {
      fireEvent.change(await findByTestId("input-Probability"), {
        target: { value: 123 },
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
