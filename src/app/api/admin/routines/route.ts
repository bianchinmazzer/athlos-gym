import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getAdminSupabase() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? { supabase, user } : null;
}

export async function GET() {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: routines } = await ctx.supabase
    .from("routines")
    .select(`
      *,
      routine_sections(
        *,
        routine_exercises(
          *,
          exercise:exercises(*)
        )
      )
    `)
    .eq("type", "general")
    .order("created_at", { ascending: false });

  return NextResponse.json({ routines });
}

export async function POST(req: NextRequest) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, description, sections } = await req.json();

  const { data: routine, error } = await ctx.supabase
    .from("routines")
    .insert({ name, description: description || null, type: "general", created_by: ctx.user.id })
    .select()
    .single();

  if (error || !routine) return NextResponse.json({ error: error?.message }, { status: 400 });

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const sec = sections[sIdx];
    const { data: section } = await ctx.supabase
      .from("routine_sections")
      .insert({ routine_id: routine.id, name: sec.name, order_index: sIdx })
      .select()
      .single();

    if (!section) continue;

    for (let eIdx = 0; eIdx < sec.exercises.length; eIdx++) {
      const ex = sec.exercises[eIdx];
      await ctx.supabase.from("routine_exercises").insert({
        section_id: section.id,
        exercise_id: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps,
        order_index: eIdx,
      });
    }
  }

  return NextResponse.json({ routine });
}

export async function PUT(req: NextRequest) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, name, sections } = await req.json();

  const { error: updateErr } = await ctx.supabase
    .from("routines")
    .update({ name })
    .eq("id", id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400 });

  await ctx.supabase.from("routine_sections").delete().eq("routine_id", id);

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const sec = sections[sIdx];
    const { data: section } = await ctx.supabase
      .from("routine_sections")
      .insert({ routine_id: id, name: sec.name, order_index: sIdx })
      .select()
      .single();

    if (!section) continue;

    for (let eIdx = 0; eIdx < sec.exercises.length; eIdx++) {
      const ex = sec.exercises[eIdx];
      await ctx.supabase.from("routine_exercises").insert({
        section_id: section.id,
        exercise_id: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps,
        order_index: eIdx,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  await ctx.supabase.from("routines").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
