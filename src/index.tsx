import React from "react";
import { createRoot } from "react-dom/client";

import "figma-plugin-ds/dist/figma-plugin-ds.css";

import App from "./App";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App />);
});
