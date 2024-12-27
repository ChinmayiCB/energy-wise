import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_PROJECT_URL;
const ANON_KEY = import.meta.env.VITE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL || "", ANON_KEY || "");
