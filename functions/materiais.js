const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.execute('SELECT * FROM materiais');
        await connection.end();

        return {
            statusCode: 200,
            body: JSON.stringify(results),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao acessar o banco de dados', details: err.message }),
        };
    }
};
