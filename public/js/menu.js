

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
    /*if (sectionId === 'estruturas') {
        buscarEstruturas();
    } else if (sectionId === 'materiais') {
        buscarMateriais();
    }*/

        
    if (sectionId === 'postes' || sectionId === 'montar_lista_materiais') {
        buscarPostes();
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
    // Carrega os materiais assim que a página for carregada
    buscarMateriais();
    buscarEstruturas();
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
