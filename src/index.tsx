import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./assets/styles/index.scss";

const root = createRoot(document.getElementById("app") as HTMLDivElement);

root.render(
  <StrictMode>
    <App/>
  </StrictMode>
);