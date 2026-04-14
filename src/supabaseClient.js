import { createClient } from "@supabase/supabase-js";

// Hardcoded defaults so the app runs with zero setup. These are the PUBLIC
// publishable key + project URL and are safe to ship in client code —
// Row Level Security (enforced in SQL) is what actually protects data.
// Override via env vars in production (Netlify) if you ever rotate the key.
const DEFAULT_SUPABASE_URL = "https://ajoxgyenoshjhanuemra.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_0d9MBSW0rcNlxzMkUl_iyg_bIXo7STn";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
