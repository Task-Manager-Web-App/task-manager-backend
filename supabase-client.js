//setup supabase client (CommonJS)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Backend doesn't need to persist sessions
      detectSessionInUrl: false
    }
  }
);

module.exports = { supabase };