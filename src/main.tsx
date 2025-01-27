import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import App from "./App";
import "./main.css";
import "simplebar/dist/simplebar.min.css";
import { Scrollbar } from "@deskpro/deskpro-ui";
import { AppProvider, ReplyBoxProvider } from "./hooks";

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render((
  <React.StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <DeskproAppProvider>
        <AppProvider>
          <ReplyBoxProvider>
            <Router>
              <App />
            </Router>
          </ReplyBoxProvider>
        </AppProvider>
      </DeskproAppProvider>
    </Scrollbar>
  </React.StrictMode>
));
