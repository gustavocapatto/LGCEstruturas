function buscarMateriais() {
  fetch('/materiais')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('materiaisTableBody');
      tableBody.innerHTML = ''; // Limpa o conteúdo atual da tabela
      listaDeMateriais = data;
      if (data.length === 0) {
        // Exibe uma mensagem quando não há dados
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4; // Ajustar o colspan para o número de colunas na tabela
        emptyCell.classList.add('text-center', 'text-muted', 'py-4');
        emptyCell.textContent = 'Nenhum material encontrado.';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
      }

      data.forEach(item => {
        const row = document.createElement('tr');

        // Adiciona as células para cada coluna
        row.innerHTML = `
            <td class="text-start">${item.id}</td>
            <td class="text-start">${item.nome}</td>
            <td class="text-start">${item.unidade_de_medida}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-primary me-2" onclick="editarMaterial(${item.id}, '${item.nome}', '${item.unidade_de_medida}')">
                <i class="bi bi-pencil-square"></i> Editar
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="showDeleteModal(${item.id})">
                <i class="bi bi-trash"></i> Excluir
              </button>
            </td>
          `;

        // Adiciona a linha ao corpo da tabela
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar materiais:', error);

      // Exibe uma mensagem de erro na tabela
      const tableBody = document.getElementById('materiaisTableBody');
      tableBody.innerHTML = '';
      const errorRow = document.createElement('tr');
      const errorCell = document.createElement('td');
      errorCell.colSpan = 4; // Ajustar o colspan para o número de colunas na tabela
      errorCell.classList.add('text-center', 'text-danger', 'py-4');
      errorCell.textContent = 'Erro ao carregar materiais. Tente novamente mais tarde.';
      errorRow.appendChild(errorCell);
      tableBody.appendChild(errorRow);
    });
}

function abrirModalAdicionarMaterial() {
  const modalHTML = `
      <div class="modal fade" id="modalAdicionarMaterial" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Adicionar Material</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <form id="formAdicionarMaterial">
                <div class="mb-3">
                  <label for="nomeMaterial" class="form-label">Nome do Material</label>
                  <input type="text" class="form-control" id="nomeMaterial" placeholder="Digite o nome do material" required>
                </div>
                <div class="mb-3">
                  <label class="form-label d-block">Unidade de Medida</label>
                  <div class="d-flex align-items-center gap-3">
                    <div class="form-check form-check-inline">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="unidadeMedida" 
                        id="unidadeKG" 
                        value="KG" 
                        required
                      >
                      <label class="form-check-label" for="unidadeKG">KG</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="unidadeMedida" 
                        id="unidadeUNI" 
                        value="UNI"
                      >
                      <label class="form-check-label" for="unidadeUNI">UNI</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="unidadeMedida" 
                        id="unidadePC" 
                        value="PÇ"
                      >
                      <label class="form-check-label" for="unidadePC">PÇ</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSalvarMaterial" onclick="adicionarMaterial()">Adicionar</button>
            </div>
          </div>
        </div>
      </div>
    `;

  // Adicionar o modal ao DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inicializar e abrir o modal
  const modal = new bootstrap.Modal(document.getElementById('modalAdicionarMaterial'));
  modal.show();

  // Remover o modal do DOM quando for fechado
  document.getElementById('modalAdicionarMaterial').addEventListener('hidden.bs.modal', () => {
    document.getElementById('modalAdicionarMaterial').remove();
  });
}

async function adicionarMaterial() {
  // Desabilitar o botão e mostrar o estado de loading
  const btnSalvar = document.getElementById('btnSalvarMaterial');
  btnSalvar.disabled = true;
  btnSalvar.innerHTML = 'Carregando...';

  // Obter valores do formulário
  const nomeMaterial = document.getElementById('nomeMaterial').value.trim();
  const unidadeMedida = document.querySelector('input[name="unidadeMedida"]:checked')?.value;

  // Validações
  if (!nomeMaterial) {
    showAlert('Por favor, preencha o nome do material.', 'danger');
    btnSalvar.disabled = false;
    btnSalvar.innerHTML = 'Adicionar';
    return;
  }

  if (!unidadeMedida) {
    showAlert('Por favor, selecione uma unidade de medida.', 'danger');
    btnSalvar.disabled = false;
    btnSalvar.innerHTML = 'Adicionar';
    return;
  }

  // Dados a serem enviados
  const materialData = {
    nome: nomeMaterial,
    unidade_de_medida: unidadeMedida,
  };

  try {
    // Enviar dados ao servidor
    const response = await fetch('criar_material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });


    const result = await response.json();
    showAlert(`Material salvo com sucesso! ID: ${result.materialId}`, 'success');

    // Fechar o modal
    const modalElement = document.getElementById('modalAdicionarMaterial');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // Verificar resposta do servidor
    if (!response.ok) {
      const errorData = await response.json();
      showAlert(`Erro ao salvar material: ${errorData.error || 'Erro desconhecido'}`, 'danger');
      btnSalvar.disabled = false;
      btnSalvar.innerHTML = 'Adicionar';
      return;
    }


    // Atualizar a lista de materiais (se necessário)
    buscarMateriais();
  } catch (error) {
    showAlert(`Erro ao salvar material: ${error.message}`, 'danger');
  } finally {
    // Restaurar o estado do botão após a requisição
    btnSalvar.disabled = false;
    btnSalvar.innerHTML = 'Adicionar';
  }
}


function editarMaterial(id, nome, unidadeMedida) {
  // Criação do modal para edição
  const modalHTML = `
    <div class="modal fade" id="modalEditarMaterial" tabindex="-1" aria-labelledby="modalEditarLabel" style="display: block;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalEditarLabel">Editar Material</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body">
            <form id="formEditarMaterial">
              <div class="mb-3">
                <label for="editarNomeMaterial" class="form-label">Nome do Material</label>
                <input type="text" class="form-control" id="editarNomeMaterial" value="${nome}" required>
              </div>
              <div class="mb-3">
                <label class="form-label d-block">Unidade de Medida</label>
                <div class="d-flex align-items-center gap-3">
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="editarUnidadeMedida" 
                      id="editarUnidadeKG" 
                      value="KG" 
                      ${unidadeMedida === "KG" ? "checked" : ""}
                      required
                    >
                    <label class="form-check-label" for="editarUnidadeKG">KG</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="editarUnidadeMedida" 
                      id="editarUnidadeUNI" 
                      value="UNI" 
                      ${unidadeMedida === "UNI" ? "checked" : ""}
                    >
                    <label class="form-check-label" for="editarUnidadeUNI">UNI</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="editarUnidadeMedida" 
                      id="editarUnidadePC" 
                      value="PÇ" 
                      ${unidadeMedida === "PÇ" ? "checked" : ""}
                    >
                    <label class="form-check-label" for="editarUnidadePC">PÇ</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" id="btnSalvarMaterial" class="btn btn-primary" onclick="salvarEdicaoMaterial(${id})">Atualizar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adicionar o modal ao DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inicializar e abrir o modal
  const modal = new bootstrap.Modal(document.getElementById('modalEditarMaterial'));
  modal.show();

  // Remover o modal do DOM quando for fechado
  document.getElementById('modalEditarMaterial').addEventListener('hidden.bs.modal', () => {
    document.getElementById('modalEditarMaterial').remove();
  });
}

async function salvarEdicaoMaterial(id) {
  // Desabilitar o botão de salvar e mostrar o loading
  const btnSalvar = document.getElementById('btnSalvarMaterial');
  btnSalvar.innerHTML = 'Salvando... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  btnSalvar.disabled = true;

  // Obter valores do formulário
  const nomeMaterial = document.getElementById('editarNomeMaterial').value.trim();
  const unidadeMedida = document.querySelector('input[name="editarUnidadeMedida"]:checked')?.value;

  // Validações
  if (!nomeMaterial) {
    showAlert(`Por favor, preencha o nome do material.`, 'danger');
    btnSalvar.innerHTML = 'Atualizar';
    btnSalvar.disabled = false;
    return;
  }

  if (!unidadeMedida) {
    showAlert(`Por favor, selecione uma unidade de medida`, 'danger');
    btnSalvar.innerHTML = 'Atualizar';
    btnSalvar.disabled = false;
    return;
  }

  // Dados a serem enviados
  const materialData = {
    id: id,
    nome: nomeMaterial,
    unidade_de_medida: unidadeMedida,
  };

  try {
    // Enviar dados ao servidor
    const response = await fetch(`/editar_material/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });



    showAlert(`Material atualizado`, 'success');

    // Fechar o modal
    const modalElement = document.getElementById('modalEditarMaterial');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // Verificar resposta do servidor
    if (!response.ok) {
      const errorData = await response.json();
      showAlert(`Erro ao editar material: ${errorData.error || 'Erro desconhecido'}`, 'danger');
      btnSalvar.innerHTML = 'Atualizar';
      btnSalvar.disabled = false;
      return;
    }

    // Atualizar a lista de materiais
    buscarMateriais();
  } catch (error) {
    showAlert(`Erro ao editar material: ${error.message}`, 'danger');
  } finally {
    // Reabilitar o botão e normalizar o texto
    btnSalvar.innerHTML = 'Atualizar';
    btnSalvar.disabled = false;
  }
}

function showDeleteModal(id) {
  // Cria o HTML para o modal
  const modalHTML = `
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir este material?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
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
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));

  // Configura o comportamento do botão de confirmação
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  confirmDeleteBtn.onclick = function() {
    // Muda o texto e adiciona o ícone de loading
    confirmDeleteBtn.innerHTML = 'Deletando... <div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
    confirmDeleteBtn.disabled = true;  // Desativa o botão para evitar múltiplos cliques

    // Chama a função de exclusão
    deletarMaterial(id, modal);

    // Não fecha o modal ainda, aguarda a resposta do servidor
  };

  // Mostra o modal
  modal.show();
}

function deletarMaterial(id, modal) {
  fetch('/deletar_material', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Material deletado com sucesso') {
        showAlert(`Material deletado!`, 'success');
        // Recarrega a lista de materiais após a exclusão
        buscarMateriais();
      } else {
        showAlert(`Erro ao excluir material: ${data.error || 'Erro desconhecido'}`, 'danger');
      }
    })
    .catch(error => {
      console.error('Erro ao deletar material:', error);
      showAlert(`Erro ao deletar material: ${error}`, 'danger');
    })
    .finally(() => {
      // Restaura o botão após o processamento
      modal.hide();  // Fecha o modal
      document.getElementById('deleteModal').remove();  // Remove o modal do DOM
    });
}