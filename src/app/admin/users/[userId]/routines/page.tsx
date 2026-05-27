"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import type { Exercise, RoutineWithSections, Profile } from "@/types";
import RoutineBuilder, { type BuilderSection, type BuilderSectionItem } from "@/components/admin/RoutineBuilder";

export default function UserRoutinesPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<Profile | null>(null);
  const [routines, setRoutines] = useState<RoutineWithSections[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineWithSections | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    const [rRes, eRes, uRes] = await Promise.all([
      fetch(`/api/admin/users/${userId}/routines`),
      fetch("/api/admin/exercises"),
      fetch("/api/admin/users"),
    ]);
    const [rData, eData, uData] = await Promise.all([rRes.json(), eRes.json(), uRes.json()]);
    setRoutines(rData.routines || []);
    setExercises(eData.exercises || []);
    const foundUser = (uData.users || []).find((u: Profile) => u.id === userId);
    setUser(foundUser || null);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [userId]);

  const handleSave = async (data: { name: string; sections: BuilderSection[] }) => {
    setSaving(true);
    const method = editingRoutine ? "PUT" : "POST";
    const body = editingRoutine
      ? { id: editingRoutine.id, name: data.name, sections: data.sections }
      : { name: data.name, sections: data.sections };

    await fetch(`/api/admin/users/${userId}/routines`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowBuilder(false);
    setEditingRoutine(null);
    setSaving(false);
    fetchAll();
  };

  const openEdit = (routine: RoutineWithSections) => {
    setEditingRoutine(routine);
    setShowBuilder(true);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await fetch(`/api/admin/users/${userId}/routines`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(false);
    setDeleteId(null);
    fetchAll();
  };

  const routineToBuilderSections = (routine: RoutineWithSections): BuilderSection[] => {
    return (routine.routine_sections || [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((s) => {
        const blocks = s.section_blocks || [];
        const allExercises = s.routine_exercises || [];

        const ordered: { order: number; item: BuilderSectionItem }[] = [];

        for (const ex of allExercises.filter((e) => !e.block_id)) {
          ordered.push({
            order: ex.order_index,
            item: { type: "exercise", exercise_id: ex.exercise_id, sets: ex.sets, reps: ex.reps },
          });
        }

        for (const block of blocks) {
          const blockExes = allExercises
            .filter((e) => e.block_id === block.id)
            .sort((a, b) => a.order_index - b.order_index);
          ordered.push({
            order: block.order_index,
            item: {
              type: "block",
              name: block.name,
              exercises: blockExes.map((e) => ({ exercise_id: e.exercise_id, sets: e.sets, reps: e.reps })),
            },
          });
        }

        ordered.sort((a, b) => a.order - b.order);
        return { name: s.name, items: ordered.map((o) => o.item) };
      });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/users")}
          style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-white)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--athlos-white)", letterSpacing: "0.04em" }}>
            {loading ? "RUTINAS" : `RUTINAS DE ${user?.name?.toUpperCase() || "USUARIO"}`}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-muted)" }}>
            Rutinas personalizadas para este usuario
          </p>
        </div>
        <button onClick={() => { setEditingRoutine(null); setShowBuilder(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nueva rutina
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="athlos-spinner-lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {routines.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--athlos-white)", letterSpacing: "0.04em" }}>{r.name.toUpperCase()}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--athlos-muted)" }}>
                  {r.routine_sections?.length || 0} secciones · Creada el {new Date(r.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(r)}
                  style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-teal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteId(r.id)} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", padding: "6px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {routines.length === 0 && (
            <div className="text-center py-16" style={{ color: "var(--athlos-muted)", fontFamily: "var(--font-body)" }}>
              Este usuario no tiene rutinas personalizadas todavía.
            </div>
          )}
        </div>
      )}

      {showBuilder && (
        <RoutineBuilder
          exercises={exercises}
          onSave={handleSave}
          onClose={() => { setShowBuilder(false); setEditingRoutine(null); }}
          saving={saving}
          initialName={editingRoutine?.name}
          initialSections={editingRoutine ? routineToBuilderSections(editingRoutine) : undefined}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm" style={{ background: "var(--athlos-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--athlos-white)", marginBottom: "12px" }}>¿ELIMINAR RUTINA?</h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--athlos-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1" disabled={deleting}>Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting} style={{ flex: 1, background: "var(--athlos-coral)", color: "white", border: "none", borderRadius: "8px", cursor: deleting ? "not-allowed" : "pointer", fontFamily: "var(--font-display)", letterSpacing: "0.06em", opacity: deleting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
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
