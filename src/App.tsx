import { Suspense } from "react";
import {
    Button,
    LoadingSpinner,
    Stack,
    useDeskproLatestAppContext
} from "@deskpro/app-sdk";
import { Routes, Route, useLocation } from "react-router-dom";
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

import "./App.css";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

function App() {
    const { context } = useDeskproLatestAppContext();
    const { pathname } = useLocation();

    // We don't have a context in admin that we care about, so just load the page straight away
    if (!["/admin/global-sign-in"].includes(pathname) && !context) {
        return <LoadingSpinner />;
    }

    return (
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
                                    </Route>
                                    <Route path="user">
                                        <Route index element={<User />} />
                                    </Route>
                                    <Route path="organization">
                                        <Route index element={<Organization />} />
                                    </Route>
                                    <Route path="admin">
                                        <Route path="global-sign-in" element={<GlobalSignIn />} />
                                        <Route path="mapping">
                                            <Route path="contact" element={<Contact />} />
                                            <Route path="lead" element={<Lead />} />
                                            <Route path="account" element={<Account />} />
                                        </Route>
                                    </Route>
                                </Route>
                            </Routes>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </Suspense>
        </QueryClientProvider>
    );
}

export default App;
