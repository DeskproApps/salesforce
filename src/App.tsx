import "./App.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import { Account } from "./pages/admin/mapping/Account";
import { AdminCallbackPage } from "./pages/admin/callback/AdminCallbackPage";
import { Button, Stack, AnyIcon } from "@deskpro/deskpro-ui";
import { Contact } from "./pages/admin/mapping/Contact";
import { CreateActivity } from "./pages/createEdit/Activity";
import { CreateNote } from "./pages/createEdit/Note";
import { CreateOpportunity } from "./pages/createEdit/Opportunity";
import { DndProvider } from "react-dnd";
import { EditProfile } from "./pages/createEdit/Profile";
import { ErrorBoundary } from "react-error-boundary";
import { Event } from "./pages/admin/mapping/Event";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { GlobalSignIn } from "./pages/admin/GlobalSignIn";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Lead } from "./pages/admin/mapping/Lead";
import { List } from "./pages/list/List";
import { Note } from "./pages/admin/mapping/Note";
import { Opportunity } from "./pages/admin/mapping/Opportunity";
import { Organization } from "./pages/Organization";
import { parseJsonErrorMessage } from "./utils";
import { query } from "./query";
import { QueryClientProvider, QueryErrorResetBoundary } from "react-query";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ScrollTop } from "./components/ScrollTop";
import { Suspense } from "react";
import { Task } from "./pages/admin/mapping/Task";
import { Ticket } from "./pages/Ticket";
import { User } from "./pages/User";
import { View } from "./pages/view/View";
import {LoadingSpinner,useDeskproAppEvents,useDeskproLatestAppContext} from "@deskpro/app-sdk";

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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary, error }) => (
                  <Stack gap={6} style={{ padding: "8px" }} vertical>
                    There was an error!
                    <br />
                    <br />
                    {parseJsonErrorMessage(error.message)}
                    <Button
                      text="Reload"
                      onClick={() => resetErrorBoundary()}
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
                        <Route path=":object/:field/:id/list" element={<List />} />
                        <Route path=":object/:id/view" element={<View />} />
                      </Route>
                    </Route>
                    <Route path="addoredit">
                      <Route path="note/:object/:id/" element={<CreateNote />} />
                      <Route path="Task/:object/:id/" element={<CreateActivity />} />
                      <Route path="Call/:object/:id/" element={<CreateActivity />} />
                      <Route path="Event/:object/:id/" element={<CreateActivity />} />
                      <Route path="Opportunity/:object/:id/" element={<CreateOpportunity />} />
                      <Route path="profile/:object/:id/" element={<EditProfile />} />
                    </Route>
                    <Route path="user">
                      <Route index element={<User />} />
                      <Route path="objects">
                        <Route path=":object/:field/:id/list" element={<List />} />
                        <Route path=":object/:id/view" element={<View />} />
                      </Route>
                    </Route>
                    <Route path="organization">
                      <Route index element={<Organization />} />
                      <Route path="objects">
                        <Route path=":object/:field/:id/list" element={<List />} />
                        <Route path=":object/:id/view" element={<View />} />
                      </Route>
                    </Route>
                    <Route path="admin">
                      <Route path="callback" element={<AdminCallbackPage />} />
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
