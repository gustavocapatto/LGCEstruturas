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
    <div class="card border-0 shadow-sm rounded-lg bg-light" data-nivel-id="${nivel.id || ''}">
        <div class="card-body p-4">
            <h5 class="card-title text-primary fw-bold mb-4">Informações do Nível</h5>
            <div class="table-responsive">
                <table class="table table-borderless table-sm">
                    <thead>
                        <tr>
                            <th scope="col" class="col-8">Nome</th>
                            <th scope="col" class="col-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" class="form-control form-control-sm" value="${nivel.nome || ''}" placeholder="Nome do Nível" />
                            </td>
                            <td class="text-center">
                                <button type="button" class="btn btn-outline-danger btn-sm rounded-circle removeNivelBtn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h6 class="text-muted mb-3">Materiais</h6>
            <div class="table-responsive">
                <table class="table table-bordered table-sm">
                    <thead>
                        <tr class="table-light">
                            <th scope="col">Código</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Quantidade</th>
                            <th scope="col" class="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nivel.materiais ? nivel.materiais.map(material => `
                       <tr>
    <td>
        <input type="text" class="form-control form-control-sm materialCode" value="${material.codigo || ''}" placeholder="Código" />
    </td>
    <td>
        <input type="text" class="form-control form-control-sm materialName" value="${material.nome || ''}" placeholder="Nome" readonly />
    </td>
    <td>
        <input type="number" class="form-control form-control-sm" value="${material.quantidade || ''}" placeholder="Quantidade" />
    </td>
    <td class="text-center">
        <button type="button" class="btn btn-outline-danger btn-sm rounded-circle removeMaterialBtn">
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



        // Evento para remover a tabela de nível
        const removeNivelBtn = newTable.querySelector('.removeNivelBtn');
        removeNivelBtn.addEventListener('click', () => {
            newTable.remove();
        });

        const removeMaterialBtns = newTable.querySelectorAll('.removeMaterialBtn');
        removeMaterialBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('tr').remove();
            });
        });


        // Lógica para adicionar materiais
        const addMaterialBtn = newTable.querySelector('.addMaterialBtn');
        addMaterialBtn.addEventListener('click', () => adicionarMaterial(newTable));

        const materialCodeInputs = newTable.querySelectorAll('.materialCode');
        materialCodeInputs.forEach(input => {
            input.addEventListener('input', () => {
                const searchTerm = input.value.trim().toLowerCase();  // Obtém o valor de busca (código ou nome)



                const materialNameInput = input.closest('tr').querySelector('.materialName');
                const material = listaDeMateriais.find(item => item.id.toString() === searchTerm || item.nome.toLowerCase().includes(searchTerm));

                if (material) {
                    materialNameInput.value = material.nome;
                    input.classList.remove('is-invalid');
                    materialNameInput.classList.remove('is-invalid');
                } else {
                    materialNameInput.value = ''; // Limpa o nome se o material não for encontrado
                    input.classList.add('is-invalid');
                    materialNameInput.classList.add('is-invalid');
                }
            });
        });




        return newTable;
    }



    /// Função para adicionar material a um nível
    function adicionarMaterial(newTable) {
        const materialTable = newTable.querySelector('.table-bordered tbody');
        const newMaterialRow = document.createElement('tr');
        newMaterialRow.innerHTML = `
        <td>
            <input type="text" class="form-control form-control-sm materialCode" placeholder="Código">
            <!-- Lista de sugestões -->
        
        </td>
        <td>
            <input type="text" class="form-control form-control-sm materialName" placeholder="Nome" readonly>
        </td>
        <td>
            <input type="number" class="form-control form-control-sm" placeholder="Quantidade">
        </td>
        <td class="text-center">
            <button type="button" class="btn btn-outline-danger btn-sm rounded-circle removeMaterialBtn">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

        // Lógica para buscar nome do material
        const materialCodeInput = newMaterialRow.querySelector('.materialCode');
        const materialNameInput = newMaterialRow.querySelector('.materialName');

        // Evento de input para buscar por código ou nome
        materialCodeInput.addEventListener('input', () => {
            const searchTerm = materialCodeInput.value.trim().toLowerCase();  // Valor de busca (código ou nome)

            // Validação dos campos
            const material = listaDeMateriais.find(item =>
                item.id.toString().includes(searchTerm) || item.nome.toLowerCase().includes(searchTerm)
            );

            if (material) {
                materialNameInput.value = material.nome; // Preenche o nome
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

        // Alterar o texto do botão e desativá-lo
        saveBtn.innerHTML = `
 <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
 Salvando...
`;
        saveBtn.disabled = true;

        const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);
        const niveis = [];

        tabelasContainer.querySelectorAll('.card').forEach((card) => {
            const nivelId = card.getAttribute('data-nivel-id'); // Recupera o ID do nível
            const nivelNome = card.querySelector('input').value.trim(); // Recupera o nome do nível

            const materiais = [];
            card.querySelectorAll('.table-bordered tbody tr').forEach((row) => {
                const codigo = row.querySelector('td:nth-child(1) input').value;
                const nome = row.querySelector('td:nth-child(2) input').value;
                const quantidade = row.querySelector('td:nth-child(3) input').value;
                materiais.push({ codigo, nome, quantidade });
            });

            if (nivelNome) {
                // Adiciona o nível com os materiais associados
                niveis.push({
                    nivelId,  // Inclui o ID do nível para atualização, se necessário
                    nivelNome,
                    materiais,
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

                saveBtn.innerHTML = 'Salvar';
                saveBtn.disabled = false;

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
