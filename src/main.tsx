import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@figma/astraui";
import App from "./App";
import "./index.css";

try {
  if (!localStorage.getItem("astra-theme")) {
    localStorage.setItem("astra-theme", "dark");
  }
} catch {
  // ThemeProvider will fall back to the system preference when storage is unavailable.
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
