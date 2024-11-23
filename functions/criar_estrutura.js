const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { nome } = body;

        // Validações básicas
        if (!nome || nome.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "nome" é obrigatório.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // Inserir a nova estrutura
        const [result] = await connection.execute(
            'INSERT INTO estruturas (nome) VALUES (?)',
            [nome]
        );

        // Finalizar conexão
        await connection.end();

        // Responder com sucesso
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Estrutura criada com sucesso!',
                estruturaId: result.insertId,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao criar estrutura',
                details: err.message,
            }),
        };
    }
};
