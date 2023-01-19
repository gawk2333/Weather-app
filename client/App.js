import React from "react";
import BodyContainer from "./containers/BodyContainer";
import { ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BodyContainer />
      <ToastContainer />
    </div>
  );
}

export default App;
