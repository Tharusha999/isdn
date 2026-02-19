const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://rlssokpqvqqcgtvqbpjl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3Nva3BxdnFxY2d0dnFicGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzY1OTEsImV4cCI6MjA4NzAxMjU5MX0.n8ZefoWpW1F6RtqYZc40yUEsLQfgerb2uHkPmMsr2BM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllUsers() {
    console.log('--- CUSTOMER USERS ---');
    const { data: cu, error: cue } = await supabase.from('customer_users').select('*');
    if (cue) console.error(cue);
    else console.table(cu.map(u => ({ id: u.id, name: u.full_name, user: u.username })));

    console.log('--- ADMIN USERS ---');
    const { data: au, error: aue } = await supabase.from('admin_users').select('*');
    if (aue) console.error(aue);
    else console.table(au.map(u => ({ id: u.id, name: u.full_name, user: u.username })));
}

listAllUsers();
