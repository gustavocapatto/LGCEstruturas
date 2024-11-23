const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'brqlwluvsqivy21cx7b9-mysql.services.clever-cloud.com',
    user: 'ubdvgysdirg5klgl',
    password: 'hsjUjsF5gKxv5mqrsXgz',
    database: 'brqlwluvsqivy21cx7b9',
};

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para JSON
        const body = JSON.parse(event.body);

        if (!body.nome) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "nome" é obrigatório' }),
            };
        }

        const connection = await mysql.createConnection(dbConfig);
        const query = 'INSERT INTO estruturas (nome) VALUES (?)';
        const [result] = await connection.execute(query, [body.nome]);

        await connection.end();

        return {
            statusCode: 201,
            body: JSON.stringify({ id: result.insertId, nome: body.nome }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao acessar o banco de dados',
                details: err.message,
            }),
        };
    }
};
