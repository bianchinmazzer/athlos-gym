-- ============================================================
-- ATHLOS GYM - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises library
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routines
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'personal')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine sections (e.g. "Entrada en calor", "Trabajo principal")
CREATE TABLE IF NOT EXISTS public.routine_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Exercises within each section
CREATE TABLE IF NOT EXISTS public.routine_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.routine_sections(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '12-10-8',
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Which users have access to which routines
CREATE TABLE IF NOT EXISTS public.user_routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, routine_id)
);

-- ============================================================
-- HELPER: check admin without triggering RLS recursion
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_routines ENABLE ROW LEVEL SECURITY;

-- Profiles: users see their own, admin sees all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Exercises: all logged-in users can view, only admin can modify
CREATE POLICY "Logged in users can view exercises" ON public.exercises
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage exercises" ON public.exercises
  FOR ALL USING (public.is_admin());

-- Routines: same pattern
CREATE POLICY "Logged in users can view routines" ON public.routines
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage routines" ON public.routines
  FOR ALL USING (public.is_admin());

CREATE POLICY "Logged in users can view sections" ON public.routine_sections
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage sections" ON public.routine_sections
  FOR ALL USING (public.is_admin());

CREATE POLICY "Logged in users can view routine exercises" ON public.routine_exercises
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage routine exercises" ON public.routine_exercises
  FOR ALL USING (public.is_admin());

-- User routines: user sees their own assignments, admin sees all
CREATE POLICY "User can view own assignments" ON public.user_routines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage assignments" ON public.user_routines
  FOR ALL USING (public.is_admin());

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
