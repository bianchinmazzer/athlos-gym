"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Youtube } from "lucide-react";
import type { Exercise } from "@/types";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEx, setEditEx] = useState<Exercise | null>(null);
  const [form, setForm] = useState({ name: "", description: "", youtube_url: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch_ = async () => {
    const res = await fetch("/api/admin/exercises");
    const data = await res.json();
    setExercises(data.exercises || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const openCreate = () => {
    setEditEx(null);
    setForm({ name: "", description: "", youtube_url: "" });
    setShowModal(true);
  };

  const openEdit = (ex: Exercise) => {
    setEditEx(ex);
    setForm({ name: ex.name, description: ex.description || "", youtube_url: ex.youtube_url || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = editEx ? "PUT" : "POST";
    const body = editEx ? { id: editEx.id, ...form } : form;
    await fetch("/api/admin/exercises", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowModal(false);
    setSaving(false);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await fetch("/api/admin/exercises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(false);
    setDeleteId(null);
    fetch_();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--athlos-white)", letterSpacing: "0.04em" }}>EJERCICIOS</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-muted)" }}>Biblioteca de ejercicios para armar rutinas</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo ejercicio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="athlos-spinner-lg" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="glass-card rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--athlos-white)", letterSpacing: "0.03em", lineHeight: "1.2" }}>
                  {ex.name.toUpperCase()}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(ex)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-teal)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(ex.id)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {ex.description && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-muted)", lineHeight: "1.6" }}>{ex.description}</p>
              )}

              {ex.youtube_url && (
                <a href={ex.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-auto"
                  style={{ color: "var(--athlos-coral)", fontFamily: "var(--font-body)", fontSize: "0.8rem", textDecoration: "none" }}>
                  <Youtube size={14} />
                  Ver video
                </a>
              )}
            </div>
          ))}
          {exercises.length === 0 && (
            <div className="col-span-3 text-center py-16" style={{ color: "var(--athlos-muted)", fontFamily: "var(--font-body)" }}>
              No hay ejercicios todavía. ¡Agregá el primero!
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md" style={{ background: "var(--athlos-navy)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--athlos-white)" }}>
                {editEx ? "EDITAR EJERCICIO" : "NUEVO EJERCICIO"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>Nombre *</label>
                <input className="athlos-input" placeholder="Ej: Sentadilla con barra" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>Descripción (opcional)</label>
                <textarea className="athlos-input" rows={3} placeholder="Descripción o instrucciones..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "none" }} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>Video YouTube (opcional)</label>
                <input className="athlos-input" placeholder="https://youtube.com/watch?v=..." value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} />
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2 mt-2" disabled={saving || !form.name}>
                {saving ? <div className="athlos-spinner" /> : <Check size={16} />}
                {saving ? "GUARDANDO..." : editEx ? "GUARDAR CAMBIOS" : "CREAR EJERCICIO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm" style={{ background: "var(--athlos-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--athlos-white)", marginBottom: "12px" }}>¿ELIMINAR EJERCICIO?</h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--athlos-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>Si está usado en rutinas, se eliminará de ellas también.</p>
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
