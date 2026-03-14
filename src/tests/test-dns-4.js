const dns = require('dns');

const regions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-central-1', 'eu-west-1', 'ap-southeast-1'];
const ref = 'lhcleyscukplyhqiydod';

function check(hostname) {
    dns.lookup(hostname, (err, address, family) => {
        if (!err) console.log(`- ${hostname}: OK (${address})`);
    });
}

regions.forEach(r => {
    check(`aws-0-${r}.pooler.supabase.com`);
});
