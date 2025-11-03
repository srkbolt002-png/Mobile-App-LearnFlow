import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMobileCapabilities } from "./lib/mobileCapabilities.ts";
import { initializeTheme } from "./lib/themeInitializer.ts";

// Initialize theme BEFORE React renders to prevent flash
initializeTheme();

// Initialize mobile capabilities
initializeMobileCapabilities();

createRoot(document.getElementById("root")!).render(<App />);
