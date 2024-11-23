let editingId = null;

function showSection(sectionId, menuItem) {
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.add('d-none');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  document.getElementById(sectionId).classList.remove('d-none');

  menuItem.classList.add('active');


  if (sectionId === 'estruturas') {
    buscarEstruturas();
  }
}

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

function adicionarEstrutura() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Adicionar Estrutura';
  document.getElementById('nome').value = '';
  const modal = new bootstrap.Modal(document.getElementById('estruturaModal'));
  modal.show();
}

function editarEstrutura(id) {
  fetch(`/atualizar_estrutura/${id}`)
    .then(response => response.json())
    .then(data => {
      editingId = data.id;
      document.getElementById('modalTitle').textContent = 'Editar Estrutura';
      document.getElementById('nome').value = data.nome;
      const modal = new bootstrap.Modal(document.getElementById('estruturaModal'));
      modal.show();
    })
    .catch(error => {
      console.error('Erro ao buscar estrutura:', error);
    });
}

function salvarEstrutura() {
  const nome = document.getElementById('nome').value;

  if (editingId) {
    fetch(`/criar_estrutura/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    })
    .then(response => response.json())
    .then(data => {
      alert('Estrutura atualizada com sucesso!');
      buscarEstruturas();
      const modal = bootstrap.Modal.getInstance(document.getElementById('estruturaModal'));
      modal.hide();
    })
    .catch(error => {
      console.error('Erro ao editar estrutura:', error);
    });
  } else {
    fetch('/estruturas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    })
    .then(response => response.json())
    .then(data => {
      alert('Estrutura adicionada com sucesso!');
      buscarEstruturas();
      const modal = bootstrap.Modal.getInstance(document.getElementById('estruturaModal'));
      modal.hide();
    })
    .catch(error => {
      console.error('Erro ao adicionar estrutura:', error);
    });
  }
}

function deletarEstrutura(id) {
  if (confirm('Tem certeza de que deseja excluir esta estrutura?')) {
    fetch(`/deletar_estrutura/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      alert('Estrutura excluída com sucesso!');
      buscarEstruturas();
    })
    .catch(error => {
      console.error('Erro ao excluir estrutura:', error);
    });
  }
}