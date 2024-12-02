// Função para preencher o select com postes
function preencherSelecaoPostes() {
  const selectElement = document.getElementById('selecaoPoste');

  // Limpar o select para evitar duplicatas ao atualizar a lista
  selectElement.innerHTML = '<option value="" disabled selected>Selecione um poste</option>';

  // Iterar sobre a lista de postes e adicionar opções
  listaDePostes.forEach((poste) => {
    const option = document.createElement('option');
    option.value = poste.id; // Assumindo que cada poste possui um ID único
    option.textContent = poste.nome; // Assumindo que cada poste possui um nome
    selectElement.appendChild(option);
  });

  // Adiciona o evento de seleção
  selectElement.addEventListener('change', (event) => {
    const selectedId = event.target.value; // ID do poste selecionado
    const selectedPoste = listaDePostes.find(poste => poste.id == selectedId); // Busca o poste na lista

    if (selectedPoste) {
      console.log(`Código: ${selectedPoste.id}, Nome: ${selectedPoste.nome}, Quantidade: 1`);
    }
  });
}

// Exemplo: chamar a função para preencher a seleção após carregar os postes
buscarPostes().then(preencherSelecaoPostes).catch((error) => {
  console.error('Erro ao preencher seleção de postes:', error);
});
