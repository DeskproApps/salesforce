import { Suspense } from "react";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { Routes, Route } from "react-router-dom";
import { Ticket } from "./pages/Ticket";
import { User } from "./pages/User";
import { Organization } from "./pages/Organization";
import { QueryClientProvider } from "react-query";
import { GlobalSignIn } from "./pages/admin/GlobalSignIn";
import { queryClient } from "./queryClient";

import "./App.css";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LoadingSpinner />}>
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
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </QueryClientProvider>
    );
}

export default App;
