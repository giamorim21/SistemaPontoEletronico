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
function saveRegisterLocalStorage(register) {
    const registerLocalStorage = getRegisterLocalStorage();
    registerLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
}

function getRegisterLocalStorage() {
    const registers = localStorage.getItem("register");
    return registers ? JSON.parse(registers) : [];
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

// Função principal para registrar ponto com geolocalização
function registrarPonto(tipo) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const registro = {
                    data: getCurrentDate(),
                    hora: getCurrentTime(),
                    tipo: tipo,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                saveRegisterLocalStorage(registro);
                showNotification(`Ponto de ${tipo} registrado com sucesso!`);
            },
            error => {
                showNotification("Erro ao obter localização. Permita o acesso para registrar o ponto.");
            }
        );
    } else {
        showNotification("Geolocalização não é suportada pelo navegador.");
    }
}

// Função para configurar a exibição da data e hora atuais
function atualizarDataHora() {
    document.getElementById("dia-semana").textContent = getWeekDay();
    document.getElementById("dia-mes-ano").textContent = getCurrentDate();
    document.getElementById("hora-min-seg").textContent = getCurrentTime();
}

// Configura a data máxima para registros no passado
function configurarDataMaxima(inputId) {
    const dataInput = document.getElementById(inputId);
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
        tipo: tipo
    };

    saveRegisterLocalStorage(registro);
    showNotification(`Ponto de ${tipo} registrado com sucesso para ${registro.data} às ${registro.hora}!`);
}

// Função para enviar justificativa de ausência
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
        arquivo: arquivo
    };

    const justificativas = JSON.parse(localStorage.getItem("justificativas") || "[]");
    justificativas.push(justificativaObj);
    localStorage.setItem("justificativas", JSON.stringify(justificativas));

    showNotification("Justificativa de ausência registrada com sucesso!");
    document.getElementById("justificativa").value = "";
    document.getElementById("data-ausencia").value = "";
    arquivoInput.value = "";
}

// Função para buscar registro para adicionar observação
function buscarRegistro() {
    const dataObservacao = document.getElementById("data-observacao").value;
    const tipoObservacao = document.getElementById("tipo-observacao").value;

    if (!dataObservacao) {
        showNotification("Por favor, selecione uma data.");
        return;
    }

    const registros = getRegisterLocalStorage();
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
        showNotification("Por favor, adicione uma observação.");
        return;
    }

    const registros = getRegisterLocalStorage();
    const registroIndex = registros.findIndex(reg => reg.data === dataObservacao.split('-').reverse().join('/') && reg.tipo === tipoObservacao);

    if (registroIndex !== -1) {
        registros[registroIndex].observacao = observacao;
        localStorage.setItem("register", JSON.stringify(registros));
        showNotification("Observação adicionada com sucesso!");
        document.getElementById("observacao").value = "";
        document.getElementById("detalhes-registro").style.display = "none";
    } else {
        showNotification("Erro ao salvar a observação. Registro não encontrado.");
    }
}

// Inicialização e eventos de interface
function inicializarApp() {
    atualizarDataHora();
    setInterval(atualizarDataHora, 1000);
    configurarDataMaxima("data-registro");
    configurarDataMaxima("data-ausencia");
    configurarDataMaxima("data-observacao");

    document.getElementById("entrada").addEventListener("click", () => registrarPonto("Entrada"));
    document.getElementById("saida").addEventListener("click", () => registrarPonto("Saída"));
    document.getElementById("intervalo").addEventListener("click", () => registrarPonto("Intervalo"));
    document.getElementById("volta-intervalo").addEventListener("click", () => registrarPonto("Volta do Intervalo"));
    document.getElementById("registrar-passado").addEventListener("click", registrarPontoPassado);
    document.getElementById("enviar-justificativa").addEventListener("click", enviarJustificativa);
    document.getElementById("buscar-registro").addEventListener("click", buscarRegistro);
    document.getElementById("salvar-observacao").addEventListener("click", salvarObservacao);
}

inicializarApp();
