import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BodyContainer from "./containers/BodyContainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <BodyContainer />
      <ToastContainer />
    </div>
  );
}

export default App;
