const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { id, nome, unidade_de_medida } = body;

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

        if (!unidade_de_medida || unidade_de_medida.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "unidade_de_medida" é obrigatório.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // Atualizar o material no banco de dados
        const [result] = await connection.execute(
            'UPDATE materiais SET nome = ?, unidade_de_medida = ? WHERE id = ?',
            [nome, unidade_de_medida, id]
        );

        // Se nenhum material for atualizado (caso o id não exista)
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Material não encontrado.' }),
            };
        }

        // Finalizar conexão
        await connection.end();

        // Responder com sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Material atualizado com sucesso!',
                materialId: id,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao atualizar material',
                details: err.message,
            }),
        };
    }
};
