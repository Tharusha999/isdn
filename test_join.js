const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://rlssokpqvqqcgtvqbpjl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3Nva3BxdnFxY2d0dnFicGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzY1OTEsImV4cCI6MjA4NzAxMjU5MX0.n8ZefoWpW1F6RtqYZc40yUEsLQfgerb2uHkPmMsr2BM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testJoin() {
    console.log('Testing join for orders...');
    const { data, error } = await supabase
        .from('orders')
        .select('*, customer_users(full_name)')
        .limit(5);

    if (error) {
        console.error('Join Error:', error);
        return;
    }

    console.log('Latest Orders with Joined Names:');
    data.forEach(o => {
        console.log(`Order: ${o.id}, CID: ${o.customer_id}, Resolved Name: ${o.customer_users?.full_name || 'NULL'}`);
    });
}

testJoin();
