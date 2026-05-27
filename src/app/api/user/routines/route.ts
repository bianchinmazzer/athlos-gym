import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: userRoutines } = await supabase
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
    .eq("user_id", user.id)
    .eq("routine.type", "personal");

  const routines = userRoutines?.map((ur) => ur.routine).filter(Boolean) || [];
  return NextResponse.json({ routines });
}
