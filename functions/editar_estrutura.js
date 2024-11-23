const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { id, nome } = body;

        // Validações básicas
        if (!id || isNaN(id)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "id" é obrigatório e deve ser um número válido.' }),
            };
        }

        if (!nome || nome.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "nome" é obrigatório.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // Atualizar a estrutura existente
        const [result] = await connection.execute(
            'UPDATE estruturas SET nome = ? WHERE id = ?',
            [nome, id]
        );

        // Finalizar conexão
        await connection.end();

        // Verificar se a atualização foi bem-sucedida
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Estrutura não encontrada ou nenhum dado atualizado.' }),
            };
        }

        // Responder com sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Estrutura atualizada com sucesso!',
                estruturaId: id,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao atualizar estrutura',
                details: err.message,
            }),
        };
    }
};
