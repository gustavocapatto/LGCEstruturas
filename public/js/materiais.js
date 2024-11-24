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
              <button class="btn btn-sm btn-outline-danger" onclick="deletarMaterial(${item.id})">
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
  