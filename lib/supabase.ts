import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://chgbuqmzgojkbenlvbba.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_f5e6eHSdsuu9J1bvL-k5-w_anHu4vcK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
