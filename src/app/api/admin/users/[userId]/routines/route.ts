import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { saveItems } from "@/lib/routines";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const ctx = await requireAdmin();
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
  const ctx = await requireAdmin();
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
  const ctx = await requireAdmin();
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
  const ctx = await requireAdmin();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await params;
  const { id } = await req.json();
  await ctx.supabase.from("routines").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
