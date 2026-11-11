import type { Metadata, Viewport } from "next";
import { Kaushan_Script, Lora, Nunito } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const serif = Lora({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Nunito({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const script = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  title: "RAÍCES, experiencias rurales en Melipilla",
  description: "Descubre Melipilla a través de sus personas, sabores, naturaleza y tradiciones.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4b5a2b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap">Versión de demostración de RAÍCES. Los datos son de prueba.</div>
        </footer>
      </body>
    </html>
  );
}
