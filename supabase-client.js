//setup supabase client (CommonJS)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  //process.env.SUPABASE_ANON_KEY,  // Use ANON_KEY for client-side operations
  process.env.SUPABASE_SERVICE_ROLE_KEY,  // Use SERVICE_ROLE_KEY to bypass RLS
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Backend doesn't need to persist sessions
      detectSessionInUrl: false
    }
  }
);

module.exports = { supabase };