const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { id, nome, id_material } = body;

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

        if (!id_material || isNaN(id_material)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "id_material" é obrigatório e deve ser um número válido.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // Atualizar o poste na tabela
        const [result] = await connection.execute(
            'UPDATE postes SET nome = ?, id_material = ? WHERE id = ?',
            [nome, id_material, id]
        );

        // Finalizar conexão
        await connection.end();

        // Verificar se a atualização foi bem-sucedida
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Poste não encontrado ou nenhum dado atualizado.' }),
            };
        }

        // Responder com sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Poste atualizado com sucesso!',
                posteId: id,
                updatedFields: { nome, id_material },
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao atualizar poste',
                details: err.message,
            }),
        };
    }
};
