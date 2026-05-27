-- ============================================================
-- MIGRATION: Add section_blocks support
-- Run this in the Supabase SQL Editor on an existing database
-- ============================================================

-- Blocks within each section (e.g. "AMRAP 7'", "Bloque 1")
CREATE TABLE IF NOT EXISTS public.section_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.routine_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Add block_id to routine_exercises (nullable — null means loose exercise)
ALTER TABLE public.routine_exercises
  ADD COLUMN IF NOT EXISTS block_id UUID REFERENCES public.section_blocks(id) ON DELETE CASCADE;

-- RLS for section_blocks
ALTER TABLE public.section_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logged in users can view blocks" ON public.section_blocks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage blocks" ON public.section_blocks
  FOR ALL USING (public.is_admin());
