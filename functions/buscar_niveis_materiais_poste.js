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
        const niveisQuery = 'SELECT id, nome FROM niveis WHERE poste_id = ?';
        const [niveis] = await connection.execute(niveisQuery, [poste_id]);

        // Para cada nível, buscar os materiais associados
        for (const nivel of niveis) {
            const materiaisQuery = `
                SELECT id, codigo, nome, quantidade 
                FROM materiais_nivel 
                WHERE nivel_id = ?`;
            const [materiais] = await connection.execute(materiaisQuery, [nivel.id]);
            nivel.materiais = materiais; // Adicionar os materiais ao nível
        }

        // Finalizar conexão
        await connection.end();

        // Retornar os níveis encontrados com os materiais
        return {
            statusCode: 200,
            body: JSON.stringify({ niveis }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao buscar níveis e materiais',
                details: err.message,
            }),
        };
    }
};
