import React from "react";
import { createRoot } from "react-dom/client";
import { LoginContext } from "./store/loginContext";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <LoginContext.Provider>
      <App />
    </LoginContext.Provider>
  </React.StrictMode>
);
