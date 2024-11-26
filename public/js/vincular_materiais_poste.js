function vincularMateriaisPoste(posteId, posteNome) {
    // Verifica se o modal já existe. Se existir, não cria um novo, mas limpa os dados.
    let modal = document.getElementById(`vincularMateriaisModal_${posteId}`);
    if (modal) {
        // Limpa as tabelas do modal quando ele for reaberto
        const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);
        tabelasContainer.innerHTML = ''; // Limpa todas as tabelas

        // Exibe o modal novamente
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        return;
    }

    // Criação do modal dinamicamente
    modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = `vincularMateriaisModal_${posteId}`; // Adicionando o posteId ao ID do modal
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', `vincularMateriaisPosteModalLabel_${posteId}`);

    modal.innerHTML = `
    <div class="modal-dialog modal-dialog-start modal-dialog-scrollable w-100 mw-100 mx-auto p-3">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="vincularMateriaisPosteModalLabel_${posteId}">
                    ${posteNome} - ID: ${posteId}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <!-- Container para as tabelas -->
                <div id="tabelasContainer_${posteId}">
                    <!-- As tabelas serão inseridas aqui -->
                </div>
                <!-- Botão para adicionar nova tabela -->
                <button type="button" class="btn btn-success" id="addTableBtn_${posteId}">Adicionar Nível</button>
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

    // Evento para adicionar nova tabela
    const addTableBtn = document.getElementById(`addTableBtn_${posteId}`);
    addTableBtn.addEventListener('click', () => {
        const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);

        // Criação de uma nova tabela com inputs e botão de remover
        const newTable = document.createElement('div');
        newTable.classList.add('mb-3');
        newTable.innerHTML = `
            <h5>Nível</h5>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="col-6">Nome</th>
                            <th scope="col" class="col-4">Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control" placeholder="Nome do Nível"></td>
                            <td><button type="button" class="btn btn-danger btn-sm removeBtn">Remover</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Evento para remover a tabela
        const removeBtn = newTable.querySelector('.removeBtn');
        removeBtn.addEventListener('click', () => {
            newTable.remove();
        });

        // Adiciona a nova tabela ao container de tabelas
        tabelasContainer.appendChild(newTable);
    });

    // Adiciona evento para limpar as tabelas quando o modal for fechado
    modal.addEventListener('hidden.bs.modal', () => {
        const tabelasContainer = document.getElementById(`tabelasContainer_${posteId}`);
        tabelasContainer.innerHTML = ''; // Limpa as tabelas quando o modal for fechado
    });
}
