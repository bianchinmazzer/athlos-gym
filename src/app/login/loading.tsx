export default function LoginLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--athlos-dark)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="athlos-spinner-lg" />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            color: "var(--athlos-muted)",
            letterSpacing: "0.05em",
          }}
        >
          Cargando...
        </p>
      </div>
    </div>
  );
}
