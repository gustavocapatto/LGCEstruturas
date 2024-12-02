// dbConfig.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'bijtknu4l3rjuqugby03-mysql.services.clever-cloud.com',
    user: 'bijtknu4l3rjuqugby03',
    password: 'gNEEzajDVzD52FDocn0B',
    database: 'bijtknu4l3rjuqugby03',
};

const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

module.exports = { getConnection };
