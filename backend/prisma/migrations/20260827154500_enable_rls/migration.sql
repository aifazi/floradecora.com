-- Enable Row Level Security on all public tables as defense-in-depth.
--
-- The backend connects with the `postgres` role (Supabase database owner) which
-- BYPASSES RLS by default, so the application is unaffected by this change.
-- RLS being enabled (with no policies) means:
--   1. The `anon` and `authenticated` roles (used by PostgREST/Supabase APIs) can
--      no longer read or write these tables.
--   2. Any future use of those roles (e.g., Supabase JS client with anon key)
--      is denied by default, preventing accidental data exposure.
--
-- If you ever need to give a Supabase role access, add a policy, e.g.:
--   CREATE POLICY <name> ON public.<table> FOR SELECT TO anon USING (false);
-- See https://www.postgresql.org/docs/current/ddl-rowsecurity.html
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_providers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cdn_providers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queues       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens     ENABLE ROW LEVEL SECURITY;
