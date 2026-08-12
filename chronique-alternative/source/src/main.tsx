import { createRoot } from "react-dom/client";
import Home from "./page";
import "./globals.css";
import "./integration.css";

const root = document.getElementById("root");

if (!root) throw new Error("Le point de montage de la Chronique Alternative est absent.");

createRoot(root).render(<Home />);
