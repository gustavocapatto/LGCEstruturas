// Função para vincular materiais à estrutura
function vincularMateriais(estruturaId, estruturaNome) {
    
    // Criar o modal
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'vincularMateriaisModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'vincularMateriaisModalLabel');
    modal.setAttribute('aria-hidden', 'true');

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

                <!-- Tabela de Materiais -->
                <table class="table" id="materiaisTable">
                    <thead>
                        <tr>
                            <th scope="col" class="col-2">ID</th> <!-- Coluna ID menor -->
                            <th scope="col" class="col-6">Nome</th> <!-- Coluna Nome maior -->
                            <th scope="col" class="col-2">Quantidade</th> <!-- Coluna Quantidade menor -->
                            <th scope="col" class="col-2">Ação</th> <!-- Coluna para remover -->
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
            <td><button type="button" class="btn btn-danger removeRowBtn">Remover</button></td>
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

    // Evento para adicionar uma nova linha ao pressionar Enter
    document.getElementById('materiaisTable').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Impede o envio do formulário (se houver)
            event.preventDefault();
            // Adiciona uma nova linha
            addRow();
        }
    });

// Função para salvar e exibir os dados
document.getElementById('saveBtn').addEventListener('click', function() {
    const tableRows = document.querySelectorAll('#materiaisTable tbody tr');
    let materiaisSelecionados = [];
    let materiaisInexistentes = [];

    // Coletar todos os materiais e quantidades da tabela
    tableRows.forEach(row => {
        const idMaterial = row.querySelector('.material-id').value.trim();
        const quantidade = row.querySelector('.material-quantity').value.trim();
        const nomeMaterial = row.querySelector('.material-name').value.trim();

        // Verifica se o material existe
        if (idMaterial && quantidade) {
            // Se o material não foi encontrado (o nome está 'Material inexistente')
            if (nomeMaterial === 'Material inexistente') {
                materiaisInexistentes.push(idMaterial); // Armazena o ID do material inexistente
            } else {
                materiaisSelecionados.push({ id: idMaterial, quantidade: quantidade });
            }
        }
    });

    // Se houver materiais inexistentes, exibe um alerta e impede o salvamento
    if (materiaisInexistentes.length > 0) {
        alert(`Não foi possível salvar. Os seguintes materiais não foram encontrados: ${materiaisInexistentes.join(', ')}`);
        return; // Interrompe o salvamento
    }

    // Exibir os dados selecionados se tudo estiver correto
    alert(`Estrutura ID: ${estruturaId} - Nome: ${estruturaNome}\n\nMateriais Vinculados:\n` +
          materiaisSelecionados.map(material => `ID: ${material.id}, Quantidade: ${material.quantidade}`).join('\n'));

    // Enviar os dados para o servidor
    fetch('/salvar_materiais_estrutura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            estruturaId: estruturaId,
            materiais: materiaisSelecionados
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Materiais vinculados com sucesso!');
            // Fechar o modal ou fazer outras ações após o sucesso
        } else {
            alert('Erro ao vincular materiais. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao salvar os materiais:', error);
        alert('Erro ao salvar os materiais. Tente novamente.');
    });
});



    // Exibir o modal
    bootstrapModal.show();
}
