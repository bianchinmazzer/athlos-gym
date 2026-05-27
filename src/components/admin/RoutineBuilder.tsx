"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, X, Check, Layers } from "lucide-react";
import type { Exercise } from "@/types";

export interface BuilderExercise {
  exercise_id: string;
  sets: number;
  reps: string;
}

export type BuilderSectionItem =
  | { type: "exercise"; exercise_id: string; sets: number; reps: string }
  | { type: "block"; name: string; exercises: BuilderExercise[] };

export interface BuilderSection {
  name: string;
  items: BuilderSectionItem[];
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

function SearchableSelect({ exercises, value, onChange }: {
  exercises: Exercise[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = exercises.find((e) => e.id === value);
  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        className="athlos-input"
        value={open ? search : selected?.name || ""}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => { setOpen(true); setSearch(""); }}
        placeholder="Buscar ejercicio..."
        style={{ cursor: "pointer" }}
      />
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          maxHeight: "200px", overflowY: "auto", zIndex: 60,
          background: "var(--athlos-dark)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px", marginTop: "4px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => { onChange(ex.id); setOpen(false); setSearch(""); }}
              style={{
                width: "100%", padding: "8px 12px", border: "none", cursor: "pointer",
                background: ex.id === value ? "rgba(78,205,196,0.12)" : "transparent",
                color: ex.id === value ? "var(--athlos-teal)" : "var(--athlos-white)",
                textAlign: "left", fontFamily: "var(--font-body)", fontSize: "0.85rem",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ex.id === value ? "rgba(78,205,196,0.12)" : "transparent"; }}
            >
              {ex.name}
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: "10px 12px", color: "var(--athlos-muted)", fontSize: "0.8rem", fontFamily: "var(--font-body)", margin: 0 }}>
              Sin resultados
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const defaultSections: BuilderSection[] = [
  { name: "Entrada en calor", items: [] },
  { name: "Trabajo principal", items: [] },
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
    initialSections || defaultSections.map((s) => ({ ...s, items: [...s.items] }))
  );

  const update = (fn: (draft: BuilderSection[]) => void) => {
    const copy = JSON.parse(JSON.stringify(sections)) as BuilderSection[];
    fn(copy);
    setSections(copy);
  };

  const handleSubmit = async () => {
    if (!routineName.trim()) return;
    await onSave({ name: routineName, sections });
  };

  const labelStyle = {
    fontSize: "0.65rem",
    color: "var(--athlos-muted)",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
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
                  onChange={(e) => update((d) => { d[sIdx].name = e.target.value; })}
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                />
                <button onClick={() => update((d) => d.splice(sIdx, 1))}
                  style={{ color: "var(--athlos-coral)", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {section.items.map((item, itemIdx) => {
                  if (item.type === "exercise") {
                    return (
                      <div key={itemIdx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <SearchableSelect
                            exercises={exercises}
                            value={item.exercise_id}
                            onChange={(id) => update((d) => { (d[sIdx].items[itemIdx] as any).exercise_id = id; })}
                          />
                        </div>
                        <div className="col-span-2">
                          <input className="athlos-input text-center" type="number" min={0} max={20}
                            value={item.sets}
                            onChange={(e) => update((d) => { (d[sIdx].items[itemIdx] as any).sets = parseInt(e.target.value) || 0; })}
                            title="Series" />
                        </div>
                        <div className="col-span-3">
                          <input className="athlos-input" placeholder="15-12-8" value={item.reps}
                            onChange={(e) => update((d) => { (d[sIdx].items[itemIdx] as any).reps = e.target.value; })}
                            title="Repeticiones" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button onClick={() => update((d) => d[sIdx].items.splice(itemIdx, 1))}
                            style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={itemIdx} style={{
                      border: "1px solid rgba(78,205,196,0.25)",
                      borderRadius: "10px",
                      padding: "12px",
                      background: "rgba(78,205,196,0.03)",
                    }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Layers size={14} style={{ color: "var(--athlos-teal)", flexShrink: 0 }} />
                        <input className="athlos-input" placeholder="Nombre del bloque (ej: AMRAP 7')"
                          value={item.name}
                          onChange={(e) => update((d) => { (d[sIdx].items[itemIdx] as any).name = e.target.value; })}
                          style={{ fontSize: "0.9rem" }} />
                        <button onClick={() => update((d) => d[sIdx].items.splice(itemIdx, 1))}
                          style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2" style={{ marginLeft: "6px" }}>
                        {item.exercises.map((bEx, bExIdx) => (
                          <div key={bExIdx} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-6">
                              <SearchableSelect
                                exercises={exercises}
                                value={bEx.exercise_id}
                                onChange={(id) => update((d) => {
                                  const block = d[sIdx].items[itemIdx] as Extract<BuilderSectionItem, { type: "block" }>;
                                  block.exercises[bExIdx].exercise_id = id;
                                })}
                              />
                            </div>
                            <div className="col-span-2">
                              <input className="athlos-input text-center" type="number" min={0} max={20}
                                value={bEx.sets}
                                onChange={(e) => update((d) => {
                                  const block = d[sIdx].items[itemIdx] as Extract<BuilderSectionItem, { type: "block" }>;
                                  block.exercises[bExIdx].sets = parseInt(e.target.value) || 0;
                                })}
                                title="Series" />
                            </div>
                            <div className="col-span-3">
                              <input className="athlos-input" placeholder="15-12-8" value={bEx.reps}
                                onChange={(e) => update((d) => {
                                  const block = d[sIdx].items[itemIdx] as Extract<BuilderSectionItem, { type: "block" }>;
                                  block.exercises[bExIdx].reps = e.target.value;
                                })}
                                title="Repeticiones" />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <button onClick={() => update((d) => {
                                const block = d[sIdx].items[itemIdx] as Extract<BuilderSectionItem, { type: "block" }>;
                                block.exercises.splice(bExIdx, 1);
                              })}
                                style={{ color: "var(--athlos-muted)", background: "none", border: "none", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}>
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {item.exercises.length > 0 && (
                          <div className="grid grid-cols-12 gap-2">
                            <p className="col-span-6" style={labelStyle}>Ejercicio</p>
                            <p className="col-span-2 text-center" style={labelStyle}>Series</p>
                            <p className="col-span-3" style={labelStyle}>Reps</p>
                          </div>
                        )}

                        <button
                          onClick={() => update((d) => {
                            const block = d[sIdx].items[itemIdx] as Extract<BuilderSectionItem, { type: "block" }>;
                            block.exercises.push({ exercise_id: exercises[0]?.id || "", sets: 3, reps: "12-10-8" });
                          })}
                          disabled={exercises.length === 0}
                          style={{
                            display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px",
                            border: "1px dashed rgba(78,205,196,0.25)", borderRadius: "6px",
                            background: "transparent", color: "var(--athlos-teal)",
                            cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.75rem",
                            width: "fit-content", opacity: 0.7,
                          }}>
                          <Plus size={12} /> Agregar ejercicio al bloque
                        </button>
                      </div>
                    </div>
                  );
                })}

                {section.items.some((i) => i.type === "exercise") && (
                  <div className="grid grid-cols-12 gap-2">
                    <p className="col-span-6" style={labelStyle}>Ejercicio</p>
                    <p className="col-span-2 text-center" style={labelStyle}>Series</p>
                    <p className="col-span-3" style={labelStyle}>Reps</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => update((d) => d[sIdx].items.push({ type: "exercise", exercise_id: exercises[0]?.id || "", sets: 3, reps: "12-10-8" }))}
                    disabled={exercises.length === 0}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px",
                      border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "8px", background: "transparent",
                      color: "var(--athlos-muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.8rem",
                    }}>
                    <Plus size={14} /> Agregar ejercicio
                  </button>
                  <button
                    onClick={() => update((d) => d[sIdx].items.push({ type: "block", name: "", exercises: [] }))}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px",
                      border: "1px dashed rgba(78,205,196,0.25)", borderRadius: "8px", background: "transparent",
                      color: "var(--athlos-teal)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.8rem",
                    }}>
                    <Layers size={14} /> Agregar bloque
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => update((d) => d.push({ name: "", items: [] }))} style={{
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
