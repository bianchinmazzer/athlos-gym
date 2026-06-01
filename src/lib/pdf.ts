import type { RoutineWithSections, RoutineSectionWithExercises, RoutineExercise } from "@/types";

async function loadLogoDataURL(): Promise<string | null> {
  try {
    const res = await fetch("/images/athlos-logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function getSectionItems(section: RoutineSectionWithExercises) {
  const blocks = section.section_blocks || [];
  const allExercises = section.routine_exercises || [];

  const items: (
    | { type: "exercise"; order: number; exercise: RoutineExercise }
    | { type: "block"; order: number; name: string; exercises: RoutineExercise[] }
  )[] = [];

  for (const ex of allExercises.filter((e) => !e.block_id)) {
    items.push({ type: "exercise", order: ex.order_index, exercise: ex });
  }

  for (const block of blocks) {
    items.push({
      type: "block",
      order: block.order_index,
      name: block.name,
      exercises: allExercises
        .filter((e) => e.block_id === block.id)
        .sort((a, b) => a.order_index - b.order_index),
    });
  }

  items.sort((a, b) => a.order - b.order);
  return items;
}

export async function generateRoutinePDF(routine: RoutineWithSections) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const logoDataURL = await loadLogoDataURL();

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

  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 22, "F");

  let titleX = 14;
  if (logoDataURL) {
    // Logo is 400x600 (ratio 0.667). Fit by height within the 22mm header band.
    const logoH = 18;
    const logoW = logoH * (400 / 600);
    doc.addImage(logoDataURL, "PNG", 14, (22 - logoH) / 2, logoW, logoH);
    titleX = 14 + logoW + 5;
  }

  // "ATHLOS" en blanco, "GYM" en naranja (replica el header logueado)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("ATHLOS", titleX, 13);
  const athlosW = doc.getTextWidth("ATHLOS ");
  doc.setTextColor(...ORANGE);
  doc.text("GYM", titleX + athlosW, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("MONTE HERMOSO", pageW - 14, 13, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text(routine.name.toUpperCase(), 14, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Generado el ${new Date().toLocaleDateString("es-AR")}`, 14, 43);

  doc.setDrawColor(...CORAL);
  doc.setLineWidth(0.5);
  doc.line(14, 47, pageW - 14, 47);

  let y = 55;

  const sections = (routine.routine_sections || []).sort((a, b) => a.order_index - b.order_index);

  for (const section of sections) {
    if (y > pageH - 40) {
      doc.addPage();
      doc.setFillColor(...DARK);
      doc.rect(0, 0, pageW, pageH, "F");
      y = 20;
    }

    doc.setFillColor(...NAVY);
    doc.roundedRect(14, y - 5, pageW - 28, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...CORAL);
    doc.text(section.name.toUpperCase(), 18, y + 1);
    y += 12;

    const items = getSectionItems(section);

    if (items.length === 0) {
      y += 4;
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableData: any[][] = [];
    // Mark which body row indices belong to a block (header + its exercises)
    // so we can draw a teal "container" around them, like the web view.
    const blockRowFlags: { header: boolean; member: boolean; last: boolean }[] = [];

    for (const item of items) {
      if (item.type === "exercise") {
        const re = item.exercise;
        tableData.push([
          re.exercise?.name || "—",
          String(re.sets),
          re.reps,
          re.exercise?.youtube_url ? "Ver en web" : "—",
        ]);
        blockRowFlags.push({ header: false, member: false, last: false });
      } else {
        tableData.push([
          {
            content: `▸ ${item.name.toUpperCase()}`,
            colSpan: 4,
            styles: {
              fillColor: [12, 30, 36] as [number, number, number],
              textColor: TEAL,
              fontStyle: "bold",
              fontSize: 8,
            },
          },
        ]);
        blockRowFlags.push({ header: true, member: true, last: item.exercises.length === 0 });
        item.exercises.forEach((re, i) => {
          tableData.push([
            `   ${re.exercise?.name || "—"}`,
            String(re.sets),
            re.reps,
            re.exercise?.youtube_url ? "Ver en web" : "—",
          ]);
          blockRowFlags.push({
            header: false,
            member: true,
            last: i === item.exercises.length - 1,
          });
        });
      }
    }

    const BLOCK_BG = [9, 22, 27] as [number, number, number];

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
      // Tint the background of block-member rows so the group reads as one unit.
      didParseCell: (data) => {
        if (data.section !== "body") return;
        const flag = blockRowFlags[data.row.index];
        if (flag?.member && !flag.header) {
          data.cell.styles.fillColor = BLOCK_BG;
        }
      },
      // Draw a teal border around the whole block (header + exercises).
      didDrawCell: (data) => {
        if (data.section !== "body" || data.column.index !== 0) return;
        const flag = blockRowFlags[data.row.index];
        if (!flag?.member) return;

        const left = 14;
        const right = pageW - 14;
        const cellY = data.cell.y;
        const cellH = data.cell.height;

        doc.setDrawColor(...TEAL);
        doc.setLineWidth(0.4);
        // Left & right walls on every member row
        doc.line(left, cellY, left, cellY + cellH);
        doc.line(right, cellY, right, cellY + cellH);
        // Top wall on the header row
        if (flag.header) doc.line(left, cellY, right, cellY);
        // Bottom wall on the last member row
        if (flag.last) doc.line(left, cellY + cellH, right, cellY + cellH);
      },
      didDrawPage: () => {
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
