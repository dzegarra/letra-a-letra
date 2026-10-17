import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import "./index.css";
import App from "./App.tsx";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* antd styles go in the `antd` cascade layer so Tailwind's utilities (declared after it in index.css) can override them */}
    <StyleProvider layer>
      <App />
    </StyleProvider>
  </StrictMode>,
);
