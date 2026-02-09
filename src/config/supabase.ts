// Supabase configuration
export const supabaseConfig = {
    url: 'https://nbayaygqkootkrxhcgut.supabase.co',
    anonKey: 'anonkeygenerated'
};

// Initialize Supabase client
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
