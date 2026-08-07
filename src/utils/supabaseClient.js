import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => atob("aHR0cHM6Ly9yZGZnaWpzanNoZWd6emhjemN5ZC5zdXBhYmFzZS5jbw==");
const getSupabaseAnonKey = () => atob("c2JfcHVibGlzaGFibGVfY010aF81N3g5VWd4TGZtRWI2YzRGZ19wbzFKby1LcA==");

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
