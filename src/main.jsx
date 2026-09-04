import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { startAuth } from "./auth";

const container = document.getElementById("root");
const root = createRoot(container);

startAuth((user) => {
  console.log("Auth ready in main, uid:", user.uid);
  root.render(
    <React.StrictMode>
      <App initialUser={user} />
    </React.StrictMode>
  );
});
