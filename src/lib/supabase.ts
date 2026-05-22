import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jabatojbjmzylzmsdbks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYmF0b2piam16eWx6bXNkYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjM3MDAsImV4cCI6MjA2NTIzOTcwMH0.sb_publishable_u3JkdDW2sCLnwZzpkP3gaw_hhYD6PHy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);