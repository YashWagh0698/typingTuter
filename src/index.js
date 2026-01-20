import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";

// For accessibility: ensure React app mounts correctly
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
