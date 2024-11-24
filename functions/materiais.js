const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    let connection;
    try {
        connection = await getConnection();
        const [results] = await connection.execute('SELECT * FROM materiais');
        return {
            statusCode: 200,
            body: JSON.stringify(results), // Retorna todos os materiais
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao acessar o banco de dados', details: err.message }),
        };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
