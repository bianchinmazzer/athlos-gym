"use client";
import { useEffect, useState } from "react";
import type { RoutineWithSections } from "@/types";
import RoutineList from "@/components/dashboard/RoutineList";

export default function DashboardPage() {
  const [routines, setRoutines] = useState<RoutineWithSections[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/general-routines")
      .then((r) => r.json())
      .then((d) => {
        setRoutines(d.routines || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--athlos-white)", letterSpacing: "0.04em" }}>
          RUTINAS GENERALES
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-muted)" }}>
          Rutinas disponibles para todos
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="athlos-spinner-lg" />
        </div>
      ) : (
        <RoutineList
          routines={routines}
          emptyMessage="No hay rutinas generales disponibles."
        />
      )}
    </div>
  );
}
