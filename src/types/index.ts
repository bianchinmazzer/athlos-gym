export type Role = "admin" | "user";
export type RoutineType = "general" | "personal";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  youtube_url: string | null;
  created_at: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string | null;
  type: RoutineType;
  created_by: string;
  created_at: string;
}

export interface RoutineSection {
  id: string;
  routine_id: string;
  name: string;
  order_index: number;
}

export interface SectionBlock {
  id: string;
  section_id: string;
  name: string;
  order_index: number;
}

export interface RoutineExercise {
  id: string;
  section_id: string;
  exercise_id: string;
  block_id: string | null;
  sets: number;
  reps: string;
  notes: string | null;
  order_index: number;
  exercise?: Exercise;
}

export interface RoutineSectionWithExercises extends RoutineSection {
  routine_exercises: RoutineExercise[];
  section_blocks: SectionBlock[];
}

export interface RoutineWithSections extends Routine {
  routine_sections: RoutineSectionWithExercises[];
}

export interface UserRoutine {
  id: string;
  user_id: string;
  routine_id: string;
  assigned_at: string;
  routine?: Routine;
}
