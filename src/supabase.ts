import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://bvcbckegyelrnmxotbtg.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Y2Jja2VneWVscm5teG90YnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTcwMTcsImV4cCI6MjA5ODU3MzAxN30.lU_cKLl8QGAZ8XsOKWzc2KSE90witBT1sfDEu844sZo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
