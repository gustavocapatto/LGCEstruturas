// Preenche o select com os postes da lista
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
}

// Exemplo: chamar a função para preencher a seleção após carregar os postes
buscarPostes().then(preencherSelecaoPostes).catch((error) => {
  console.error('Erro ao preencher seleção de postes:', error);
});