// Funções auxiliares para obter data e hora
function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
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
function saveRegisterLocalStorage(register) {
    const registerLocalStorage = getRegisterLocalStorage();
    registerLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
}

function getRegisterLocalStorage() {
    let registers = localStorage.getItem("register");
    return registers ? JSON.parse(registers) : [];
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationContent = document.getElementById("notification-content");
    notificationContent.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Função principal para registrar ponto
function registrarPonto(tipo) {
    const registro = {
        data: getCurrentDate(),
        hora: getCurrentTime(),
        tipo: tipo,
    };
    saveRegisterLocalStorage(registro);
    showNotification(`Ponto de ${tipo} registrado com sucesso!`);
}

// Configuração inicial de data e hora
function atualizarDataHora() {
    document.getElementById("dia-semana").textContent = getWeekDay();
    document.getElementById("dia-mes-ano").textContent = getCurrentDate();
    document.getElementById("hora-min-seg").textContent = getCurrentTime();
}

// Atualiza a data e hora a cada segundo
setInterval(atualizarDataHora, 1000);

// Adiciona eventos aos botões de ponto
document.getElementById("entrada").addEventListener("click", () => registrarPonto("Entrada"));
document.getElementById("saida").addEventListener("click", () => registrarPonto("Saída"));
document.getElementById("intervalo").addEventListener("click", () => registrarPonto("Intervalo"));
document.getElementById("volta-intervalo").addEventListener("click", () => registrarPonto("Volta do Intervalo"));

// Função para configurar a data máxima para o registro no passado
function configurarDataMaxima() {
    const dataInput = document.getElementById("data-registro");
    dataInput.max = getCurrentDate().split('/').reverse().join('-');
}

// Função para registrar ponto no passado
function registrarPontoPassado() {
    const data = document.getElementById("data-registro").value;
    const hora = document.getElementById("hora-registro").value;
    const tipo = document.getElementById("tipo-registro").value;

    if (!data || !hora || !tipo) {
        showNotification("Por favor, preencha todos os campos!");
        return;
    }

    const dataAtual = new Date();
    const dataRegistro = new Date(`${data}T${hora}`);

    if (dataRegistro > dataAtual) {
        showNotification("Não é possível registrar pontos no futuro.");
        return;
    }

    const registro = {
        data: data.split('-').reverse().join('/'),
        hora: hora,
        tipo: tipo,
    };

    saveRegisterLocalStorage(registro);
    showNotification(`Ponto de ${tipo} registrado com sucesso para ${registro.data} às ${registro.hora}!`);
}

// Eventos de inicialização
document.getElementById("registrar-passado").addEventListener("click", registrarPontoPassado);
configurarDataMaxima();

// Função para configurar a data máxima para o registro de justificativa de ausência
function configurarDataMaximaJustificativa() {
    const dataInput = document.getElementById("data-ausencia");
    dataInput.max = getCurrentDate().split('/').reverse().join('-');
}

// Função para registrar justificativa de ausência
function enviarJustificativa() {
    const dataAusencia = document.getElementById("data-ausencia").value;
    const justificativa = document.getElementById("justificativa").value;
    const arquivoInput = document.getElementById("arquivo-justificativa");
    const arquivo = arquivoInput.files[0] ? arquivoInput.files[0].name : null;

    if (!dataAusencia || !justificativa) {
        showNotification("Por favor, preencha a data e a justificativa!");
        return;
    }

    const dataAtual = new Date();
    const dataRegistro = new Date(dataAusencia);

    if (dataRegistro > dataAtual) {
        showNotification("Não é possível justificar uma ausência em uma data futura.");
        return;
    }

    const justificativaObj = {
        dataAusencia: dataAusencia.split('-').reverse().join('/'),
        justificativa: justificativa,
        arquivo: arquivo,
    };

    const justificativas = JSON.parse(localStorage.getItem("justificativas") || "[]");
    justificativas.push(justificativaObj);
    localStorage.setItem("justificativas", JSON.stringify(justificativas));

    showNotification("Justificativa de ausência registrada com sucesso!");
    document.getElementById("justificativa").value = "";
    document.getElementById("data-ausencia").value = "";
    arquivoInput.value = "";
}

// Eventos de inicialização
document.getElementById("enviar-justificativa").addEventListener("click", enviarJustificativa);
configurarDataMaxima();
configurarDataMaximaJustificativa();
