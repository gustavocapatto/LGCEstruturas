const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Obter o ID da estrutura a ser deletada
        const { id } = JSON.parse(event.body);

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'ID da estrutura é obrigatório' }),
            };
        }

        // Conectar ao banco de dados
        const connection = await getConnection();
        
        // Executar o comando DELETE
        const [result] = await connection.execute('DELETE FROM estruturas WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Estrutura não encontrada' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Estrutura deletada com sucesso' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao deletar estrutura', details: err.message }),
        };
    }
};
