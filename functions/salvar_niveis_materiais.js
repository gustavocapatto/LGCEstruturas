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

        // Conexão com o banco de dados
        const connection = await getConnection();

        // 1. Obter os níveis já existentes no banco de dados
        const [existingLevels] = await connection.execute(
            'SELECT id, nome FROM niveis WHERE poste_id = ?',
            [poste_id]
        );

        const existingLevelsMap = new Map(existingLevels.map(level => [level.nome.trim(), level.id]));

        const niveisToAdd = [];
        const niveisToUpdate = [];
        const niveisToRemove = [];
        const materialsPromises = [];

        // Organizar os níveis para adicionar, atualizar ou remover
        for (const { nivelId, nivelNome, materiais } of niveis) {
            const trimmedNivelNome = nivelNome.trim();

            if (!existingLevelsMap.has(trimmedNivelNome)) {
                // Se o nível não existe, devemos adicioná-lo
                niveisToAdd.push({ nivelNome: trimmedNivelNome, materiais });
            } else {
                // Se o nível existe, verificar atualizações ou processar materiais
                const existingLevelId = existingLevelsMap.get(trimmedNivelNome);

                // Processar materiais para o nível existente
                const [existingMaterials] = await connection.execute(
                    'SELECT id, codigo, nome, quantidade FROM materiais_nivel WHERE nivel_id = ?',
                    [existingLevelId]
                );

                const existingMaterialsMap = new Map(existingMaterials.map(material => [material.codigo.trim(), material]));

                const materialsToAdd = [];
                const materialsToUpdate = [];
                const materialsToRemove = [];

                for (const { materialId, codigo, nome, quantidade } of materiais) {
                    const trimmedCodigo = codigo.trim();

                    if (!existingMaterialsMap.has(trimmedCodigo)) {
                        // Adicionar materiais novos
                        materialsToAdd.push({ codigo: trimmedCodigo, nome, quantidade });
                    } else {
                        // Atualizar materiais existentes
                        const existingMaterial = existingMaterialsMap.get(trimmedCodigo);
                        if (
                            materialId &&
                            materialId !== existingMaterial.id &&
                            (nome !== existingMaterial.nome || quantidade !== existingMaterial.quantidade)
                        ) {
                            // Aqui, verificamos se houve mudança no nome ou na quantidade
                            materialsToUpdate.push({ materialId, codigo: trimmedCodigo, nome, quantidade });
                        } else if (quantidade !== existingMaterial.quantidade) {
                            // Se a quantidade mudou, atualizamos
                            materialsToUpdate.push({ materialId: existingMaterial.id, codigo: trimmedCodigo, nome, quantidade });
                        }
                    }
                }

                // Identificar materiais para remoção
                for (const { id, codigo } of existingMaterials) {
                    if (!materiais.some(material => material.codigo.trim() === codigo.trim())) {
                        materialsToRemove.push(id);
                    }
                }

                // Gerar promessas para materiais
                for (const { codigo, nome, quantidade } of materialsToAdd) {
                    const insertQuery = 'INSERT INTO materiais_nivel (nivel_id, codigo, nome, quantidade) VALUES (?, ?, ?, ?)';
                    materialsPromises.push(connection.execute(insertQuery, [existingLevelId, codigo, nome, quantidade]));
                }

                for (const { materialId, codigo, nome, quantidade } of materialsToUpdate) {
                    const updateQuery = 'UPDATE materiais_nivel SET nome = ?, quantidade = ? WHERE id = ? AND nivel_id = ?';
                    materialsPromises.push(connection.execute(updateQuery, [nome, quantidade, materialId, existingLevelId]));
                }

                if (materialsToRemove.length > 0) {
                    const deleteQuery = `DELETE FROM materiais_nivel WHERE nivel_id = ? AND id IN (${materialsToRemove.join(', ')})`;
                    materialsPromises.push(connection.execute(deleteQuery, [existingLevelId]));
                }
            }
        }

        // Identificar níveis para remoção
        for (const { id, nome } of existingLevels) {
            if (!niveis.some(nivel => nivel.nivelNome.trim() === nome.trim())) {
                niveisToRemove.push(id);
            }
        }

        // 3. Realizar operações no banco de dados
        const promises = [];

        // Inserir novos níveis
        for (const { nivelNome, materiais } of niveisToAdd) {
            const insertQuery = 'INSERT INTO niveis (poste_id, nome) VALUES (?, ?)';
            const [result] = await connection.execute(insertQuery, [poste_id, nivelNome]);
            const newNivelId = result.insertId;

            // Inserir materiais para os novos níveis
            for (const { codigo, nome, quantidade } of materiais) {
                const materialQuery = 'INSERT INTO materiais_nivel (nivel_id, codigo, nome, quantidade) VALUES (?, ?, ?, ?)';
                promises.push(connection.execute(materialQuery, [newNivelId, codigo, nome, quantidade]));
            }
        }

        // Atualizar níveis existentes
        for (const { nivelId, nivelNome } of niveisToUpdate) {
            const updateQuery = 'UPDATE niveis SET nome = ? WHERE id = ? AND poste_id = ?';
            promises.push(connection.execute(updateQuery, [nivelNome, nivelId, poste_id]));
        }

        // Remover níveis
        if (niveisToRemove.length > 0) {
            const deleteQuery = `DELETE FROM niveis WHERE poste_id = ? AND id IN (${niveisToRemove.join(', ')})`;
            promises.push(connection.execute(deleteQuery, [poste_id]));
        }

        // Aguardar todas as operações de materiais
        await Promise.all(materialsPromises);

        // Aguardar todas as operações de níveis
        await Promise.all(promises);

        // Fechar a conexão
        await connection.end();

        // Responder com sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Níveis e materiais modificados com sucesso!',
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
                error: 'Erro ao modificar níveis e materiais',
                details: err.message,
            }),
        };
    }
};
