import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <DeskproAppProvider>
        <Router>
            <App />
        </Router>
    </DeskproAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
