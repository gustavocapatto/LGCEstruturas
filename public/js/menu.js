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