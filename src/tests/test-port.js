const net = require('net');

const host = 'aws-1-eu-west-1.pooler.supabase.com';
const port = 6543;

console.log(`Checking connection to ${host}:${port}...`);

const socket = new net.Socket();
socket.setTimeout(5000);

socket.on('connect', () => {
    console.log('CONNECTED!');
    socket.destroy();
});

socket.on('timeout', () => {
    console.log('TIMEOUT');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log('ERROR:', err.message);
});

socket.connect(port, host);
