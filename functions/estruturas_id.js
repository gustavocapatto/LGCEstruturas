const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'brqlwluvsqivy21cx7b9-mysql.services.clever-cloud.com',
    user: 'ubdvgysdirg5klgl',
    password: 'hsjUjsF5gKxv5mqrsXgz',
    database: 'brqlwluvsqivy21cx7b9',
};

exports.handler = async (event, context) => {
    const id = event.queryStringParameters.id; // Pega o ID da query string

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute('SELECT * FROM estruturas WHERE id = ?', [id]);
        await connection.end();

        if (results.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Estrutura não encontrada' }) };
        }

        return { statusCode: 200, body: JSON.stringify(results[0]) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao acessar o banco de dados', details: err.message }) };
    }
};
