import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => atob("aHR0cHM6Ly9yZGZnaWpzanNoZWd6emhjemN5ZC5zdXBhYmFzZS5jbw==");
const getSupabaseAnonKey = () => atob("c2JfcHVibGlzaGFibGVfY010aF81N3g5VWd4TGZtRWI2YzRGZ19wbzFKby1LcA==");
const getSupabaseServiceRoleKey = () => atob("ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5Ka1ptZHBhbk5xYzJobFozcDZhR042WTNsa0lpd2ljbTlzWlNJNkluTmxjblpwWTJWZmNtOXNaU0lzSW1saGRDSTZNVGM0TmpFek1UY3pNaXdpWlhod0lqb3lNVEF4TnpBM056TXlmUS5LRVdaTld2T3lXd2RWUHdESWdaeGY4WmRoU2dOazIyaC1mVVQzcnRlWnhV");

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
export const supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
