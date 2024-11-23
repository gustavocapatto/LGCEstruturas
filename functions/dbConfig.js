// dbConfig.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'brqlwluvsqivy21cx7b9-mysql.services.clever-cloud.com',
    user: 'ubdvgysdirg5klgl',
    password: 'hsjUjsF5gKxv5mqrsXgz',
    database: 'brqlwluvsqivy21cx7b9',
};

const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

module.exports = { getConnection };
