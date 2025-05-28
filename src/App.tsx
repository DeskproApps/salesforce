import {
  LoadingSpinner,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { Button, Stack, AnyIcon } from "@deskpro/deskpro-ui";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { QueryClientProvider, QueryErrorResetBoundary } from "react-query";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Organization } from "./pages/Organization";
import { Ticket } from "./pages/Ticket";
import { User } from "./pages/User";
import { GlobalSignIn } from "./pages/admin/GlobalSignIn";
import { Account } from "./pages/admin/mapping/Account";
import { Contact } from "./pages/admin/mapping/Contact";
import { Event } from "./pages/admin/mapping/Event";
import { Lead } from "./pages/admin/mapping/Lead";
import { Note } from "./pages/admin/mapping/Note";
import { Opportunity } from "./pages/admin/mapping/Opportunity";
import { Task } from "./pages/admin/mapping/Task";
import { List } from "./pages/list/List";
import { View } from "./pages/view/View";
import { query } from "./query";

import "./App.css";

import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import { ScrollTop } from "./components/ScrollTop";
import { CreateActivity } from "./pages/createEdit/Activity";
import { CreateNote } from "./pages/createEdit/Note";
import { CreateOpportunity } from "./pages/createEdit/Opportunity";
import { EditProfile } from "./pages/createEdit/Profile";
import { parseJsonErrorMessage } from "./utils";
import { ErrorBoundary } from "@sentry/react";

function App() {
  const { context } = useDeskproLatestAppContext();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  useDeskproAppEvents({
    onElementEvent: (id, type, payload) => {
      if (type === "home_button") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const basePath = payload?.basePath;
        payload && navigate(basePath);
      }
    },
  });

  // We don't have a context in admin that we care about, so just load the page straight away
  if (!["/admin/global-sign-in"].includes(pathname) && !context) {
    return <LoadingSpinner />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ScrollTop />
      <QueryClientProvider client={query}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallback={({ resetError, error }) => (
                  <Stack gap={6} style={{ padding: "8px" }} vertical>
                    There was an error!
                    <br />
                    <br />
                    {parseJsonErrorMessage((error as Error).message)}
                    <Button
                      text="Reload"
                      onClick={() => resetError()}
                      icon={faRefresh as AnyIcon}
                      intent="secondary"
                    />
                  </Stack>
                )}
              >
                <Routes>
                  <Route path="/">
                    <Route path="ticket">
                      <Route index element={<Ticket />} />
                      <Route path="objects">
                        <Route path=":object/:field/:id/list" element={<List />}/>
                        <Route path=":object/:id/view" element={<View />} />
                      </Route>
                    </Route>
                    <Route path="addoredit">
                      <Route path="note/:object/:id/" element={<CreateNote />} />
                      <Route path="Task/:object/:id/" element={<CreateActivity />}/>
                      <Route path="Call/:object/:id/" element={<CreateActivity />}/>
                      <Route path="Event/:object/:id/" element={<CreateActivity />}/>
                      <Route path="Opportunity/:object/:id/" element={<CreateOpportunity />}/>
                      <Route path="profile/:object/:id/" element={<EditProfile />}/>
                    </Route>
                    <Route path="user">
                      <Route index element={<User />} />
                      <Route path="objects">
                        <Route path=":object/:field/:id/list" element={<List />}/>
                        <Route path=":object/:id/view" element={<View />} />
                      </Route>
                    </Route>
                    <Route path="organization">
                      <Route index element={<Organization />} />
                      <Route path="objects">
                        <Route path=":object/:field/:id/list" element={<List />}/>
                        <Route path=":object/:id/view" element={<View />} />
                      </Route>
                    </Route>
                    <Route path="admin">
                      <Route path="global-sign-in" element={<GlobalSignIn />} />
                      <Route path="mapping">
                        <Route path="contact" element={<Contact />} />
                        <Route path="lead" element={<Lead />} />
                        <Route path="account" element={<Account />} />
                        <Route path="note" element={<Note />} />
                        <Route path="opportunity" element={<Opportunity />} />
                        <Route path="task" element={<Task />} />
                        <Route path="event" element={<Event />} />
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;
