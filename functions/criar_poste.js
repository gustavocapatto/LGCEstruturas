const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { nome, id_material } = body;

        // Validações básicas
        if (!nome || nome.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "nome" é obrigatório.' }),
            };
        }
        if (!id_material) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "id_material" é obrigatório.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // Inserir o novo poste com id_material
        const [result] = await connection.execute(
            'INSERT INTO postes (nome, id_material) VALUES (?, ?)',
            [nome, id_material]
        );

        // Finalizar conexão
        await connection.end();

        // Responder com sucesso
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Poste criado com sucesso!',
                posteId: result.insertId,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao criar poste',
                details: err.message,
            }),
        };
    }
};
