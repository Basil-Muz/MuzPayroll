import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LoaderProvider } from "./context/LoaderContext";

// Runs FIRST before any page renders
const savedTheme = localStorage.getItem("theme");
const userPreference = localStorage.getItem("theme-manual");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const theme =
  userPreference === "true"
    ? savedTheme
    : savedTheme || (prefersDark ? "dark" : "light");

document.documentElement.setAttribute("data-theme", theme);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </BrowserRouter>,
);
