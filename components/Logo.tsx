export default function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 90 60" className="logo-icono" aria-hidden="true">
        <path d="M2 46 C18 28 38 34 54 41" fill="none" stroke="#4b5a2b" strokeWidth="3" strokeLinecap="round" />
        <path d="M2 52 C26 42 50 48 74 40" fill="none" stroke="#4b5a2b" strokeWidth="3" strokeLinecap="round" />
        <path d="M63 42 V28" stroke="#6b4a2b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="63" cy="17" r="11" fill="#4b5a2b" />
        <circle cx="54" cy="22" r="7" fill="#4b5a2b" />
        <circle cx="72" cy="22" r="7" fill="#4b5a2b" />
        <circle cx="60" cy="14" r="2" fill="#a9bb62" />
        <circle cx="68" cy="19" r="2" fill="#a9bb62" />
        <circle cx="55" cy="21" r="1.6" fill="#a9bb62" />
      </svg>
      <span className="logo-texto">
        <span className="logo-nombre">RAÍCES</span>
        <span className="logo-lema">Experiencias para conectar con lo esencial</span>
      </span>
    </span>
  );
}
