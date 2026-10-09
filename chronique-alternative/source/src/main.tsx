import { createRoot } from "react-dom/client";
import Home from "./page";
import "./globals.css";
import "./integration.css";
import "./ui/v2/v2.css";
import "./ui/v2/v2-integration.css";
import "./ui/v2/v2-fenetres.css";
import "./hylee-naiah.css";
import "./bellirith-naiah.css";
import "./ui/v2/v2-lecture.css";

const root = document.getElementById("root");

if (!root) throw new Error("Le point de montage de la Chronique Alternative est absent.");

createRoot(root).render(<Home />);
