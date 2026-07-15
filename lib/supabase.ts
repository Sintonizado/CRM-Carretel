
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjdrmuyrrnczovpubrtu.supabase.co';
const supabaseAnonKey = 'sb_publishable_CI2dVtRNshHNuZI1hOVk0Q_qed4ouRh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
