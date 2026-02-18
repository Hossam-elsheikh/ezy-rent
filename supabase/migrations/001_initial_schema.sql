-- ============================================================
-- EzyRent - Initial Schema Migration
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  nationality TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 120),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  profession TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  details TEXT,
  image_path TEXT,  -- stored in supabase bucket: units_images
  media_link TEXT,
  persons INTEGER NOT NULL DEFAULT 1 CHECK (persons >= 1),
  price NUMERIC(10, 2) NOT NULL,
  negotiable BOOLEAN DEFAULT FALSE,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  address TEXT,
  available BOOLEAN DEFAULT TRUE,
  available_at DATE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNIT REQUESTS TABLE (users requesting to list a unit)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.unit_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  details TEXT,
  image_path TEXT,
  media_link TEXT,
  persons INTEGER NOT NULL DEFAULT 1 CHECK (persons >= 1),
  price NUMERIC(10, 2) NOT NULL,
  negotiable BOOLEAN DEFAULT FALSE,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  address TEXT,
  available_at DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAVORITES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, unit_id)
);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unit_requests_updated_at
  BEFORE UPDATE ON public.unit_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- USERS POLICIES ----
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR public.get_user_role() = 'admin');

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins can do full CRUD on users"
  ON public.users FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Allow insert on signup"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

-- ---- UNITS POLICIES ----
CREATE POLICY "Anyone can view approved units"
  ON public.units FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can view all units"
  ON public.units FOR SELECT
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can insert units"
  ON public.units FOR INSERT
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "Admins can update units"
  ON public.units FOR UPDATE
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can delete units"
  ON public.units FOR DELETE
  USING (public.get_user_role() = 'admin');

-- ---- UNIT REQUESTS POLICIES ----
CREATE POLICY "Users can view their own requests"
  ON public.unit_requests FOR SELECT
  USING (requester_id = auth.uid() OR public.get_user_role() = 'admin');

CREATE POLICY "Authenticated users can create requests"
  ON public.unit_requests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND requester_id = auth.uid());

CREATE POLICY "Users can update their own pending requests"
  ON public.unit_requests FOR UPDATE
  USING (requester_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update any request"
  ON public.unit_requests FOR UPDATE
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Users can delete their own pending requests"
  ON public.unit_requests FOR DELETE
  USING (requester_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can delete any request"
  ON public.unit_requests FOR DELETE
  USING (public.get_user_role() = 'admin');

-- ---- FAVORITES POLICIES ----
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can remove their own favorites"
  ON public.favorites FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- STORAGE BUCKET (run this in Supabase dashboard or via API)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('units_images', 'units_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for units_images bucket
CREATE POLICY "Anyone can view unit images" ON storage.objects FOR SELECT USING (bucket_id = 'units_images');
CREATE POLICY "Authenticated users can upload unit images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'units_images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (bucket_id = 'units_images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (bucket_id = 'units_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_units_country ON public.units(country);
CREATE INDEX IF NOT EXISTS idx_units_city ON public.units(city);
CREATE INDEX IF NOT EXISTS idx_units_district ON public.units(district);
CREATE INDEX IF NOT EXISTS idx_units_status ON public.units(status);
CREATE INDEX IF NOT EXISTS idx_units_available ON public.units(available);
CREATE INDEX IF NOT EXISTS idx_unit_requests_status ON public.unit_requests(status);
CREATE INDEX IF NOT EXISTS idx_unit_requests_requester ON public.unit_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_unit ON public.favorites(unit_id);
