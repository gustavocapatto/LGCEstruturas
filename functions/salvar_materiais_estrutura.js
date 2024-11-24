const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        const connection = await getConnection();

        // Extrair os dados enviados no corpo da requisição (body)
        const { estruturaId, materiais } = JSON.parse(event.body);

        // Verificar se os materiais foram recebidos
        if (!materiais || materiais.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Nenhum material foi enviado para vinculação' }),
            };
        }

        // Verificar se o ID da estrutura foi fornecido
        if (!estruturaId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'ID da estrutura é necessário' }),
            };
        }

        // Preparar as queries de inserção
        const insertQuery = 'INSERT INTO materiais_estrutura (estrutura_id, material_id, quantidade) VALUES (?, ?, ?)';

        // Usar uma transação para garantir a consistência dos dados
        await connection.beginTransaction();

        for (const material of materiais) {
            const { id, quantidade } = material;

            // Verificar se o material existe
            const [materialCheck] = await connection.execute('SELECT * FROM materiais WHERE id = ?', [id]);

            if (materialCheck.length === 0) {
                // Material não encontrado
                await connection.rollback(); // Desfaz a transação
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: `Material com ID ${id} não encontrado` }),
                };
            }

            // Inserir material na tabela materiais_estrutura
            await connection.execute(insertQuery, [estruturaId, id, quantidade]);
        }

        // Commitar a transação se todos os materiais forem válidos
        await connection.commit();

        // Finalizar a conexão
        await connection.end();

        // Resposta de sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Materiais vinculados com sucesso!' }),
        };
    } catch (err) {
        // Em caso de erro, faz rollback e retorna o erro
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao salvar os materiais', details: err.message }),
        };
    }
};
