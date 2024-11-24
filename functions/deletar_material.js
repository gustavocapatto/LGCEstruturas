const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Obter o ID do material a ser deletado
        const { id } = JSON.parse(event.body);

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'ID do material é obrigatório' }),
            };
        }

        // Conectar ao banco de dados
        const connection = await getConnection();

        // Executar o comando DELETE
        const [result] = await connection.execute('DELETE FROM materiais WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Material não encontrado' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Material deletado com sucesso' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao deletar material', details: err.message }),
        };
    }
};
