import { Suspense } from "react";
import {
    Button,
    LoadingSpinner,
    Stack, useDeskproAppEvents,
    useDeskproLatestAppContext
} from "@deskpro/app-sdk";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Ticket } from "./pages/Ticket";
import { User } from "./pages/User";
import { Organization } from "./pages/Organization";
import { QueryClientProvider, QueryErrorResetBoundary } from "react-query";
import { GlobalSignIn } from "./pages/admin/GlobalSignIn";
import { query } from "./query";
import { ErrorBoundary } from "react-error-boundary";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Contact } from "./pages/admin/mapping/Contact";
import { Lead } from "./pages/admin/mapping/Lead";
import { Account } from "./pages/admin/mapping/Account";
import { Task } from "./pages/admin/mapping/Task";
import { Event } from "./pages/admin/mapping/Event";
import {View} from "./pages/view/View";
import {List} from "./pages/list/List";
import {match} from "ts-pattern";
import {Note} from "./pages/admin/mapping/Note";
import {Opportunity} from "./pages/admin/mapping/Opportunity";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import {ScrollTop} from "./components/ScrollTop";
import { CreateNote } from "./pages/create/Note";
import { CreateActivity } from "./pages/create/Activity";

function App() {
    const { context } = useDeskproLatestAppContext();
    const { pathname } = useLocation();

    const navigate = useNavigate();

    useDeskproAppEvents({
        onElementEvent: (id, type, payload) => match([id, type])
            .with(["home", "home_button"], () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const basePath = payload?.basePath;
                payload && navigate(basePath);
            })
            .run()
        ,
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
                            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => (
                                <Stack gap={6} style={{ padding: "8px" }} vertical>
                                    There was an error!
                                    <Button text="Reload" onClick={() => resetErrorBoundary()} icon={faRefresh} intent="secondary" />
                                </Stack>
                            )}>
                                <Routes>
                                    <Route path="/">
                                        <Route path="ticket">
                                            <Route index element={<Ticket />} />
                                            <Route path="objects">
                                                <Route path=":object/:field/:id/list" element={<List />} />
                                                <Route path=":object/:id/view" element={<View />} />
                                            </Route>
                                        </Route>
                                        <Route path="add">
                                            <Route path="note/:parentId" element={<CreateNote />} />
                                            <Route path="activity/:object/:parentId" element={<CreateActivity />} />
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
