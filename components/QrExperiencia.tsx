"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrExperiencia({ slug, titulo }: { slug: string; titulo: string }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  return (
    <div className="ficha qr-ficha">
      <div>
        <h3>QR de tu experiencia</h3>
        <p className="meta">Imprímelo y ponlo en la entrada. Quien lo escanee verá la ficha de «{titulo}» y podrá sellar su pasaporte.</p>
        <button type="button" className="btn no-print" onClick={() => window.print()}>Imprimir QR</button>
      </div>
      {origin && <QRCodeSVG value={`${origin}/experiencia/${slug}`} size={150} bgColor="transparent" fgColor="#14302a" />}
    </div>
  );
}
