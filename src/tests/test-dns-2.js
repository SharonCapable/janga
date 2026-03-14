const dns = require('dns');

function check(hostname) {
    dns.lookup(hostname, (err, address, family) => {
        if (err) {
            console.error(`Error looking up ${hostname}:`, err.code);
        } else {
            console.log(`${hostname} resolves to: ${address} (v${family})`);
        }
    });
}

check('lhcleyscukplyhqiydod.supabase.co');
check('db.lhcleyscukplyhqiydod.supabase.co');
