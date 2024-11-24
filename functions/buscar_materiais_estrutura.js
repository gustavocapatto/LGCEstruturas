const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        const connection = await getConnection();

        // Extrair o ID da estrutura a partir do corpo da requisição (body)
        const { estruturaId } = JSON.parse(event.body);

        // Verificar se o ID da estrutura foi fornecido
        if (!estruturaId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'ID da estrutura é necessário' }),
            };
        }

        // Query para buscar os materiais associados à estrutura
        const query = `
            SELECT me.id, me.estrutura_id, me.material_id, me.quantidade, m.nome AS material_nome
            FROM materiais_estrutura me
            JOIN materiais m ON me.material_id = m.id
            WHERE me.estrutura_id = ?
        `;

        // Executar a query no banco de dados
        const [rows] = await connection.execute(query, [estruturaId]);

        // Finalizar a conexão
        await connection.end();

        // Retornar os dados encontrados
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, materiais: rows }),
        };
    } catch (err) {
        // Em caso de erro, retornar uma resposta de erro
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao buscar os materiais', details: err.message }),
        };
    }
};
