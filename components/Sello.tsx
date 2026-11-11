import { useId } from "react";

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

type Props = {
  e: { id: string; corto: string; color: string };
  fecha?: string;
  size?: number;
  nuevo?: boolean;
};

/** Sello circular tipo timbre postal. Sin fecha = casillero vacío. */
export default function Sello({ e, fecha, size = 140, nuevo }: Props) {
  const u = useId().replace(/:/g, "");
  const activo = !!fecha;
  const color = e.color;
  const rot = (hash(e.id) % 21) - 10;
  const d = fecha ? new Date(fecha) : null;
  const dia = d ? String(d.getDate()) : "";
  const mes = d ? d.toLocaleDateString("es-CL", { month: "short" }).replace(".", "") : "";
  const anio = d ? String(d.getFullYear()) : "";

  return (
    <div style={{ width: size, height: size, transform: `rotate(${rot}deg)` }}>
      <svg
        viewBox="0 0 140 140"
        width={size}
        height={size}
        role="img"
        aria-label={activo ? `Sello de ${e.corto}, ${dia} ${mes} ${anio}` : `Sello de ${e.corto} por conseguir`}
        className={nuevo ? "sello-nuevo" : undefined}
        style={{ color: activo ? color : "var(--tinta-2)", opacity: activo ? 0.92 : 0.45 }}
      >
        <defs>
          <path id={`${u}-t`} d="M 24,70 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
          <path id={`${u}-b`} d="M 15,70 a 55,55 0 0,0 110,0" />
        </defs>
        <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={activo ? undefined : "4 5"} />
        <circle cx="70" cy="70" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text fontSize="12" fontWeight="700" letterSpacing="1.5" fill="currentColor" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <textPath href={`#${u}-t`} startOffset="25%" textAnchor="middle">
            {e.corto.toUpperCase()}
          </textPath>
        </text>
        <text fontSize="9" letterSpacing="2" fill="currentColor" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <textPath href={`#${u}-b`} startOffset="50%" textAnchor="middle">
            {activo ? `MELIPILLA ${anio}` : "POR SELLAR"}
          </textPath>
        </text>
        {activo ? (
          <>
            <text x="70" y="72" textAnchor="middle" fontSize="26" fontWeight="800" fill="currentColor" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {dia}
            </text>
            <text x="70" y="88" textAnchor="middle" fontSize="11" letterSpacing="1" fill="currentColor" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {mes.toUpperCase()}
            </text>
          </>
        ) : (
          <text x="70" y="78" textAnchor="middle" fontSize="24" fill="currentColor" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            ?
          </text>
        )}
      </svg>
    </div>
  );
}
