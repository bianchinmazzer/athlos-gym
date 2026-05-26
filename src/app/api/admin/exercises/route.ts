import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? supabase : null;
}

export async function GET() {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { data: exercises } = await supabase.from("exercises").select("*").order("name");
  return NextResponse.json({ exercises });
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { name, description, youtube_url } = await req.json();
  const { data, error } = await supabase.from("exercises").insert({ name, description: description || null, youtube_url: youtube_url || null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ exercise: data });
}

export async function PUT(req: NextRequest) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, name, description, youtube_url } = await req.json();
  const { error } = await supabase.from("exercises").update({ name, description: description || null, youtube_url: youtube_url || null }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await req.json();
  await supabase.from("exercises").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
