const dns = require('dns');

function check(hostname) {
    dns.lookup(hostname, (err, address, family) => {
        if (err) {
            console.log(`- ${hostname}: FAIL (${err.code})`);
        } else {
            console.log(`- ${hostname}: OK (${address})`);
        }
    });
}

const ref = 'lhcleyscukplyhqiydod';
check(`${ref}.supabase.co`);
check(`db.${ref}.supabase.co`);
check(`db.${ref}.supabase.net`);
check(`${ref}.db.supabase.co`);
check(`${ref}.pooler.supabase.com`);
