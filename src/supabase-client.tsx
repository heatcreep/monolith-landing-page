import { createClient } from '@supabase/supabase-js';

// Replace the placeholders with your actual Supabase credentials
const supabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`;
const supabaseKey = `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`;

console.log(process.env.SUPABASE_URL);

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
