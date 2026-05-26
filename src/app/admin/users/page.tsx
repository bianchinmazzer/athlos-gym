"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "user" });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (u: Profile) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const method = editUser ? "PUT" : "POST";
    const body = editUser
      ? { id: editUser.id, name: form.name, role: form.role, ...(form.password ? { password: form.password } : {}) }
      : form;

    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al guardar");
    } else {
      setShowModal(false);
      fetchUsers();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(false);
    setDeleteId(null);
    fetchUsers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--athlos-white)", letterSpacing: "0.04em" }}>
            USUARIOS
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-muted)" }}>
            Gestioná los accesos al sistema
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="athlos-spinner-lg" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Nombre", "Email", "Rol", "Creado", "Acciones"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 16px", textAlign: "left",
                      fontFamily: "var(--font-body)", fontSize: "0.7rem",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--athlos-muted)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-body)", color: "var(--athlos-white)" }}>{u.name}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-body)", color: "var(--athlos-muted)", fontSize: "0.9rem" }}>{u.email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "100px", fontSize: "0.7rem",
                        fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase",
                        background: u.role === "admin" ? "rgba(232,83,58,0.15)" : "rgba(78,205,196,0.1)",
                        color: u.role === "admin" ? "var(--athlos-coral)" : "var(--athlos-teal)",
                        border: `1px solid ${u.role === "admin" ? "rgba(232,83,58,0.3)" : "rgba(78,205,196,0.2)"}`,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-body)", color: "var(--athlos-muted)", fontSize: "0.85rem" }}>
                      {new Date(u.created_at).toLocaleDateString("es-AR")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="flex items-center gap-2">
                        {u.role === "user" && (
                          <button onClick={() => router.push(`/admin/users/${u.id}/routines`)}
                            title="Rutinas"
                            style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", transition: "color 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-orange)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                            <ClipboardList size={16} />
                          </button>
                        )}
                        <button onClick={() => openEdit(u)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", transition: "color 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-teal)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(u.id)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", transition: "color 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "var(--athlos-muted)", fontFamily: "var(--font-body)" }}>
                      No hay usuarios todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md" style={{ background: "var(--athlos-navy)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--athlos-white)" }}>
                {editUser ? "EDITAR USUARIO" : "NUEVO USUARIO"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>Nombre</label>
                <input className="athlos-input" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              {!editUser && (
                <div className="flex flex-col gap-2">
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>Email</label>
                  <input className="athlos-input" type="email" placeholder="usuario@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>
                  Contraseña {editUser && <span style={{ color: "var(--athlos-muted)", fontWeight: 400 }}>(dejar vacío para no cambiar)</span>}
                </label>
                <div style={{ position: "relative" }}>
                  <input className="athlos-input" type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ paddingRight: "44px" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>Rol</label>
                <select className="athlos-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-coral)" }}>{error}</p>
              )}

              <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2 mt-2" disabled={saving}>
                {saving ? <div className="athlos-spinner" /> : <Check size={16} />}
                {saving ? "GUARDANDO..." : editUser ? "GUARDAR CAMBIOS" : "CREAR USUARIO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm" style={{ background: "var(--athlos-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--athlos-white)", marginBottom: "12px" }}>¿ELIMINAR USUARIO?</h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--athlos-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1" disabled={deleting}>Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting} style={{ flex: 1, background: "var(--athlos-coral)", color: "white", border: "none", borderRadius: "8px", cursor: deleting ? "not-allowed" : "pointer", fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.95rem", opacity: deleting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {deleting && <div className="athlos-spinner" />}
                {deleting ? "ELIMINANDO..." : "ELIMINAR"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
