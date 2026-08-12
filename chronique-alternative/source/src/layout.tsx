import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sylvinia — Les Liens du Crépuscule",
  description: "Un dating sim narratif complet dans l’univers de Sylvinia.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
