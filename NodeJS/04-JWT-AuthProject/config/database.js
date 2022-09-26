const { createPool } = require("mysql");

const pool = createPool({
    port: 3306,
    host: "localhost",
    user: "root",
    password: 'welcome$1234',
    database: 'test',
    connectionLimit: 10
});

module.exports = pool;