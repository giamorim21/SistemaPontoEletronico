// Funções auxiliares para obter data e hora
function getWeekDay() {
    const date = new Date();
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getCurrentTime() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Funções para manipular localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationContent = document.getElementById("notification-content");
    notificationContent.textContent = message;
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
}

// Função principal para registrar ponto
function registrarPonto(tipo) {
    const registro = {
        data: getCurrentDate(),
        hora: getCurrentTime(),
        tipo: tipo,
    };
    const registros = getFromLocalStorage("register");
    registros.push(registro);
    saveToLocalStorage("register", registros);
    showNotification(`Ponto de ${tipo} registrado com sucesso!`);
}

// Configuração inicial de data e hora
function atualizarDataHora() {
    document.getElementById("dia-semana").textContent = getWeekDay();
    document.getElementById("dia-mes-ano").textContent = getCurrentDate();
    document.getElementById("hora-min-seg").textContent = getCurrentTime();
}

// Configura data máxima para campos de entrada
function configurarDataMaxima(elementId) {
    const inputElement = document.getElementById(elementId);
    inputElement.max = getCurrentDate().split('/').reverse().join('-');
}

// Função para registrar ponto no passado
function registrarPontoPassado() {
    const data = document.getElementById("data-registro").value;
    const hora = document.getElementById("hora-registro").value;
    const tipo = document.getElementById("tipo-registro").value;

    if (!data || !hora || !tipo) {
        return showNotification("Por favor, preencha todos os campos!");
    }

    const dataRegistro = new Date(`${data}T${hora}`);
    if (dataRegistro > new Date()) {
        return showNotification("Não é possível registrar pontos no futuro.");
    }

    const registro = {
        data: data.split('-').reverse().join('/'),
        hora: hora,
        tipo: tipo,
    };

    const registros = getFromLocalStorage("register");
    registros.push(registro);
    saveToLocalStorage("register", registros);
    showNotification(`Ponto de ${tipo} registrado com sucesso para ${registro.data} às ${registro.hora}!`);
}

// Função para registrar justificativa de ausência
function enviarJustificativa() {
    const dataAusencia = document.getElementById("data-ausencia").value;
    const justificativa = document.getElementById("justificativa").value;
    const arquivo = document.getElementById("arquivo-justificativa").files[0]?.name || null;

    if (!dataAusencia || !justificativa) {
        return showNotification("Por favor, preencha a data e a justificativa!");
    }

    if (new Date(dataAusencia) > new Date()) {
        return showNotification("Não é possível justificar uma ausência em uma data futura.");
    }

    const justificativas = getFromLocalStorage("justificativas");
    justificativas.push({
        dataAusencia: dataAusencia.split('-').reverse().join('/'),
        justificativa: justificativa,
        arquivo: arquivo,
    });
    saveToLocalStorage("justificativas", justificativas);
    showNotification("Justificativa de ausência registrada com sucesso!");
    document.getElementById("justificativa").value = "";
    document.getElementById("data-ausencia").value = "";
    document.getElementById("arquivo-justificativa").value = "";
}

// Função para buscar um registro específico para adicionar observação
function buscarRegistro() {
    const dataObservacao = document.getElementById("data-observacao").value;
    const tipoObservacao = document.getElementById("tipo-observacao").value;

    if (!dataObservacao) {
        return showNotification("Por favor, selecione uma data.");
    }

    const registros = getFromLocalStorage("register");
    const registro = registros.find(reg => reg.data === dataObservacao.split('-').reverse().join('/') && reg.tipo === tipoObservacao);

    if (registro) {
        document.getElementById("detalhes-registro").style.display = "block";
        document.getElementById("registro-info").textContent = `Registro de ${tipoObservacao} em ${registro.data} às ${registro.hora}`;
    } else {
        showNotification("Registro não encontrado para a data e tipo selecionados.");
        document.getElementById("detalhes-registro").style.display = "none";
    }
}

// Função para salvar observação no registro
function salvarObservacao() {
    const dataObservacao = document.getElementById("data-observacao").value;
    const tipoObservacao = document.getElementById("tipo-observacao").value;
    const observacao = document.getElementById("observacao").value;

    if (!observacao) {
        return showNotification("Por favor, adicione uma observação.");
    }

    const registros = getFromLocalStorage("register");
    const registroIndex = registros.findIndex(reg => reg.data === dataObservacao.split('-').reverse().join('/') && reg.tipo === tipoObservacao);

    if (registroIndex !== -1) {
        registros[registroIndex].observacao = observacao;
        saveToLocalStorage("register", registros);
        showNotification("Observação adicionada com sucesso!");
        document.getElementById("observacao").value = "";
        document.getElementById("detalhes-registro").style.display = "none";
    } else {
        showNotification("Erro ao salvar a observação. Registro não encontrado.");
    }
}

// Inicialização de eventos
function inicializarEventos() {
    document.getElementById("entrada").addEventListener("click", () => registrarPonto("Entrada"));
    document.getElementById("saida").addEventListener("click", () => registrarPonto("Saída"));
    document.getElementById("intervalo").addEventListener("click", () => registrarPonto("Intervalo"));
    document.getElementById("volta-intervalo").addEventListener("click", () => registrarPonto("Volta do Intervalo"));

    document.getElementById("registrar-passado").addEventListener("click", registrarPontoPassado);
    document.getElementById("enviar-justificativa").addEventListener("click", enviarJustificativa);
    document.getElementById("buscar-registro").addEventListener("click", buscarRegistro);
    document.getElementById("salvar-observacao").addEventListener("click", salvarObservacao);

    configurarDataMaxima("data-registro");
    configurarDataMaxima("data-ausencia");
    configurarDataMaxima("data-observacao");
}

// Inicia atualização de data e hora e configuração de eventos
setInterval(atualizarDataHora, 1000);
inicializarEventos();
