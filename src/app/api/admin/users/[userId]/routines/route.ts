import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getAdminSupabase() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? { supabase, user } : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveItems(supabase: any, sectionId: string, items: any[]) {
  for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
    const item = items[itemIdx];
    if (item.type === "exercise") {
      await supabase.from("routine_exercises").insert({
        section_id: sectionId,
        exercise_id: item.exercise_id,
        sets: item.sets,
        reps: item.reps,
        block_id: null,
        order_index: itemIdx,
      });
    } else if (item.type === "block") {
      const { data: block } = await supabase
        .from("section_blocks")
        .insert({ section_id: sectionId, name: item.name, order_index: itemIdx })
        .select()
        .single();

      if (!block) continue;

      for (let eIdx = 0; eIdx < item.exercises.length; eIdx++) {
        const ex = item.exercises[eIdx];
        await supabase.from("routine_exercises").insert({
          section_id: sectionId,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          block_id: block.id,
          order_index: eIdx,
        });
      }
    }
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await params;

  const { data: userRoutines } = await ctx.supabase
    .from("user_routines")
    .select(`
      routine:routines!inner(
        *,
        routine_sections(
          *,
          routine_exercises(
            *,
            exercise:exercises(*)
          ),
          section_blocks(*)
        )
      )
    `)
    .eq("user_id", userId)
    .eq("routine.type", "personal");

  const routines = userRoutines?.map((ur) => ur.routine).filter(Boolean) || [];
  return NextResponse.json({ routines });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await params;
  const { name, description, sections } = await req.json();

  const { data: routine, error } = await ctx.supabase
    .from("routines")
    .insert({ name, description: description || null, type: "personal", created_by: ctx.user.id })
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

    await saveItems(ctx.supabase, section.id, sec.items);
  }

  await ctx.supabase.from("user_routines").insert({ user_id: userId, routine_id: routine.id });

  return NextResponse.json({ routine });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await params;
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

    await saveItems(ctx.supabase, section.id, sec.items);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const ctx = await getAdminSupabase();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await params;
  const { id } = await req.json();
  await ctx.supabase.from("routines").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
