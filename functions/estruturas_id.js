const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    const id = event.queryStringParameters.id; // Pega o ID da query string

    try {
        const connection = await getConnection();
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
