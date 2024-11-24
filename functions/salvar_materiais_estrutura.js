// Importando a função de conexão do dbConfig
const { getConnection } = require('./dbConfig');

// Função que será chamada ao tentar salvar os materiais
exports.handler = async (event) => {
    const { estruturaId, materiais } = JSON.parse(event.body); // Dados enviados na requisição

    let connection;

    try {
        // Obtém a conexão com o banco de dados
        connection = await getConnection();

        // AQUI VAI A LÓGICA PARA SALVAR, ATUALIZAR E REMOVER MATERIAIS
        for (const material of materiais) {
            const { id, quantidade } = material;

            // Verifica se o material já está vinculado à estrutura
            const [rows] = await connection.execute(
                'SELECT * FROM materiais_estrutura WHERE estrutura_id = ? AND material_id = ?',
                [estruturaId, id]
            );

            if (rows.length > 0) {
                // Material já vinculado, atualiza a quantidade
                await connection.execute(
                    'UPDATE materiais_estrutura SET quantidade = ? WHERE estrutura_id = ? AND material_id = ?',
                    [quantidade, estruturaId, id]
                );
            } else {
                // Se não está vinculado, adiciona o material
                await connection.execute(
                    'INSERT INTO materiais_estrutura (estrutura_id, material_id, quantidade) VALUES (?, ?, ?)',
                    [estruturaId, id, quantidade]
                );
            }
        }

        // Verifica se existem IDs de materiais para remover
        const idsExistentes = materiais.map(material => material.id);

        if (idsExistentes.length > 0) {
            // Caso haja materiais, cria uma string de placeholders para o IN
            const placeholders = idsExistentes.map(() => '?').join(', ');

            // Passa os parâmetros de estruturaId e os IDs materiais para o DELETE
            await connection.execute(
                `DELETE FROM materiais_estrutura WHERE estrutura_id = ? AND material_id NOT IN (${placeholders})`,
                [estruturaId, ...idsExistentes]  // Passa estruturaId + os IDs materiais
            );
        } else {
            // Caso a lista de materiais esteja vazia, remove todos os materiais vinculados à estrutura
            await connection.execute(
                'DELETE FROM materiais_estrutura WHERE estrutura_id = ?',
                [estruturaId]  // Deleta todos os materiais vinculados à estrutura
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Materiais salvos com sucesso!' })
        };
    } catch (err) {
        console.error('Erro ao salvar materiais:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Erro ao salvar materiais' })
        };
    } finally {
        // Fecha a conexão após o uso (importante para evitar vazamento de recursos)
        if (connection) {
            await connection.end();
        }
    }
};
