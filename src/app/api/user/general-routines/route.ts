import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: routines } = await supabase
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

  return NextResponse.json({ routines: routines || [] });
}
