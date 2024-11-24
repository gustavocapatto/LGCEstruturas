const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    let connection;

    try {
        // Usando a conexão do pool
        connection = await getConnection();

        // Selecionando apenas as colunas necessárias (exemplo: 'id' e 'nome')
        const [results] = await connection.execute('SELECT id, nome FROM estruturas');

        return {
            statusCode: 200,
            body: JSON.stringify(results),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao acessar o banco de dados', details: err.message }),
        };
    } finally {
        // Fechar a conexão de forma segura, sem atrasos adicionais
        if (connection) {
            await connection.end();
        }
    }
};
