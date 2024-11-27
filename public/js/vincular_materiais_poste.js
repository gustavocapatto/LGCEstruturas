function vincularMateriaisPoste(posteId, posteNome) {
    // Verifica se o modal já existe. Se existir, não cria um novo, mas limpa os dados.
    let modal = document.getElementById(`vincularMateriaisModal_${posteId}`);
    if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide(); // Esconde o modal antes de removê-lo
        modal.remove(); // Remove o modal existente
    }

    // Criação do modal dinamicamente
modal = document.createElement('div');
modal.classList.add('modal', 'fade');
modal.id = `vincularMateriaisModal_${posteId}`;
modal.tabIndex = -1;
modal.setAttribute('aria-labelledby', `vincularMateriaisPosteModalLabel_${posteId}`);

modal.innerHTML = `
<div class="modal-dialog modal-dialog-scrollable w-100 mw-100 mx-auto p-4">
    <div class="modal-content shadow-lg rounded-3">
        <div class="modal-header border-0">
            <h5 class="modal-title text-uppercase" id="vincularMateriaisPosteModalLabel_${posteId}">
                ${posteNome} - ID: ${posteId}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body">
            <div id="tabelasContainer_${posteId}"></div>
            <button type="button" class="btn btn-outline-success w-100 mt-3" id="addTableBtn_${posteId}">
                Adicionar Nível
            </button>
        </div>
        <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-outline-primary" id="saveBtn_${posteId}">Salvar</button>
        </div>
    </div>
</div>
`;

    // Função para carregar os níveis
    async function carregarNiveis(posteId) {
        try {
            const response = await fetch('/buscar_niveis_materiais_poste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poste_id: posteId }),
            });
            const data = await response.json();

            if (data.niveis && data.niveis.length > 0) {
                const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);
                data.niveis.forEach(nivel => {
                    const newTable = criarTabelaNivel(posteId, nivel);
                    tabelasContainer.appendChild(newTable);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar níveis:', error);
        }
    }

    // Função que cria a tabela para um nível específico
    function criarTabelaNivel(posteId, nivel = {}) {
        const newTable = document.createElement('div');
        newTable.classList.add('mb-4');
        newTable.innerHTML = `
    <div class="card border-0 shadow-lg rounded-lg" data-nivel-id="${nivel.id || ''}">
        <div class="card-body p-4">
            <h5 class="card-title text-muted mb-3">Nível</h5>
            <div class="table-responsive">
                <table class="table table-borderless table-sm mb-4">
                    <thead>
                        <tr>
                            <th scope="col" class="col-6">Nome</th>
                            <th scope="col" class="col-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control form-control-sm" value="${nivel.nome || ''}" placeholder="Nome do Nível" /></td>
                            <td class="text-center">
                                <button type="button" class="btn btn-danger btn-sm rounded-circle removeBtn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h6 class="text-muted">Materiais</h6>
            <div class="table-responsive">
                <table class="table table-bordered table-sm mb-3">
                    <thead>
                        <tr class="table-light">
                            <th scope="col">Código</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Quantidade</th>
                            <th scope="col" class="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Linha inicial de material -->
                        ${nivel.materiais ? nivel.materiais.map(material => `
                        <tr class="table-row">
                            <td><input type="text" class="form-control form-control-sm materialCode" value="${material.codigo || ''}" placeholder="Código" /></td>
                            <td><input type="text" class="form-control form-control-sm materialName" value="${material.nome || ''}" placeholder="Nome" readonly /></td>
                            <td><input type="number" class="form-control form-control-sm" value="${material.quantidade || ''}" placeholder="Quantidade" /></td>
                            <td class="text-center">
                                <button type="button" class="btn btn-danger btn-sm rounded-circle removeMaterialBtn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2 addMaterialBtn">
                    <i class="bi bi-plus-circle"></i> Adicionar Material
                </button>
            </div>
        </div>
    </div>
`;

        // Lógica para remover o nível
        const removeBtn = newTable.querySelector('.removeBtn');
        removeBtn.addEventListener('click', () => newTable.remove());

        // Lógica para adicionar materiais
        const addMaterialBtn = newTable.querySelector('.addMaterialBtn');
        addMaterialBtn.addEventListener('click', () => adicionarMaterial(newTable));

        return newTable;
    }

    // Função para adicionar material a um nível
    function adicionarMaterial(newTable) {
        const materialTable = newTable.querySelector('.table-bordered tbody');
        const newMaterialRow = document.createElement('tr');
        newMaterialRow.innerHTML = `
            <td><input type="text" class="form-control form-control-sm materialCode" placeholder="Código"></td>
            <td><input type="text" class="form-control form-control-sm materialName" placeholder="Nome" readonly></td>
            <td><input type="number" class="form-control form-control-sm" placeholder="Quantidade"></td>
            <td class="text-center">
                <button type="button" class="btn btn-danger btn-sm rounded-circle removeMaterialBtn"><i class="bi bi-trash"></i></button>
            </td>
        `;
        
        // Lógica para buscar nome do material
        const materialCodeInput = newMaterialRow.querySelector('.materialCode');
        const materialNameInput = newMaterialRow.querySelector('.materialName');

        materialCodeInput.addEventListener('input', () => {
            const codigo = materialCodeInput.value.trim();
            const material = listaDeMateriais.find(item => item.id.toString() === codigo);

            if (material) {
                materialNameInput.value = material.nome;
                materialCodeInput.classList.remove('is-invalid');
                materialNameInput.classList.remove('is-invalid');
            } else {
                materialNameInput.value = ''; // Limpa o nome se o material não for encontrado
                materialCodeInput.classList.add('is-invalid');
                materialNameInput.classList.add('is-invalid');
            }
        });

        // Lógica para remover o material
        const removeMaterialBtn = newMaterialRow.querySelector('.removeMaterialBtn');
        removeMaterialBtn.addEventListener('click', () => newMaterialRow.remove());

        materialTable.appendChild(newMaterialRow);
    }

    // Carregar os níveis ao abrir o modal
    carregarNiveis(posteId);

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    const addTableBtn = document.getElementById(`addTableBtn_${posteId}`);
    addTableBtn.addEventListener('click', () => {
        const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);
        const newTable = criarTabelaNivel(posteId);
        tabelasContainer.appendChild(newTable);
    });


    const saveBtn = document.getElementById(`saveBtn_${posteId}`);
    saveBtn.addEventListener('click', async () => {
        const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);
        const niveis = [];
        
        tabelasContainer.querySelectorAll('.card').forEach((card) => {
            const nivelId = card.getAttribute('data-nivel-id'); // Recupera o ID do nível
            const nivelNome = card.querySelector('input').value.trim(); // Recupera o nome do nível
            
            if (nivelNome) {
                // Adiciona o nível com os materiais associados
                niveis.push({
                    nivelId,  // Inclui o ID do nível para atualização, se necessário
                    nivelNome,
                });
            }
        });
    
        console.log(`ID da Estrutura: ${posteId}`);
        console.log(niveis);
    
        // Envia os dados para o servidor
        try {
            const response = await fetch('/salvar_niveis_materiais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    poste_id: posteId,
                    niveis: niveis,
                }),
            });
    
            const result = await response.json();
            
            if (response.ok) {
                console.log('Níveis salvos ou atualizados com sucesso!', result);
                showAlert('Níveis salvos ou atualizados com sucesso!', 'success');
                
                // Fecha o modal após sucesso
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();  // Fecha o modal
                
            } else {
                console.error('Erro ao salvar os níveis:', result.error);
                showAlert('Erro ao salvar os níveis. Tente novamente.', 'danger');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados para o servidor:', error);
            showAlert('Erro ao enviar os dados para o servidor. Tente novamente.', 'danger');
        }
    });
    
    
    
}
