let listaDePostes = [];

// Função para buscar postes da API
async function buscarPostes() {
  try {
    const response = await fetch('/postes');
    if (!response.ok) throw new Error('Erro ao buscar dados');

    listaDePostes = await response.json();
    renderizarTabelaPostes(); // Renderiza a tabela de postes
  } catch (error) {
    console.error('Erro ao buscar postes:', error);
    showErrorRow('Erro ao carregar postes. Tente novamente mais tarde.', 'postesTableBody');
  }
}

function renderizarTabelaPostes() {
  const tableBody = document.getElementById('postesTableBody');
  tableBody.innerHTML = '';

  if (listaDePostes.length === 0) {
    showErrorRow('Nenhum poste encontrado.', 'postesTableBody');
    return;
  }

  listaDePostes.forEach(poste => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-start">${poste.id}</td>
      <td class="text-end">${poste.nome}</td>
      <td class="text-end">${poste.id_material || 'N/A'}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-warning me-2" onclick="vincularMateriaisPoste(${poste.id}, '${poste.nome}')">
          <i class="bi bi-pencil-square"></i> Vincular Materiais
        </button>
        <button class="btn btn-sm btn-outline-primary me-2" onclick="editarPoste(${poste.id}, '${poste.nome}', '${poste.id_material || ''}')">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirPoste(${poste.id})">
          <i class="bi bi-trash"></i> Excluir
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}


function abrirModalAdicionarPoste() {
  const modalHTML = `
    <div class="modal fade" id="modalAdicionarPoste" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adicionar Poste</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="descricaoPoste" class="form-label">Nome</label>
              <input type="text" id="descricaoPoste" class="form-control" placeholder="Digite o nome do poste">
            </div>
            <div class="mb-3">
              <label for="idMaterialPoste" class="form-label">Código do poste</label>
              <input type="number" id="idMaterialPoste" class="form-control" placeholder="Digite o ID do poste">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button id="btnSalvar" class="btn btn-primary" onclick="adicionarPoste()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  new bootstrap.Modal(document.getElementById('modalAdicionarPoste')).show();
}

async function adicionarPoste() {
  const nome = document.getElementById('descricaoPoste').value.trim();
  const idMaterial = document.getElementById('idMaterialPoste').value.trim();
  const btnSalvar = document.getElementById('btnSalvar');
  const originalText = btnSalvar.innerHTML;

  if (!nome || !idMaterial) {
    showAlert('Todos os campos são obrigatórios!', 'error');
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';

  try {
    const response = await fetch('/criar_poste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, id_material: idMaterial }),
    });
    if (!response.ok) throw new Error('Erro ao adicionar poste');

    showAlert('Poste adicionado com sucesso.', 'success');
    buscarPostes();

    const modalElement = document.getElementById('modalAdicionarPoste');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    modalElement.addEventListener('hidden.bs.modal', () => modalElement.remove());
  } catch (error) {
    console.error('Erro ao adicionar poste:', error);
    showAlert('Erro ao adicionar poste. Tente novamente.', 'error');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerHTML = originalText;
  }
}

  
  
// Função para editar poste
function editarPoste(id, descricao, idMaterial) {
  // Verifica se o modal já existe e remove
  const existingModal = document.getElementById('modalEditarPoste');
  if (existingModal) {
      existingModal.remove();  // Remove o modal anterior
  }

  // Cria o novo modal com o conteúdo atualizado
  const modalHTML = `
    <div class="modal fade" id="modalEditarPoste" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Poste</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="editarDescricaoPoste" class="form-label">Nome</label>
              <input type="text" id="editarDescricaoPoste" class="form-control" value="${descricao}">
            </div>
            <div class="mb-3">
              <label for="editarMaterialPoste" class="form-label">Código do poste</label>
              <input type="text" id="editarMaterialPoste" class="form-control" value="${idMaterial}">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" id="btnSalvarPoste" onclick="salvarPoste(${id})">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona o novo modal ao corpo do documento
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inicializa e exibe o modal
  const modal = new bootstrap.Modal(document.getElementById('modalEditarPoste'));
  modal.show();
}


// Função para salvar alterações do poste
async function salvarPoste(id) {
  const nome = document.getElementById('editarDescricaoPoste').value.trim();
  const idMaterial = document.getElementById('editarMaterialPoste').value.trim();

  if (!nome || !idMaterial) {
    showAlert('Todos os campos são obrigatórios!', 'error');
    return;
  }

  // Altera o texto do botão para indicar que o processo está em andamento
  const btnSalvar = document.getElementById('btnSalvarPoste');
  btnSalvar.disabled = true;
  btnSalvar.innerHTML = 'Salvando... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

  try {
    const response = await fetch(`/editar_poste`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nome, id_material: idMaterial }), // Enviando id, nome e id_material
    });

    if (!response.ok) throw new Error('Erro ao editar poste');

    showAlert('Poste atualizado com sucesso!', 'success');
    buscarPostes(); // Recarrega a lista de postes

    // Fecha o modal completamente
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarPoste'));
    modal.hide(); // Esconde o modal

    document.getElementById('modalEditarPoste').remove(); // Remove o modal do DOM
  } catch (error) {
    console.error('Erro ao editar poste:', error);
    showAlert('Erro ao editar o poste!', 'error');
  } finally {
    // Restaura o botão para seu estado original
    btnSalvar.disabled = false;
    btnSalvar.innerHTML = 'Salvar';
  }
}

  
  

// Função para excluir poste
async function excluirPoste(id) {
    // Cria o HTML para o modal
    const modalHTML = `
      <div class="modal fade" id="deletePosteModal" tabindex="-1" aria-labelledby="deletePosteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deletePosteModalLabel">Confirmar Exclusão</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Tem certeza que deseja excluir este poste?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="confirmDeletePosteBtn">
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
    const modal = new bootstrap.Modal(document.getElementById('deletePosteModal'));
  
    // Configura o comportamento do botão de confirmação
    const confirmDeletePosteBtn = document.getElementById('confirmDeletePosteBtn');
    confirmDeletePosteBtn.onclick = function() {
      // Muda o texto e adiciona o ícone de loading
      confirmDeletePosteBtn.innerHTML = 'Deletando... <div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
      confirmDeletePosteBtn.disabled = true;  // Desativa o botão para evitar múltiplos cliques
  
      // Chama a função de exclusão
      deletarPoste(id, modal);
  
      // Não fecha o modal ainda, aguarda a resposta do servidor
    };
  
    // Mostra o modal
    modal.show();
  }
  
  function deletarPoste(id, modal) {
    fetch('/deletar_poste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showAlert('Erro ao excluir poste.', 'danger');
      } else {
        showAlert('Poste excluído com sucesso!', 'success');
        buscarPostes(); // Atualiza a lista de postes
      }
    })
    .catch(error => {
      showAlert('Erro ao excluir poste.', error, 'danger');
    })
    .finally(() => {
      // Restaura o botão após o processamento
      modal.hide();  // Fecha o modal
      document.getElementById('deletePosteModal').remove();  // Remove o modal do DOM
    });
  }
  
  

  function showErrorRow(message, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">${message}</td>
      </tr>`;
  }
  