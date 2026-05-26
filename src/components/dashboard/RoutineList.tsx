"use client";
import { useState } from "react";
import { Download, Youtube, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import type { RoutineWithSections } from "@/types";
import { generateRoutinePDF } from "@/lib/pdf";

interface RoutineListProps {
  routines: RoutineWithSections[];
  emptyMessage: string;
  emptySubMessage?: string;
}

export default function RoutineList({ routines, emptyMessage, emptySubMessage }: RoutineListProps) {
  const [expanded, setExpanded] = useState<string | null>(routines.length > 0 ? routines[0].id : null);

  if (routines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Dumbbell size={48} style={{ color: "rgba(255,255,255,0.1)" }} />
        <p style={{ fontFamily: "var(--font-body)", color: "var(--athlos-muted)", textAlign: "center" }}>
          {emptyMessage}
          {emptySubMessage && <><br />{emptySubMessage}</>}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {routines.map((routine) => (
        <div key={routine.id} className="glass-card rounded-2xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === routine.id ? null : routine.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", background: "none", border: "none", cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--athlos-white)", letterSpacing: "0.04em" }}>
                {routine.name.toUpperCase()}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--athlos-muted)" }}>
                {routine.routine_sections?.length || 0} secciones
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); generateRoutinePDF(routine); }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px",
                  border: "1px solid rgba(78,205,196,0.3)", borderRadius: "8px",
                  background: "transparent", color: "var(--athlos-teal)", cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "0.8rem", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(78,205,196,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Download size={14} />
                PDF
              </button>
              {expanded === routine.id ? (
                <ChevronUp size={18} style={{ color: "var(--athlos-muted)" }} />
              ) : (
                <ChevronDown size={18} style={{ color: "var(--athlos-muted)" }} />
              )}
            </div>
          </button>

          {expanded === routine.id && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {(routine.routine_sections || [])
                .sort((a, b) => a.order_index - b.order_index)
                .map((section) => (
                  <div key={section.id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: "rgba(232,83,58,0.1)", border: "1px solid rgba(232,83,58,0.2)",
                        borderRadius: "6px", padding: "4px 12px", marginBottom: "12px",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.06em", color: "var(--athlos-coral)" }}>
                        {section.name.toUpperCase()}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)", fontWeight: 400 }}>Ejercicio</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)", fontWeight: 400 }}>Series</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)", fontWeight: 400 }}>Reps</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--athlos-muted)", fontWeight: 400 }}>Video</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(section.routine_exercises || [])
                            .sort((a, b) => a.order_index - b.order_index)
                            .map((re) => (
                              <tr key={re.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                                <td style={{ padding: "10px 12px", fontFamily: "var(--font-body)", color: "var(--athlos-white)", fontSize: "0.9rem" }}>
                                  {re.exercise?.name || "—"}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                  <span style={{
                                    display: "inline-block", minWidth: "28px", padding: "2px 8px",
                                    background: "rgba(244,163,64,0.12)", border: "1px solid rgba(244,163,64,0.2)",
                                    borderRadius: "100px", fontFamily: "var(--font-body)", fontSize: "0.85rem",
                                    color: "var(--athlos-orange)",
                                  }}>
                                    {re.sets}
                                  </span>
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--athlos-white)" }}>
                                  {re.reps}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                  {re.exercise?.youtube_url ? (
                                    <a
                                      href={re.exercise.youtube_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "inline-flex", alignItems: "center", gap: "4px",
                                        color: "var(--athlos-coral)", textDecoration: "none",
                                        fontFamily: "var(--font-body)", fontSize: "0.8rem",
                                        padding: "4px 10px", borderRadius: "6px",
                                        border: "1px solid rgba(232,83,58,0.25)",
                                        transition: "background 0.15s",
                                      }}
                                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,83,58,0.08)")}
                                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                      <Youtube size={12} />
                                      Ver
                                    </a>
                                  ) : (
                                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.8rem" }}>—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
