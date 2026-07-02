import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getNextApiUrl } from "./lib/api";

// Tracking visiteurs via l'API Next.js
(function recordVisit() {
  fetch(getNextApiUrl("/api/visitors"), {
    method: "POST",
    mode: "cors",
    keepalive: true,
  }).catch((error) => {
    console.error("Erreur lors du suivi des visiteurs :", error);
  });
})();

createRoot(document.getElementById("root")!).render(<App />);
