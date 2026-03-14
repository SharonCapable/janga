
const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('Attempting to connect to:', process.env.DATABASE_URL.split('@')[1]);
        await client.connect();
        console.log('Connection successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection failed:', err.message);
        if (err.message.includes('Tenant or user not found')) {
            console.log('\nTIP: This usually means the username (the part after postgres.) is incorrect or the project ID has changed.');
        }
    }
}

testConnection();
