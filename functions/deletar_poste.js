const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Obter o ID do poste a ser deletado
        const { id } = JSON.parse(event.body);

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'ID do poste é obrigatório' }),
            };
        }

        // Conectar ao banco de dados
        const connection = await getConnection();
        
        // Executar o comando DELETE
        const [result] = await connection.execute('DELETE FROM postes WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Poste não encontrado' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Poste deletado com sucesso' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao deletar poste', details: err.message }),
        };
    }
};
