// Função para vincular materiais ao poste
function vincularMateriaisPoste(posteId, posteNome) {
    // Criação do modal dinamicamente
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = `vincularMateriaisModal_${posteId}`; // Adicionando o posteId ao ID do modal
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', `vincularMateriaisPosteModalLabel_${posteId}`);
    modal.setAttribute('aria-hidden', 'true');
  
    modal.innerHTML = `
      <div class="modal-dialog modal-lg" style="max-width: 90%; width: auto;">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="vincularMateriaisPosteModalLabel_${posteId}">
                    ${posteNome}
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body">
                  <!-- Tabela de Materiais -->
                  <table class="table" id="materiaisTable_${posteId}" style="display: none;">
                      <thead>
                          <tr>
                              <th scope="col" class="col-2">ID</th>
                              <th scope="col" class="col-6">Nome</th>
                              <th scope="col" class="col-2">Quant.</th>
                              <th scope="col" class="col-2"></th>
                          </tr>
                      </thead>
                      <tbody>
                          <!-- Linhas da tabela serão inseridas dinamicamente aqui -->
                      </tbody>
                  </table>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                  <button type="button" class="btn btn-primary" id="saveBtn_${posteId}">Salvar</button>
              </div>
          </div>
      </div>
    `;
  
    // Adiciona o modal ao corpo do documento
    document.body.appendChild(modal);
  
    // Inicializa o modal com o Bootstrap
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}
