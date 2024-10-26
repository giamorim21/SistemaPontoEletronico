// No final da função initialize(), adicione:
document.getElementById("voltar").addEventListener("click", () => {
    window.location.href = "../index.html";
});


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

// Função para editar um registro
function editRecord(date, index) {
    const records = getRegisterLocalStorage();
    const filteredRecords = records.filter(record => record.data === date);
    const record = filteredRecords[index];

    if (record) {
        const newHora = prompt('Editar Hora (HH:MM:SS):', record.hora);
        if (newHora !== null && newHora !== '') {
            record.hora = newHora;
            const newTipo = prompt('Editar Tipo:', record.tipo);
            if (newTipo !== null && newTipo !== '') {
                record.tipo = newTipo;
                const newObservacao = prompt('Editar Observação:', record.observacao || '');
                if (newObservacao !== null) {
                    record.observacao = newObservacao;
                    // Atualiza o registro no array original
                    const recordIndex = records.findIndex(r => r === filteredRecords[index]);
                    records[recordIndex] = record;
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
    document.getElementById("filter-period").addEventListener('change', renderRecords);
}

initialize();
