import type { Metadata } from "next";
import { Bricolage_Grotesque, Literata } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Literata({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Pasaporte de Bienestar Rural Melipilla",
  description: "Recorre Melipilla sello a sello: cabalgatas, huertos, bosque y cocinas comunitarias contados por quienes los habitan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap">
            Demo con datos ficticios. Los sellos y las fichas se guardan solo en este navegador.
          </div>
        </footer>
      </body>
    </html>
  );
}
