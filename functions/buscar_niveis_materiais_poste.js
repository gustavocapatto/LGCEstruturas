const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter o poste_id
        const body = JSON.parse(event.body);
        const { poste_id } = body;

        // Validações básicas
        if (!poste_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "poste_id" é obrigatório.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // Buscar os níveis para o poste
        const query = 'SELECT id, nome FROM niveis WHERE poste_id = ?';
        const [niveis] = await connection.execute(query, [poste_id]);

        // Finalizar conexão
        await connection.end();

        // Retornar os níveis encontrados
        return {
            statusCode: 200,
            body: JSON.stringify({ niveis }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao buscar níveis',
                details: err.message,
            }),
        };
    }
};
