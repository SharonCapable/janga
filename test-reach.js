async function test() {
    try {
        const url = 'https://lhcleyscukplyhqiydod.supabase.co';
        console.log(`Checking reachability of ${url}...`);
        const res = await fetch(url);
        console.log(`Status: ${res.status}`);
        console.log('Supabase API is reachable!');
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}
test();
