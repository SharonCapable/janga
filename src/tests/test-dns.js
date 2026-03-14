const dns = require('dns');

function check(hostname) {
    dns.lookup(hostname, (err, address, family) => {
        console.log(`${hostname} resolves to: ${address} (v${family})`);
        if (err) console.error(err);
    });
}

check('db.lhcleyscukplyhqiydod.supabase.co');
check('aws-0-us-central-1.pooler.supabase.com'); // example common pooler
