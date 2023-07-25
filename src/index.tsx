import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.scss";

const root = createRoot(document.getElementById("root") as HTMLDivElement);

root.render(
  <StrictMode>
    Hello World!
  </StrictMode>
);