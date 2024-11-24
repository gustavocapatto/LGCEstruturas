const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { nome, unidade_de_medida } = body;

        // Validações básicas
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

        // Inserir o novo material
        const [result] = await connection.execute(
            'INSERT INTO materiais (nome, unidade_de_medida) VALUES (?, ?)',
            [nome, unidade_de_medida]
        );

        // Finalizar conexão
        await connection.end();

        // Responder com sucesso
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Material criado com sucesso!',
                materialId: result.insertId,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao criar material',
                details: err.message,
            }),
        };
    }
};
