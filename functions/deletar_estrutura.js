const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'brqlwluvsqivy21cx7b9-mysql.services.clever-cloud.com',
    user: 'ubdvgysdirg5klgl',
    password: 'hsjUjsF5gKxv5mqrsXgz',
    database: 'brqlwluvsqivy21cx7b9',
};

exports.handler = async (event, context) => {
    try {
        // Parse os parâmetros da requisição
        const id = event.pathParameters.id;

        const connection = await mysql.createConnection(dbConfig);
        const query = 'DELETE FROM estruturas WHERE id = ?';
        const [result] = await connection.execute(query, [id]);

        await connection.end();

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Estrutura não encontrada' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Estrutura deletada com sucesso' }),
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
