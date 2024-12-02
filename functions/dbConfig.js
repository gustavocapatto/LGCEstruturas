// dbConfig.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'sql.freedb.tech',
    user: 'freedb_lgcestrutura',
    password: 'hsjUjsF5gKxv5mqrsXgz',
    database: 'ruVgU3t&3A?ArP7',
};

const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

module.exports = { getConnection };
