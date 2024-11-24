// Função para vincular materiais à estrutura
function vincularMateriais(estruturaId, estruturaNome) {
    // Remover o modal existente, caso já exista
    const existingModal = document.getElementById('vincularMateriaisModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Criar o modal
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'vincularMateriaisModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'vincularMateriaisModalLabel');

    // Estrutura HTML do modal
    modal.innerHTML = `
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="vincularMateriaisModalLabel">Vincular Materiais à Estrutura: ${estruturaNome}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <!-- Botão para adicionar nova linha -->
                <button type="button" class="btn btn-outline-warning" id="addRowBtn">Adicionar Linha</button>

                <!-- Spinner de carregamento -->
                <div id="loadingSpinner" class="d-flex justify-content-center my-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>

                <!-- Tabela de Materiais -->
                <table class="table" id="materiaisTable" style="display: none;">
                    <thead>
                        <tr>
                            <th scope="col" class="col-2">ID</th>
                            <th scope="col" class="col-6">Nome</th>
                            <th scope="col" class="col-2">Quant.</th>
                            <th scope="col" class="col-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Linhas da tabela serão inseridas dinamicamente aqui -->
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" id="saveBtn">Salvar</button>
            </div>
        </div>
    </div>
    `;

    // Adicionar o modal ao corpo da página
    document.body.appendChild(modal);

    // Inicializar o modal do Bootstrap
    const bootstrapModal = new bootstrap.Modal(modal);

    // Função para adicionar uma nova linha na tabela
    function addRow() {
        const tableBody = document.querySelector('#materiaisTable tbody');

        // Criação de uma nova linha
        const row = document.createElement('tr');

        // Adiciona células (ID, Nome, Quantidade, Ação)
        row.innerHTML = `
    <td><input type="text" class="form-control material-id" placeholder="ID"></td>
    <td><input type="text" class="form-control material-name" placeholder="Nome" readonly></td>
    <td><input type="number" class="form-control material-quantity" placeholder="Quantidade"></td>
    <td>
        <button type="button" class="btn btn-outline-danger btn-sm removeRowBtn" title="Remover">
            <i class="bi bi-trash"></i> <!-- Ícone de lixeira -->
        </button>
    </td>
`;


        // Adiciona a nova linha à tabela
        tableBody.appendChild(row);

        // Focar no campo ID da nova linha
        const idInput = row.querySelector('.material-id');
        idInput.focus();

        // Adiciona evento de input para buscar o nome do material pelo ID
        const nameInput = row.querySelector('.material-name');
        const quantityInput = row.querySelector('.material-quantity');

        // Evento de input no campo de ID
        idInput.addEventListener('input', function() {
            const idValue = idInput.value.trim();

            if (idValue) {
                // Buscar o material pelo ID na lista
                const material = listaDeMateriais.find(mat => mat.id == idValue); // Ajuste conforme a estrutura do seu material

                if (material) {
                    // Preenche o campo nome com o nome do material encontrado
                    nameInput.value = material.nome; // Ajuste conforme o nome do material
                    idInput.classList.remove('is-invalid'); // Remove borda vermelha
                    nameInput.classList.remove('is-invalid'); // Remove borda vermelha
                } else {
                    // Se o material não for encontrado
                    nameInput.value = 'Material inexistente';
                    idInput.classList.add('is-invalid'); // Adiciona borda vermelha no ID
                    nameInput.classList.add('is-invalid'); // Adiciona borda vermelha no nome
                }
            } else {
                nameInput.value = ''; // Limpa o nome se o ID estiver vazio
                idInput.classList.remove('is-invalid'); // Remove borda vermelha se o ID estiver vazio
                nameInput.classList.remove('is-invalid'); // Remove borda vermelha no nome se o ID estiver vazio
            }
        });

        // Evento de input no campo de Quantidade
        quantityInput.addEventListener('input', function() {
            const quantityValue = quantityInput.value.trim();

            if (!quantityValue || isNaN(quantityValue) || quantityValue <= 0) {
                quantityInput.classList.add('is-invalid'); // Adiciona borda vermelha na quantidade
            } else {
                quantityInput.classList.remove('is-invalid'); // Remove borda vermelha se a quantidade for válida
            }
        });

        // Evento de clique no botão Remover
        const removeButton = row.querySelector('.removeRowBtn');
        removeButton.addEventListener('click', function() {
            row.remove(); // Remove a linha da tabela
        });
    }

    // Adicionar o evento ao botão de adicionar linha
    document.getElementById('addRowBtn').addEventListener('click', addRow);

    // Função para exibir os materiais já existentes na estrutura
    function exibirMateriaisExistentes(materiais) {
        const tableBody = document.querySelector('#materiaisTable tbody');

        materiais.forEach(material => {
            // Criação de uma nova linha
            const row = document.createElement('tr');
            row.innerHTML = `
            <td><input type="text" class="form-control material-id" value="${material.material_id}" readonly></td>
            <td><input type="text" class="form-control material-name" value="${material.material_nome}" readonly></td>
            <td><input type="number" class="form-control material-quantity" value="${material.quantidade}"></td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm removeRowBtn" title="Remover">
                    <i class="bi bi-trash"></i> <!-- Ícone de lixeira -->
                </button>
            </td>
        `;
        
            tableBody.appendChild(row);

            // Evento de clique no botão Remover
            const removeButton = row.querySelector('.removeRowBtn');
            removeButton.addEventListener('click', function() {
                row.remove(); // Remove a linha da tabela
            });
        });
    }

    // Chamar a API para obter os materiais vinculados à estrutura
    fetch(`/buscar_materiais_estrutura`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estruturaId: estruturaId })
    })
    .then(response => response.json())
    .then(data => {
        // Remover o spinner de carregamento
        document.getElementById('loadingSpinner').remove();

        if (data.success) {
            // Exibir os materiais já existentes na tabela
            exibirMateriaisExistentes(data.materiais);
            // Mostrar a tabela
            document.querySelector('#materiaisTable').style.display = 'table';
        } else {
            showAlert('Erro ao buscar materiais.', 'danger');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        showAlert('Erro ao tentar buscar os materiais.', 'danger');
        // Remover o spinner de carregamento
        document.getElementById('loadingSpinner').remove();
    });

// Função para salvar os materiais
function salvarMateriais() {
    const tableBody = document.querySelector('#materiaisTable tbody');
    const materiais = [];
    let materialInexistente = false;  // Variável para verificar se há material inexistente
    const materiaisIds = {};  // Para armazenar os IDs e suas quantidades

    // Coletar todos os materiais da tabela
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const idInput = row.querySelector('.material-id');
        const nameInput = row.querySelector('.material-name');
        const quantityInput = row.querySelector('.material-quantity');
        const materialId = idInput.value.trim();
        const quantity = parseFloat(quantityInput.value.trim());

        // Verificar se o material é inexistente
        if (nameInput.value === 'Material inexistente') {
            materialInexistente = true;  // Marcar que existe material inexistente
        }

        // Verificar se o ID já foi adicionado
        if (materialId && quantity && !isNaN(quantity) && quantity > 0 && nameInput.value !== 'Material inexistente') {
            if (materiaisIds[materialId]) {
                // Se o material já existir, somamos a quantidade
                materiaisIds[materialId] += quantity;
            } else {
                // Caso contrário, adicionamos o material à lista
                materiaisIds[materialId] = quantity;
            }
        }
    });

    // Verificar se existe algum material inexistente
    if (materialInexistente) {
        showAlert('Por favor, verifique a lista, existem materiais inexistentes.', 'danger');
        return;  // Impede o envio dos dados
    }

    // Converter o objeto materiaisIds para o formato desejado
    for (const materialId in materiaisIds) {
        materiais.push({
            id: materialId,
            quantidade: materiaisIds[materialId]
        });
    }

    // Alterar o botão para "Salvando..." com o spinner
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;  // Desabilitar o botão enquanto está salvando
    saveBtn.innerHTML = 'Salvando... <div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Carregando...</span></div>';

    // Enviar os materiais para o servidor para salvar ou atualizar
    fetch('/salvar_materiais_estrutura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estruturaId: estruturaId,
            materiais: materiais
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Materiais vinculados com sucesso.', 'success');
            bootstrapModal.hide(); // Fechar o modal
        } else {
            showAlert('Erro ao salvar os materiais', 'danger');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        showAlert('Erro ao tentar salvar os materiais.', 'danger');
    })
    .finally(() => {
        // Restaurar o botão depois de salvar
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Salvar';  // Restaurar o texto do botão
    });
}



    // Adicionar evento de clique no botão de salvar
    document.getElementById('saveBtn').addEventListener('click', salvarMateriais);

    // Exibir o modal
    bootstrapModal.show();
}
