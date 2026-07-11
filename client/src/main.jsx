import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

const VERSION_FILE = `${import.meta.env.BASE_URL}version.json`;

async function ensureFreshBuild() {
  if (typeof window === "undefined") return false;
  const currentVersion = new URLSearchParams(window.location.search).get("v");

  try {
    const response = await fetch(VERSION_FILE, { cache: "no-store" });
    if (!response.ok) return false;

    const payload = await response.json();
    const latestVersion = payload.version;

    if (latestVersion && currentVersion !== latestVersion) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("v", latestVersion);
      window.location.replace(nextUrl.toString());
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

const root = ReactDOM.createRoot(document.getElementById("root"));

(async () => {
  if (!(await ensureFreshBuild())) {
    root.render(
      <StrictMode>
        <BrowserRouter basename="/cryptoTester">
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
  }
})();
