const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',          // Change this line
    database: 'postgres',
    password: 'root',
    port: 5432,
    connectionTimeoutMillis: 80000, // 30 seconds
});

module.exports = pool;
