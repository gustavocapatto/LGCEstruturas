const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'brqlwluvsqivy21cx7b9-mysql.services.clever-cloud.com',
    user: 'ubdvgysdirg5klgl',
    password: 'hsjUjsF5gKxv5mqrsXgz',
    database: 'brqlwluvsqivy21cx7b9',
};

exports.handler = async (event, context) => {
    try {
        // Parse os parâmetros e o corpo da requisição
        const body = JSON.parse(event.body);
        const id = event.pathParameters.id;

        if (!body.nome) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "nome" é obrigatório' }),
            };
        }

        const connection = await mysql.createConnection(dbConfig);
        const query = 'UPDATE estruturas SET nome = ? WHERE id = ?';
        const [result] = await connection.execute(query, [body.nome, id]);

        await connection.end();

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Estrutura não encontrada' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Estrutura atualizada com sucesso' }),
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
