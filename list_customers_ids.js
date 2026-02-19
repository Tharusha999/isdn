const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://rlssokpqvqqcgtvqbpjl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3Nva3BxdnFxY2d0dnFicGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzY1OTEsImV4cCI6MjA4NzAxMjU5MX0.n8ZefoWpW1F6RtqYZc40yUEsLQfgerb2uHkPmMsr2BM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listCustomers() {
    const { data, error } = await supabase.from('customer_users').select('id, full_name, username');
    if (error) {
        console.error(error);
        return;
    }
    console.log('--- CUSTOMER USERS ---');
    data.forEach(u => {
        console.log(`ID: "${u.id}", Name: "${u.full_name}", Username: "${u.username}"`);
    });
}

listCustomers();
