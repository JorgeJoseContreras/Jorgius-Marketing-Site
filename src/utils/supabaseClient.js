import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => atob("aHR0cHM6Ly9yZGZnaWpzenpzaGVnendoY3pjeWQuc3VwYWJhc2UuY28=");
const getSupabaseAnonKey = () => atob("ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5Ka1ptZHBhbE5xYzJobFozcDZhR042WTNsa0lpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT0RZeE16RTNNeklzSW1WNGNDSTZNakV3TVRjd056Y3pNbjAuZExUbGZMOXo0Z1V6bDQ1RWRhX3RlTVk3TnhmbEZha0dNMEdFRGpzR1JHNA==");

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
