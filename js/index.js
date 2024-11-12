// Funções de registro de ponto
function registrarPonto(tipo) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => salvarPonto(tipo, position),
            () => showNotification("Erro ao obter localização. Permita o acesso para registrar o ponto.")
        );
    } else {
        showNotification("Geolocalização não é suportada pelo navegador.");
    }
}

function salvarPonto(tipo, position) {
    const registro = {
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        tipo,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    
    const registers = getRegisterLocalStorage();
    registers.push(registro);
    saveRegisterLocalStorage(registers);

    showNotification(`Ponto de ${tipo} registrado com sucesso para ${registro.data} às ${registro.hora}!`);
}

// Funções para manipulação do localStorage
function getRegisterLocalStorage() {
    const registers = localStorage.getItem("register");
    return registers ? JSON.parse(registers) : [];
}

function saveRegisterLocalStorage(registers) {
    localStorage.setItem("register", JSON.stringify(registers));
}

// Funções de formatação e exibição de data/hora
function formatDateTime(date) {
    const diaSemana = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const diaMesAno = date.toLocaleDateString('pt-BR');
    const horaMinSeg = date.toLocaleTimeString('pt-BR');
    return { diaSemana, diaMesAno, horaMinSeg };
}

function updateDateTime() {
    const now = new Date();
    const { diaSemana, diaMesAno, horaMinSeg } = formatDateTime(now);
    document.getElementById("dia-semana").textContent = capitalize(diaSemana);
    document.getElementById("dia-mes-ano").textContent = diaMesAno;
    document.getElementById("hora-min-seg").textContent = horaMinSeg;
}

// Funções para o registro de ponto passado
function registrarPontoPassado(event) {
    event.preventDefault();
    const data = document.getElementById("data-ponto").value;
    const hora = document.getElementById("hora-ponto").value;
    const tipo = document.getElementById("tipo-ponto").value;

    if (!data || !hora || !tipo) {
        showNotification("Por favor, preencha todos os campos.");
        return;
    }

    const dataHora = new Date(`${data}T${hora}`);
    if (dataHora > new Date()) {
        showNotification("Não é permitido registrar um ponto no futuro.");
        return;
    }

    salvarPontoManual(data, hora, tipo);
}

function salvarPontoManual(data, hora, tipo) {
    const dataFormatada = data.split('-').reverse().join('/');
    const registers = getRegisterLocalStorage();
    registers.push({ data: dataFormatada, hora, tipo });
    saveRegisterLocalStorage(registers);
    showNotification("Ponto registrado com sucesso!");
    document.getElementById("form-ponto-passado").reset();
}

// Funções para justificativas de ausência
function salvarJustificativa(dataAusencia, justificativaTexto, nomeArquivo, conteudoArquivo) {
    const justificativas = getJustificativasLocalStorage();
    justificativas.push({
        dataAusencia: formatarDataParaExibicao(dataAusencia),
        justificativa: justificativaTexto,
        nomeArquivo,
        conteudoArquivo
    });
    localStorage.setItem("justificativas", JSON.stringify(justificativas));
    showNotification("Justificativa registrada com sucesso!");
    document.getElementById("form-justificativa").reset();
}

function registrarJustificativa() {
    const dataAusencia = document.getElementById("data-ausencia").value;
    const justificativaTexto = document.getElementById("justificativa-texto").value;
    const arquivoInput = document.getElementById("arquivo-anexo").files[0];

    if (!dataAusencia || !justificativaTexto) {
        showNotification("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (new Date(dataAusencia) > new Date()) {
        showNotification("Não é permitido justificar ausência no futuro.");
        return;
    }

    processarArquivoJustificativa(dataAusencia, justificativaTexto, arquivoInput);
}

function processarArquivoJustificativa(dataAusencia, justificativaTexto, arquivo) {
    if (arquivo && arquivo.size > 2 * 1024 * 1024) {
        showNotification("O arquivo anexado é muito grande. O tamanho máximo permitido é de 2MB.");
        return;
    }
    
    if (arquivo) {
        const reader = new FileReader();
        reader.onload = event => salvarJustificativa(dataAusencia, justificativaTexto, arquivo.name, event.target.result);
        reader.readAsDataURL(arquivo);
    } else {
        salvarJustificativa(dataAusencia, justificativaTexto, null, null);
    }
}

// Funções para observação de registro
function buscarRegistro(event) {
    event.preventDefault();
    const dataObservacao = document.getElementById("data-observacao").value;
    const tipoObservacao = document.getElementById("tipo-observacao").value;

    if (!dataObservacao || !tipoObservacao) {
        showNotification("Por favor, preencha todos os campos.");
        return;
    }

    const dataFormatada = dataObservacao.split('-').reverse().join('/');
    const registers = getRegisterLocalStorage();
    const registroEncontrado = registers.find(r => r.data === dataFormatada && r.tipo === tipoObservacao);

    if (registroEncontrado) {
        exibirCampoObservacao(registroEncontrado);
    } else {
        showNotification("Registro não encontrado.");
        document.getElementById("observacao-campo").style.display = "none";
    }
}

function exibirCampoObservacao(registroEncontrado) {
    document.getElementById("observacao-campo").style.display = "block";
    showNotification("Registro encontrado! Adicione a observação abaixo.");
    document.getElementById("salvar-observacao").onclick = () => adicionarObservacao(registroEncontrado);
}

function adicionarObservacao(registro) {
    const observacaoTexto = document.getElementById("observacao-texto").value;
    if (!observacaoTexto) {
        showNotification("Por favor, insira uma observação.");
        return;
    }

    registro.observacao = observacaoTexto;
    const registers = getRegisterLocalStorage();
    const updatedRegisters = registers.map(r => r.data === registro.data && r.tipo === registro.tipo ? registro : r);
    saveRegisterLocalStorage(updatedRegisters);

    showNotification("Observação adicionada com sucesso!");
    document.getElementById("form-buscar-observacao").reset();
    document.getElementById("observacao-campo").style.display = "none";
}

// Funções de notificação e formatação
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationContent = document.getElementById("notification-content");
    notificationContent.textContent = message;
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Inicialização e eventos principais
function inicializarApp() {
    updateDateTime();
    setInterval(updateDateTime, 1000);

    document.getElementById("entrada").addEventListener("click", () => registrarPonto("Entrada"));
    document.getElementById("saida").addEventListener("click", () => registrarPonto("Saída"));
    document.getElementById("intervalo").addEventListener("click", () => registrarPonto("Intervalo"));
    document.getElementById("volta-intervalo").addEventListener("click", () => registrarPonto("Volta do Intervalo"));

    document.getElementById("form-ponto-passado").addEventListener("submit", registrarPontoPassado);
    document.getElementById("form-justificativa").addEventListener("submit", event => {
        event.preventDefault();
        registrarJustificativa();
    });
    document.getElementById("form-buscar-observacao").addEventListener("submit", buscarRegistro);
    document.getElementById("ver-relatorio").addEventListener("click", () => window.location.href = "relatorio.html");
}

inicializarApp();
