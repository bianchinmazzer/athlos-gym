import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const ctx = await requireAdmin();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { data: exercises } = await ctx.supabase.from("exercises").select("*").order("name");
  return NextResponse.json({ exercises });
}

export async function POST(req: NextRequest) {
  const ctx = await requireAdmin();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { name, description, youtube_url } = await req.json();
  const { data, error } = await ctx.supabase.from("exercises").insert({ name, description: description || null, youtube_url: youtube_url || null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ exercise: data });
}

export async function PUT(req: NextRequest) {
  const ctx = await requireAdmin();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, name, description, youtube_url } = await req.json();
  const { error } = await ctx.supabase.from("exercises").update({ name, description: description || null, youtube_url: youtube_url || null }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const ctx = await requireAdmin();
  if (!ctx) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await req.json();
  await ctx.supabase.from("exercises").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
