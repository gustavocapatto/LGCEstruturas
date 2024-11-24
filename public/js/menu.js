
// Função para buscar os materiais
function carregarMateriais() {
    // Exibe a mensagem de loading
    showAlert('Carregando materiais...', 'info');
    
    // Exemplo de fetch para buscar materiais de uma API
    fetch('/materiais') // Altere para a URL real da sua API
        .then(response => response.json())
        .then(data => {
            // Salva os materiais na lista
            listaDeMateriais = data;
            console.log('Materiais carregados:', listaDeMateriais);
            
            // Exibe uma mensagem de sucesso
            showAlert('Materiais carregados com sucesso!', 'success');
            
            // Aqui você pode fazer qualquer ação com os materiais, como exibir na tela
        })
        .catch(error => {
            console.error('Erro ao carregar materiais:', error);
            // Exibe uma mensagem de erro
            showAlert('Erro ao carregar materiais', 'danger');
        });
}

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
    carregarMateriais();
    } else if (sectionId === 'materiais') {
        buscarMateriais();
    }
  
    // Fechar o menu hambúrguer quando o item for selecionado no celular
    const menuToggle = document.getElementById('navbarNav'); // Supondo que o menu tenha o ID 'navbarNav'
    if (menuToggle && window.innerWidth <= 768) { // Considera dispositivos móveis com largura menor que 768px
        const collapse = new bootstrap.Collapse(menuToggle, {
            toggle: false // Não ativa o botão de alternância
        });
        collapse.hide(); // Fecha o menu hambúrguer
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
  