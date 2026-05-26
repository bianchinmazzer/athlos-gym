"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import type { Exercise } from "@/types";

export interface BuilderSection {
  name: string;
  exercises: { exercise_id: string; sets: number; reps: string }[];
}

interface RoutineBuilderProps {
  exercises: Exercise[];
  onSave: (data: { name: string; sections: BuilderSection[] }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
  title?: string;
  initialName?: string;
  initialSections?: BuilderSection[];
}

const defaultSections: BuilderSection[] = [
  { name: "Entrada en calor", exercises: [] },
  { name: "Trabajo principal", exercises: [] },
];

export default function RoutineBuilder({
  exercises,
  onSave,
  onClose,
  saving,
  title,
  initialName,
  initialSections,
}: RoutineBuilderProps) {
  const isEdit = !!initialName;
  const [routineName, setRoutineName] = useState(initialName || "");
  const [sections, setSections] = useState<BuilderSection[]>(
    initialSections || defaultSections.map((s) => ({ ...s, exercises: [...s.exercises] }))
  );

  const addSection = () => setSections([...sections, { name: "", exercises: [] }]);

  const addExercise = (sIdx: number) => {
    const updated = [...sections];
    updated[sIdx].exercises.push({ exercise_id: exercises[0]?.id || "", sets: 3, reps: "12-10-8" });
    setSections(updated);
  };

  const handleSubmit = async () => {
    if (!routineName.trim()) return;
    await onSave({ name: routineName, sections });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto my-8" style={{ background: "var(--athlos-navy)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--athlos-white)" }}>
            {title || (isEdit ? "EDITAR RUTINA" : "NUEVA RUTINA")}
          </h2>
          <button onClick={onClose} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)" }}>
              Nombre de la rutina *
            </label>
            <input className="athlos-input" placeholder="Ej: Rutina Día 1 — Piernas" value={routineName} onChange={(e) => setRoutineName(e.target.value)} />
          </div>

          {sections.map((section, sIdx) => (
            <div key={sIdx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px" }}>
              <div className="flex items-center gap-3 mb-4">
                <input
                  className="athlos-input"
                  placeholder="Nombre de la sección"
                  value={section.name}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[sIdx].name = e.target.value;
                    setSections(updated);
                  }}
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                />
                <button onClick={() => setSections(sections.filter((_, i) => i !== sIdx))}
                  style={{ color: "var(--athlos-coral)", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {section.exercises.map((ex, eIdx) => (
                  <div key={eIdx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6 relative">
                      <select
                        className="athlos-input"
                        value={ex.exercise_id}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].exercises[eIdx].exercise_id = e.target.value;
                          setSections(updated);
                        }}
                      >
                        {exercises.map((e) => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="athlos-input text-center"
                        type="number"
                        min={1}
                        max={20}
                        value={ex.sets}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].exercises[eIdx].sets = parseInt(e.target.value) || 1;
                          setSections(updated);
                        }}
                        title="Series"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        className="athlos-input"
                        placeholder="15-12-8"
                        value={ex.reps}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].exercises[eIdx].reps = e.target.value;
                          setSections(updated);
                        }}
                        title="Repeticiones"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button onClick={() => {
                        const updated = [...sections];
                        updated[sIdx].exercises = updated[sIdx].exercises.filter((_, i) => i !== eIdx);
                        setSections(updated);
                      }} style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {section.exercises.length > 0 && (
                  <div className="grid grid-cols-12 gap-2">
                    <p className="col-span-6" style={{ fontSize: "0.65rem", color: "var(--athlos-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Ejercicio</p>
                    <p className="col-span-2 text-center" style={{ fontSize: "0.65rem", color: "var(--athlos-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Series</p>
                    <p className="col-span-3" style={{ fontSize: "0.65rem", color: "var(--athlos-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Reps</p>
                  </div>
                )}

                <button
                  onClick={() => addExercise(sIdx)}
                  disabled={exercises.length === 0}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px",
                    border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "8px", background: "transparent",
                    color: "var(--athlos-muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.8rem",
                    width: "fit-content",
                  }}>
                  <Plus size={14} /> Agregar ejercicio
                </button>
              </div>
            </div>
          ))}

          <button onClick={addSection} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px",
            border: "1px dashed rgba(78,205,196,0.3)", borderRadius: "10px", background: "transparent",
            color: "var(--athlos-teal)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.85rem",
          }}>
            <Plus size={14} /> Agregar sección
          </button>

          <button onClick={handleSubmit} className="btn-primary flex items-center justify-center gap-2" disabled={saving || !routineName.trim()}>
            {saving ? <div className="athlos-spinner" /> : <Check size={16} />}
            {saving ? "GUARDANDO..." : isEdit ? "GUARDAR CAMBIOS" : "CREAR RUTINA"}
          </button>
        </div>
      </div>
    </div>
  );
}
