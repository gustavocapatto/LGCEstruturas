const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        const connection = await getConnection();
        
        // Pega o ID do material passado como parâmetro na query string
        const materialId = event.queryStringParameters.id;
        
        // Busca o nome do material no banco
        const [results] = await connection.execute('SELECT nome FROM materiais WHERE id = ?', [materialId]);
        await connection.end();

        if (results.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ nome: results[0].nome }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Material não encontrado' }),
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao acessar o banco de dados', details: err.message }),
        };
    }
};
