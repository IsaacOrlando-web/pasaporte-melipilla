"use client";
import { useEffect, useState } from "react";

export default function EscucharHistoria({ texto }: { texto: string }) {
  const [hablando, setHablando] = useState(false);

  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function alternar() {
    if (!("speechSynthesis" in window)) return;
    if (hablando) {
      window.speechSynthesis.cancel();
      setHablando(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "es-CL";
    u.onend = () => setHablando(false);
    u.onerror = () => setHablando(false);
    setHablando(true);
    window.speechSynthesis.speak(u);
  }

  return (
    <button type="button" className="btn" onClick={alternar}>
      {hablando ? "Detener audio" : "Escuchar la historia"}
    </button>
  );
}
