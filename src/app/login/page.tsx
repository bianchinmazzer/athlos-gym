"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    // Fetch profile to determine role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--athlos-dark)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          style={{
            position: "absolute", top: "20%", left: "50%",
            transform: "translateX(-50%)",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,83,58,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "10%", right: "10%",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image
              src="/images/athlos-logo.png"
              alt="Athlos Gym"
              width={200}
              height={200}
              style={{ height: "70px", width: "auto", objectFit: "contain" }}
            />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                letterSpacing: "0.08em",
              }}
              className="gradient-text"
            >
              ATHLOS GYM
            </h1>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--athlos-muted)",
              marginTop: "4px",
            }}
          >
            Ingresá con tu cuenta
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--athlos-muted)",
                }}
              >
                Email
              </label>
              <input
                id="email"
                className="athlos-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--athlos-muted)",
                }}
              >
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  className="athlos-input"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--athlos-muted)", background: "none", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center",
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3"
                style={{
                  background: "rgba(232,83,58,0.1)",
                  border: "1px solid rgba(232,83,58,0.2)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--athlos-coral)",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, marginTop: "4px", width: "100%" }}
            >
              {loading && <div className="athlos-spinner" />}
              {loading ? "INGRESANDO..." : "INGRESAR"}
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--athlos-muted)",
          }}
        >
          ¿No tenés cuenta? Contactá al administrador.
        </p>
      </div>
    </div>
  );
}
