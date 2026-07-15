import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "WAIRB DRC SAS — Courtier en Assurance à Kinshasa",
  description: "WAIRB DRC SAS, société de courtage en assurance à Kinshasa, RDC. Solutions d'assurance habitation, automobile, multirisque professionnelle, violence politique et terrorisme."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
