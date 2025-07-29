const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgres://mrhackathon:postgres@2025@mr-hackathon-db.postgres.database.azure.com:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect((err) => {
    if (err) {
        console.error('Connection error:', err.stack);
    } else {
        console.log('Database connected successfully.');
    }
});

/*require('dotenv').config();
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: String(process.env.PG_PASSWORD),
    ssl: false
});

client.connect((err) => {
    if (err) {
        console.error('Connection error:', err.stack);
    } else {
        console.log('Database connected successfully.');
    }
});*/

module.exports = client;
