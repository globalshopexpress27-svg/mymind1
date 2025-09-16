/*
# [Fix & Consolidate] Database Helper Functions and Triggers

This migration script fixes errors related to missing helper functions by re-creating them in an idempotent way.
It ensures that all necessary functions (`handle_new_user`, `handle_updated_at`) and their associated triggers exist and are correctly configured.

## Query Description:
This operation is safe and non-destructive. It uses `CREATE OR REPLACE` for functions and `DROP TRIGGER IF EXISTS` before creating triggers,
making it re-runnable without causing errors. It will fix the "function does not exist" errors encountered during migrations.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the created functions and triggers)

## Structure Details:
- Function: `public.handle_new_user()`
- Trigger: `on_auth_user_created` on `auth.users`
- Function: `public.handle_updated_at()`
- Trigger: `handle_profiles_updated_at` on `public.profiles`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: The `handle_new_user` function is defined with `SECURITY DEFINER` to allow it to write to `public.profiles` upon user creation.

## Performance Impact:
- Indexes: None
- Triggers: Re-establishes essential triggers for data consistency.
- Estimated Impact: Low. These are standard, lightweight helper functions.
*/

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically update the 'updated_at' timestamp on tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' on the profiles table
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update 'updated_at' on the ai_conversations table
DROP TRIGGER IF EXISTS handle_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER handle_ai_conversations_updated_at
    BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
