const { getConnection } = require('./dbConfig');

exports.handler = async (event, context) => {
    try {
        // Parse o corpo da requisição para obter os dados enviados
        const body = JSON.parse(event.body);
        const { poste_id, niveis } = body;

        // Validações básicas
        if (!poste_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "poste_id" é obrigatório.' }),
            };
        }

        if (!Array.isArray(niveis) || niveis.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'O campo "niveis" deve ser uma lista e não pode estar vazio.' }),
            };
        }

        // Conexão com o banco de dados
        const connection = await getConnection();

        // 1. Obter os níveis já existentes no banco de dados
        const [existingLevels] = await connection.execute(
            'SELECT id, nome FROM niveis WHERE poste_id = ?',
            [poste_id]
        );

        // 2. Identificar os níveis a adicionar, atualizar ou remover
        const existingLevelsMap = new Map(existingLevels.map(level => [level.nome.trim(), level.id]));

        const niveisToAdd = [];
        const niveisToUpdate = [];
        const niveisToRemove = [];

        // Organize os dados de acordo com a necessidade de inserção, atualização e remoção
        for (const { nivelId, nivelNome } of niveis) {
            const trimmedNivelNome = nivelNome.trim();

            if (!existingLevelsMap.has(trimmedNivelNome)) {
                // Se o nome do nível não existe, devemos adicionar
                niveisToAdd.push({ nivelNome: trimmedNivelNome });
            } else {
                // Se o nível existe, deve ser atualizado
                const existingLevelId = existingLevelsMap.get(trimmedNivelNome);
                if (nivelId && nivelId !== existingLevelId) {
                    niveisToUpdate.push({ nivelId, nivelNome: trimmedNivelNome });
                }
            }
        }

        // Verificar os níveis existentes que não estão na lista para remoção
        for (const { id, nome } of existingLevels) {
            if (!niveis.some(nivel => nivel.nivelNome.trim() === nome.trim())) {
                niveisToRemove.push(id);
            }
        }

        // 3. Realizar inserções, atualizações e exclusões
        const promises = [];

        // Inserir novos níveis
        for (const { nivelNome } of niveisToAdd) {
            const insertQuery = 'INSERT INTO niveis (poste_id, nome) VALUES (?, ?)';
            promises.push(connection.execute(insertQuery, [poste_id, nivelNome]));
        }

        // Atualizar níveis existentes
        for (const { nivelId, nivelNome } of niveisToUpdate) {
            const updateQuery = 'UPDATE niveis SET nome = ? WHERE id = ? AND poste_id = ?';
            promises.push(connection.execute(updateQuery, [nivelNome, nivelId, poste_id]));
        }

        // Remover níveis que não estão mais na lista
        if (niveisToRemove.length > 0) {
            const deleteQuery = `DELETE FROM niveis WHERE poste_id = ? AND id IN (${niveisToRemove.join(', ')})`;
            promises.push(connection.execute(deleteQuery, [poste_id]));
        }

        // Executar todas as operações de inserção, atualização e exclusão
        await Promise.all(promises);

        // Fechar a conexão
        await connection.end();

        // Responder com sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Níveis modificados com sucesso!',
                niveisModificados: {
                    adicionados: niveisToAdd.map(level => level.nivelNome),
                    atualizados: niveisToUpdate.map(level => level.nivelNome),
                    removidos: niveisToRemove,
                },
            }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao modificar níveis',
                details: err.message,
            }),
        };
    }
};
