import type { RoutineWithSections } from "@/types";

export async function generateRoutinePDF(routine: RoutineWithSections) {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const DARK = [26, 26, 46] as [number, number, number];
  const CORAL = [232, 83, 58] as [number, number, number];
  const ORANGE = [244, 163, 64] as [number, number, number];
  const TEAL = [78, 205, 196] as [number, number, number];
  const WHITE = [240, 240, 240] as [number, number, number];
  const MUTED = [138, 138, 154] as [number, number, number];
  const NAVY = [22, 33, 62] as [number, number, number];

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, pageH, "F");

  // Header bar
  doc.setFillColor(...CORAL);
  doc.rect(0, 0, pageW, 22, "F");

  // Gym name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("ATHLOS GYM", 14, 13);

  // "Monte Hermoso" tag
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("MONTE HERMOSO", pageW - 14, 13, { align: "right" });

  // Routine name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text(routine.name.toUpperCase(), 14, 36);

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Generado el ${new Date().toLocaleDateString("es-AR")}`, 14, 43);

  // Divider line
  doc.setDrawColor(...CORAL);
  doc.setLineWidth(0.5);
  doc.line(14, 47, pageW - 14, 47);

  let y = 55;

  const sections = (routine.routine_sections || []).sort((a, b) => a.order_index - b.order_index);

  for (const section of sections) {
    // Check page overflow
    if (y > pageH - 40) {
      doc.addPage();
      doc.setFillColor(...DARK);
      doc.rect(0, 0, pageW, pageH, "F");
      y = 20;
    }

    // Section label
    doc.setFillColor(...NAVY);
    doc.roundedRect(14, y - 5, pageW - 28, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...CORAL);
    doc.text(section.name.toUpperCase(), 18, y + 1);
    y += 12;

    const exercises = (section.routine_exercises || []).sort((a, b) => a.order_index - b.order_index);

    if (exercises.length === 0) {
      y += 4;
      continue;
    }

    const tableData = exercises.map((re) => [
      re.exercise?.name || "—",
      String(re.sets),
      re.reps,
      re.exercise?.youtube_url ? "Ver en web" : "—",
    ]);

    autoTable(doc, {
      startY: y,
      head: [["EJERCICIO", "SERIES", "REPS", "VIDEO"]],
      body: tableData,
      margin: { left: 14, right: 14 },
      styles: {
        fillColor: DARK,
        textColor: WHITE,
        fontSize: 9,
        cellPadding: 4,
        lineColor: [40, 40, 60],
        lineWidth: 0.3,
        font: "helvetica",
      },
      headStyles: {
        fillColor: NAVY,
        textColor: MUTED,
        fontSize: 7,
        fontStyle: "bold",
        cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 28, halign: "center" },
        3: { cellWidth: 28, halign: "center", textColor: TEAL },
      },
      alternateRowStyles: { fillColor: [20, 20, 38] as [number, number, number] },
      didDrawPage: (data) => {
        // Footer on each page
        const pNum = (doc as any).internal.getNumberOfPages();
        doc.setFillColor(...DARK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...MUTED);
        doc.text(
          `Athlos Gym · Monte Hermoso · ${routine.name}`,
          pageW / 2,
          pageH - 6,
          { align: "center" }
        );
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  doc.save(`${routine.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
