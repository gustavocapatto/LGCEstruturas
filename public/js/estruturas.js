let editingId = null;

function buscarEstruturas() {
  fetch('/estruturas')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('estruturasTableBody');
      tableBody.innerHTML = '';
      data.forEach(item => {
        const row = `
          <tr>
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarEstrutura(${item.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deletarEstrutura(${item.id})">Excluir</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error('Erro ao buscar estruturas:', error);
    });
}

function deletarEstrutura(id) {
  if (confirm('Tem certeza de que deseja excluir esta estrutura?')) {
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
      });
  }
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
    });
}



