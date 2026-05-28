import { SupabaseClient } from "@supabase/supabase-js";

interface RoutineItem {
  type: "exercise" | "block";
  exercise_id?: string;
  sets?: number;
  reps?: string;
  name?: string;
  exercises?: { exercise_id: string; sets: number; reps: string }[];
}

export async function saveItems(supabase: SupabaseClient, sectionId: string, items: RoutineItem[]) {
  const exercisesToInsert: Record<string, unknown>[] = [];
  const blocksToCreate: { item: RoutineItem; orderIndex: number }[] = [];

  for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
    const item = items[itemIdx];
    if (item.type === "exercise") {
      exercisesToInsert.push({
        section_id: sectionId,
        exercise_id: item.exercise_id,
        sets: item.sets,
        reps: item.reps,
        block_id: null,
        order_index: itemIdx,
      });
    } else if (item.type === "block") {
      blocksToCreate.push({ item, orderIndex: itemIdx });
    }
  }

  if (exercisesToInsert.length > 0) {
    await supabase.from("routine_exercises").insert(exercisesToInsert);
  }

  for (const { item, orderIndex } of blocksToCreate) {
    const { data: block } = await supabase
      .from("section_blocks")
      .insert({ section_id: sectionId, name: item.name, order_index: orderIndex })
      .select()
      .single();

    if (!block) continue;

    const blockExercises = (item.exercises || []).map((ex, eIdx) => ({
      section_id: sectionId,
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      reps: ex.reps,
      block_id: block.id,
      order_index: eIdx,
    }));

    if (blockExercises.length > 0) {
      await supabase.from("routine_exercises").insert(blockExercises);
    }
  }
}
