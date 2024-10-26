// Função para obter registros do localStorage
function getRegisterLocalStorage() {
    const registers = localStorage.getItem("register");
    return registers ? JSON.parse(registers) : [];
}

// Função para salvar registros no localStorage
function saveRegisterLocalStorage(registers) {
    localStorage.setItem("register", JSON.stringify(registers));
}

// Função para exibir notificações
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationContent = document.getElementById("notification-content");
    notificationContent.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Função para obter justificativas do localStorage
function getJustificativasLocalStorage() {
    const justificativas = localStorage.getItem("justificativas");
    return justificativas ? JSON.parse(justificativas) : [];
}

// Função para agrupar registros por data
function groupRecordsByDate(records) {
    return records.reduce((grouped, record) => {
        const date = record.data;
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(record);
        return grouped;
    }, {});
}

// Função para filtrar registros por período
function filterRecordsByPeriod(records, period) {
    const now = new Date();
    let filteredRecords = records;
    if (period === 'last-week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        filteredRecords = records.filter(record => {
            const recordDate = parseDate(record.data);
            return recordDate >= oneWeekAgo && recordDate <= now;
        });
    } else if (period === 'last-month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filteredRecords = records.filter(record => {
            const recordDate = parseDate(record.data);
            return recordDate >= oneMonthAgo && recordDate <= now;
        });
    }
    return filteredRecords;
}

// Função para converter data no formato "dd/mm/aaaa" em objeto Date
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

// Função para renderizar os registros na página
function renderRecords() {
    const filterPeriod = document.getElementById("filter-period").value;
    let records = getRegisterLocalStorage();
    records = filterRecordsByPeriod(records, filterPeriod);
    const groupedRecords = groupRecordsByDate(records);

    const reportContainer = document.getElementById("report-container");
    reportContainer.innerHTML = '';

    if (Object.keys(groupedRecords).length === 0) {
        reportContainer.innerHTML = '<p>Nenhum registro encontrado para o período selecionado.</p>';
        return;
    }

    for (const date in groupedRecords) {
        const dateSection = document.createElement('div');
        dateSection.className = 'date-section';

        const dateTitle = document.createElement('h2');
        dateTitle.textContent = date;
        dateSection.appendChild(dateTitle);

        const recordsList = document.createElement('table');
        recordsList.className = 'records-table';

        const tableHeader = document.createElement('tr');
        tableHeader.innerHTML = `
            <th>Hora</th>
            <th>Tipo</th>
            <th>Observação</th>
            <th>Ações</th>
        `;
        recordsList.appendChild(tableHeader);

        groupedRecords[date].forEach((record, index) => {
            const recordRow = document.createElement('tr');

            const horaCell = document.createElement('td');
            horaCell.textContent = record.hora;
            recordRow.appendChild(horaCell);

            const tipoCell = document.createElement('td');
            tipoCell.textContent = record.tipo;
            recordRow.appendChild(tipoCell);

            const observacaoCell = document.createElement('td');
            observacaoCell.textContent = record.observacao || '';
            recordRow.appendChild(observacaoCell);

            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => editRecord(date, index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => deleteRecord());

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            recordRow.appendChild(actionsCell);

            recordsList.appendChild(recordRow);
        });

        dateSection.appendChild(recordsList);
        reportContainer.appendChild(dateSection);
    }
}

// Função para renderizar as justificativas na página
function renderJustificativas() {
    const justificativas = getJustificativasLocalStorage();
    const justificativasContainer = document.getElementById("justificativas-container");
    justificativasContainer.innerHTML = '';

    if (justificativas.length === 0) {
        justificativasContainer.innerHTML = '<p>Não há justificativas de ausência registradas.</p>';
        return;
    }

    justificativas.forEach((justificativa, index) => {
        const justificativaDiv = document.createElement('div');
        justificativaDiv.className = 'justificativa-item';

        const dataP = document.createElement('p');
        dataP.innerHTML = `<strong>Data da Ausência:</strong> ${justificativa.dataAusencia}`;
        justificativaDiv.appendChild(dataP);

        const descricaoP = document.createElement('p');
        descricaoP.innerHTML = `<strong>Justificativa:</strong> ${justificativa.justificativa}`;
        justificativaDiv.appendChild(descricaoP);

        if (justificativa.arquivo) {
            const arquivoP = document.createElement('p');
            arquivoP.innerHTML = `<strong>Arquivo Anexado:</strong> ${justificativa.arquivo}`;
            justificativaDiv.appendChild(arquivoP);
        }

        justificativasContainer.appendChild(justificativaDiv);
    });
}

// Função para editar um registro
function editRecord(date, index) {
    const records = getRegisterLocalStorage();
    const recordsOnDate = records.filter(record => record.data === date);
    const recordToEdit = recordsOnDate[index];

    if (recordToEdit) {
        const newHora = prompt('Editar Hora (HH:MM:SS):', recordToEdit.hora);
        if (newHora !== null && newHora !== '') {
            recordToEdit.hora = newHora;
            const newTipo = prompt('Editar Tipo:', recordToEdit.tipo);
            if (newTipo !== null && newTipo !== '') {
                recordToEdit.tipo = newTipo;
                const newObservacao = prompt('Editar Observação:', recordToEdit.observacao || '');
                if (newObservacao !== null) {
                    recordToEdit.observacao = newObservacao;
                    // Atualiza o registro no array original
                    const recordIndex = records.findIndex(r => r === recordToEdit);
                    records[recordIndex] = recordToEdit;
                    saveRegisterLocalStorage(records);
                    showNotification('Registro editado com sucesso!');
                    renderRecords();
                }
            }
        }
    } else {
        showNotification('Registro não encontrado.');
    }
}

// Função para lidar com o botão de exclusão (apenas exibir alerta)
function deleteRecord() {
    showNotification('O ponto não pode ser excluído.');
}

// Função de inicialização
function initialize() {
    renderRecords();
    renderJustificativas();
    document.getElementById("filter-period").addEventListener('change', renderRecords);

    // Evento para o botão "Voltar"
    document.getElementById("voltar").addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

initialize();
