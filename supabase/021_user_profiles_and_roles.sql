-- =============================================================
-- 021: Officer Profiles & Role-Based Access Control (RBAC) Setup
-- =============================================================
-- Replaces the single global admin password with Supabase Auth
-- and maps auth.users to specific Society roles and Houses.
-- =============================================================

-- 1. Create the officers table
CREATE TABLE IF NOT EXISTS public.officers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    house_affiliation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add Constraints for Valid Roles and Houses
-- Based on the Constitution (High Council, House Councils) and Rules & Procedures
ALTER TABLE public.officers
ADD CONSTRAINT valid_role CHECK (role IN (
    'president', 'vice_president', 'executive_secretary',
    'sia', 'oia_director', 'ofra', 'external_affairs', 'business_affairs', 'public_affairs',
    'chief_adviser',
    'chancellor_bathala', 'chancellor_kabunian', 'chancellor_laon', 'chancellor_manama',
    'pending' -- Default state for new users before an admin assigns their role
));

ALTER TABLE public.officers
ADD CONSTRAINT valid_house CHECK (house_affiliation IN (
    'Bathala', 'Kabunian', 'Laon', 'Manama', 'Society-wide'
));

-- 3. Enable Row Level Security
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view all profiles 
-- (Needed for UI dropdowns, assigning tasks, viewing who is the Chancellor, etc.)
CREATE POLICY "Authenticated users can view all officer profiles"
ON public.officers FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can update their own profile (e.g., updating their full_name)
-- Note: Role and House changes should be done via Supabase Dashboard or secure Edge Functions.
CREATE POLICY "Users can update their own profile"
ON public.officers FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Helper Functions for RBAC (Used in subsequent RLS policies)
-- These functions run with SECURITY DEFINER to safely check permissions.

-- Check if the current user has a specific role
CREATE OR REPLACE FUNCTION public.is_role(target_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.officers
        WHERE id = auth.uid() AND role = target_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the current user is any House Chancellor
CREATE OR REPLACE FUNCTION public.is_chancellor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.officers
        WHERE id = auth.uid() AND role LIKE 'chancellor_%'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get the current user's house affiliation
CREATE OR REPLACE FUNCTION public.get_user_house()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT house_affiliation FROM public.officers
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Auto-create Profile Trigger
-- Automatically creates an officer profile when a new user signs up via Supabase Auth.
-- It reads 'role' and 'house' from the user's metadata (raw_user_meta_data).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.officers (id, email, full_name, role, house_affiliation)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'pending'),
        COALESCE(NEW.raw_user_meta_data->>'house', 'Society-wide')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();