import { fireEvent, render, screen, act } from "@testing-library/react";
import * as React from "react";
import { waitFor } from "@testing-library/react";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";

import { CreateActivity } from "../../../src/pages/createEdit/Activity";
import * as APIFn from "../../../src/api/api";

const NEWDATE = new Date().getTime();

jest.mock("../../../src/api/api", () => ({
  ...jest.requireActual("../../../src/api/api"),
  getObjectMeta: jest.fn().mockReturnValue({
    fields: [
      {
        name: "Subject",
        label: "Subject",
        type: "string",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "Location",
        label: "Location",
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
      {
        name: "EndDateTime",
        label: "EndDateTime",
        type: "date",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "StartDateTime",
        label: "StartDateTime",
        type: "date",
        updateable: true,
        defaultedOnCreate: false,
        nillable: false,
        createable: true,
        referenceTo: [],
      },
      {
        name: "Type",
        label: "Type",
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
    Subject: "abcdef",
    Location: "d",
    StartDateTime: new Date(NEWDATE + 60 * 1000).toISOString(),
    EndDateTime: new Date(NEWDATE + 2 * 60 * 1000).toISOString(),
    OwnerId: "005680000019W11AAE",
    Type: "Event",
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
  useLocation: () => ({ search: "?type=Event" }),
  useParams: () => ({
    id: "123",
    object: "edit",
  }),
}));

test("Edit Activity", async () => {
  render(
    <ThemeProvider theme={lightTheme}>
      <CreateActivity />
    </ThemeProvider>
  );

  await waitFor(async () => {
    await act(async () => {
      fireEvent.change(screen.getByTestId("input-Subject"), {
        target: { value: "Test Subject" },
      });
      fireEvent(screen.getByTestId("submit-button"), new MouseEvent("click"));
    });

    expect(APIFn.editData).toHaveBeenCalledWith(
      expect.anything(),
      "Event",
      "123",
      {
        Subject: "Test Subject",
        Location: "d",
        StartDateTime: new Date(NEWDATE + 60 * 1000).toISOString(),
        EndDateTime: new Date(NEWDATE + 2 * 60 * 1000).toISOString(),
        OwnerId: "005680000019W11AAE",
      }
    );
  });
});
