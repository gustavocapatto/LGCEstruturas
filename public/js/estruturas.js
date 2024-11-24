let editingId = null;

function buscarEstruturas() {
  fetch('/estruturas')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('estruturasTableBody');
      tableBody.innerHTML = ''; // Limpar o conteúdo atual da tabela

      if (data.length === 0) {
        // Exibe uma mensagem quando não há dados
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 3;
        emptyCell.classList.add('text-center', 'text-muted', 'py-4');
        emptyCell.textContent = 'Nenhuma estrutura encontrada.';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
      }

      data.forEach(item => {
        const row = document.createElement('tr');

        // Adiciona as células para cada coluna
        row.innerHTML = `
          <td class="text-start">${item.id}</td>
          <td class="text-end">${item.nome}</td>
          <td class="text-end">
          <button class="btn btn-sm btn-outline-warning me-2" onclick="vincularMateriais(${item.id}, '${item.nome}')">
              <i class="bi bi-pencil-square"></i> Vincular Materiais
            </button>
            <button class="btn btn-sm btn-outline-primary me-2" onclick="editarEstrutura(${item.id}, '${item.nome}')">
              <i class="bi bi-pencil-square"></i> Editar
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="showDeleteEstruturaModal(${item.id})">
              <i class="bi bi-trash"></i> Excluir
            </button>
          </td>
        `;

        // Adiciona a linha ao corpo da tabela
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar estruturas:', error);

      // Exibe uma mensagem de erro na tabela
      const tableBody = document.getElementById('estruturasTableBody');
      tableBody.innerHTML = '';
      const errorRow = document.createElement('tr');
      const errorCell = document.createElement('td');
      errorCell.colSpan = 3;
      errorCell.classList.add('text-center', 'text-danger', 'py-4');
      errorCell.textContent = 'Erro ao carregar estruturas. Tente novamente mais tarde.';
      errorRow.appendChild(errorCell);
      tableBody.appendChild(errorRow);
    });
}

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
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              <!-- Linhas da tabela serão inseridas dinamicamente aqui -->
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          <button type="submit" class="btn btn-primary">Salvar</button>
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

    // Adiciona células (ID, Nome, Quantidade)
    row.innerHTML = `
      <td><input type="text" class="form-control" placeholder="ID"></td>
      <td><input type="text" class="form-control" placeholder="Nome"></td>
      <td><input type="number" class="form-control" placeholder="Quantidade"></td>
    `;

    // Adiciona a nova linha à tabela
    tableBody.appendChild(row);
  }

  // Adicionar o evento ao botão de adicionar linha
  document.getElementById('addRowBtn').addEventListener('click', addRow);

  // Exibir o modal
  bootstrapModal.show();
}





function abrirModalAdicionarEstrutura() {
  const addStructureModal = new bootstrap.Modal(document.getElementById('addStructureModal'));
  addStructureModal.show();
}

function adicionarEstrutura() {
  const nameInput = document.getElementById('nomeEstrutura');
  const structureName = nameInput.value.trim();

  if (!structureName) {
    showAlert('O nome da estrutura é obrigatório.', 'danger');
    return;
  }

  // Modificar o botão de salvar para mostrar o loading
  const saveButton = document.querySelector('#addStructureModal .btn-primary');
  saveButton.innerHTML = 'Salvando... <div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
  saveButton.disabled = true;  // Desativa o botão para evitar múltiplos cliques

  // Enviar os dados ao backend
  fetch('/criar_estrutura', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: structureName }),
  })
    .then(response => {
      if (response.ok) {
        showAlert('Estrutura adicionada com sucesso!', 'success');
        nameInput.value = ''; // Limpa o campo de entrada
        const addStructureModal = bootstrap.Modal.getInstance(document.getElementById('addStructureModal'));
        addStructureModal.hide(); // Fecha o modal
        buscarEstruturas(); // Atualiza a tabela
      } else {
        response.json().then(data => {
          showAlert(data.error || 'Erro ao adicionar estrutura.', 'danger');
        });
      }
    })
    .catch(error => {
      console.error('Erro ao adicionar estrutura:', error);
      showAlert('Erro ao adicionar estrutura.', 'danger');
    })
    .finally(() => {
      // Restaura o botão após o processamento
      saveButton.innerHTML = 'Adicionar';  // Restaura o texto original
      saveButton.disabled = false;  // Reativa o botão
    });
}


function editarEstrutura(id, nome) {
  editingId = id; // Salva o ID para uso posterior
  const nomeInput = document.getElementById('editNomeEstrutura');
  nomeInput.value = nome; // Preenche o campo com o nome atual

  // Abre o modal
  const editStructureModal = new bootstrap.Modal(document.getElementById('editStructureModal'));
  editStructureModal.show();
}

function salvarEdicaoEstrutura() {
  const nomeInput = document.getElementById('editNomeEstrutura');
  const novoNome = nomeInput.value.trim();

  if (!novoNome) {
    showAlert('O nome da estrutura é obrigatório.', 'danger');
    return;
  }

  // Modificar o botão de salvar para mostrar o loading
  const saveButton = document.querySelector('#editStructureModal .btn-primary');
  saveButton.innerHTML = 'Salvando... <div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
  saveButton.disabled = true;  // Desativa o botão para evitar múltiplos cliques

  // Enviar os dados ao backend
  fetch('/editar_estrutura', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: editingId, nome: novoNome }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showAlert('Erro ao editar estrutura.', 'danger');
      } else {
        showAlert('Estrutura editada com sucesso!', 'success');
        const editStructureModal = bootstrap.Modal.getInstance(document.getElementById('editStructureModal'));
        editStructureModal.hide(); // Fecha o modal
        buscarEstruturas(); // Atualiza a tabela
      }
    })
    .catch(error => {
      console.error('Erro ao editar estrutura:', error);
      showAlert('Erro ao editar estrutura.', 'danger');
    })
    .finally(() => {
      // Restaura o botão após o processamento
      saveButton.innerHTML = 'Atualizar';  // Restaura o texto original
      saveButton.disabled = false;  // Reativa o botão
    });
}


function showDeleteEstruturaModal(id) {
  // Cria o HTML para o modal
  const modalHTML = `
    <div class="modal fade" id="deleteEstruturaModal" tabindex="-1" aria-labelledby="deleteEstruturaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteEstruturaModalLabel">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir esta estrutura?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteEstruturaBtn">
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona o modal ao corpo do documento
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inicializa o modal com Bootstrap
  const modal = new bootstrap.Modal(document.getElementById('deleteEstruturaModal'));

  // Configura o comportamento do botão de confirmação
  const confirmDeleteEstruturaBtn = document.getElementById('confirmDeleteEstruturaBtn');
  confirmDeleteEstruturaBtn.onclick = function() {
    // Muda o texto e adiciona o ícone de loading
    confirmDeleteEstruturaBtn.innerHTML = 'Deletando... <div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
    confirmDeleteEstruturaBtn.disabled = true;  // Desativa o botão para evitar múltiplos cliques

    // Chama a função de exclusão
    deletarEstrutura(id, modal);

    // Não fecha o modal ainda, aguarda a resposta do servidor
  };

  // Mostra o modal
  modal.show();
}

function deletarEstrutura(id, modal) {
  fetch('/deletar_estrutura', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showAlert('Erro ao excluir estrutura.', 'danger');
      } else {
        showAlert('Estrutura excluída com sucesso!', 'success');
        buscarEstruturas(); // Atualiza a lista
      }
    })
    .catch(error => {
      showAlert('Erro ao excluir estrutura.', error, 'danger');
    })
    .finally(() => {
      // Restaura o botão após o processamento
      modal.hide();  // Fecha o modal
      document.getElementById('deleteEstruturaModal').remove();  // Remove o modal do DOM
    });
}
