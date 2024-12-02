// dbConfig.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'sql.freedb.tech',
    user: 'freedb_lgcestrutura',
    password: 'ruVgU3t&3A?ArP7',
    database: 'freedb_lgcestrutura',
};

const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

module.exports = { getConnection };
