// Define a função showSection
function showSection(sectionId, menuItem) {
  // Oculta todas as seções
  document.querySelectorAll('.content-section').forEach(section => {
      section.classList.add('d-none');
  });

  // Remove a classe 'active' de todos os links
  document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
  });

  // Exibe a seção correspondente
  document.getElementById(sectionId).classList.remove('d-none');

  // Marca o menu atual como ativo
  if (menuItem) {
      menuItem.classList.add('active');
  }

  // Executa ações específicas para cada seção
  if (sectionId === 'estruturas') {
      buscarEstruturas();
  } else if (sectionId === 'materiais') {
      buscarMateriais();
  }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  // Busca o link ativo no menu
  const activeMenuItem = document.querySelector('.nav-link.active');

  if (activeMenuItem) {
      // Determina a seção a partir do atributo onclick no link ativo
      const onclickAttr = activeMenuItem.getAttribute('onclick');
      const sectionIdMatch = onclickAttr.match(/showSection\('(.+?)'/);

      if (sectionIdMatch && sectionIdMatch[1]) {
          const sectionId = sectionIdMatch[1];
          showSection(sectionId, activeMenuItem);
      }
  } else {
      console.warn('Nenhum item ativo encontrado no menu.');
  }
});
