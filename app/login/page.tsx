import LoginForm from "@/components/LoginForm";

export default function Login({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const next = searchParams.next ?? "/";
  return (
    <div className="wrap seccion login">
      <h1 className="h1-estacion">Ingresar</h1>
      <p className="lead">
        Sin contraseña: te enviamos un enlace al correo. Sirve igual para viajeros que para emprendedores.
      </p>
      {searchParams.error && (
        <p className="msg-error" role="alert">El enlace venció o ya se usó. Pide uno nuevo.</p>
      )}
      <LoginForm next={next} />
    </div>
  );
}
