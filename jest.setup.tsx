/* eslint-disable @typescript-eslint/no-explicit-any */
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";
import { theme } from "./tests/mocks";

global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React

// jest.mock("styled-components", () => ({default:() => () => ({
//   h1: {attrs:() => {}},
//   h2: {attrs:() => {}},
//   h3: {attrs:() => {}},
//   h4: {attrs:() => {}},
//   h5: {attrs:() => {}},
//   h6: {attrs:() => {}},
//   p: {attrs:() => {}},
// }), css: () => {}}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproAppEvents: (
    hooks: { [key: string]: (param: Record<string, unknown>) => void },
    deps: [] = []
  ) => {
    const deskproAppEventsObj = {
      data: {
        ticket: {
          id: 1,
          subject: "Test Ticket",
        },
      },
    };
    React.useEffect(() => {
      !!hooks.onChange && hooks.onChange(deskproAppEventsObj);
      !!hooks.onShow && hooks.onShow(deskproAppEventsObj);
      !!hooks.onReady && hooks.onReady(deskproAppEventsObj);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useInitialisedDeskproAppClient: (
    callback: (param: Record<string, unknown>) => void
  ) => {
    callback({
      registerElement: () => {},
      deregisterElement: () => {},
      setTitle: () => {},
    });
  },
  useDeskproAppTheme: () => ({theme}),
  proxyFetch: async () => fetch,
}));

jest.mock("./src/hooks.ts",() => ({
    ...jest.requireActual("./src/hooks.ts"),
    useQueryWithClient: (queryKey:string, queryFn: () => any, options: any ) => {
        queryKey;
        options;
        return queryFn();
    }
}))