import React from "react";
import { render } from "react-dom";
import "react-toastify/dist/ReactToastify.css";
// import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

document.addEventListener("DOMContentLoaded", () => {
  render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
