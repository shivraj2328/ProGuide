// strictmdoe :helps to detect the isssssue.
import { StrictMode } from "react";     
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

//root:main div where the react app is rendered
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
  </StrictMode>
);