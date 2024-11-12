// Funções para obter e salvar registros no localStorage
function getRegisterLocalStorage() {
    const registers = localStorage.getItem("register");
    return registers ? JSON.parse(registers) : [];
}

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

// Função para formatar data e hora
function formatDateTime(date) {
    const diaSemana = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const diaMesAno = date.toLocaleDateString('pt-BR');
    const horaMinSeg = date.toLocaleTimeString('pt-BR');
    return { diaSemana, diaMesAno, horaMinSeg };
}

// Atualizar data e hora na tela
function updateDateTime() {
    const now = new Date();
    const { diaSemana, diaMesAno, horaMinSeg } = formatDateTime(now);
    document.getElementById("dia-semana").textContent = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
    document.getElementById("dia-mes-ano").textContent = diaMesAno;
    document.getElementById("hora-min-seg").textContent = horaMinSeg;
}

// Função para registrar ponto atual
function registrarPonto(tipo) {
    const now = new Date();
    const data = now.toLocaleDateString('pt-BR');
    const hora = now.toLocaleTimeString('pt-BR');
    const registers = getRegisterLocalStorage();
    registers.push({ data, hora, tipo });
    saveRegisterLocalStorage(registers);
    showNotification(`Ponto de ${tipo} registrado com sucesso!`);
}

// Função para registrar ponto no passado
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
    const dataHoraAtual = new Date();

    if (dataHora > dataHoraAtual) {
        showNotification("Não é permitido registrar um ponto no futuro.");
        return;
    }

    const dataFormatada = data.split('-').reverse().join('/');
    const horaFormatada = hora;

    const registers = getRegisterLocalStorage();
    registers.push({ data: dataFormatada, hora: horaFormatada, tipo });
    saveRegisterLocalStorage(registers);
    showNotification("Ponto registrado com sucesso!");
    document.getElementById("form-ponto-passado").reset();
}

// Função para obter justificativas do localStorage
function getJustificativasLocalStorage() {
    const justificativas = localStorage.getItem("justificativas");
    return justificativas ? JSON.parse(justificativas) : [];
}

// Função para salvar a justificativa no localStorage
function salvarJustificativa(dataAusencia, justificativaTexto, nomeArquivo, conteudoArquivo) {
    const justificativas = getJustificativasLocalStorage();
    justificativas.push({
        dataAusencia: formatarDataParaExibicao(dataAusencia),
        justificativa: justificativaTexto,
        nomeArquivo: nomeArquivo,
        conteudoArquivo: conteudoArquivo
    });
    localStorage.setItem("justificativas", JSON.stringify(justificativas));
    showNotification("Justificativa registrada com sucesso!");
    document.getElementById("form-justificativa").reset();
}

// Função para formatar data de "aaaa-mm-dd" para "dd/mm/aaaa"
function formatarDataParaExibicao(dataISO) {
    const [year, month, day] = dataISO.split("-");
    return `${day}/${month}/${year}`;
}

// Função para registrar justificativa de ausência
function registrarJustificativa() {
    const dataAusencia = document.getElementById("data-ausencia").value;
    const justificativaTexto = document.getElementById("justificativa-texto").value;
    const arquivoInput = document.getElementById("arquivo-anexo");
    const arquivo = arquivoInput.files[0];

    if (!dataAusencia || !justificativaTexto) {
        showNotification("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const dataAusenciaDate = new Date(dataAusencia);
    const dataHoraAtual = new Date();

    if (dataAusenciaDate > dataHoraAtual) {
        showNotification("Não é permitido justificar ausência no futuro.");
        return;
    }

    if (arquivo) {
        if (arquivo.size > 2 * 1024 * 1024) { // Limite de 2MB
            showNotification("O arquivo anexado é muito grande. O tamanho máximo permitido é de 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            const arquivoBase64 = event.target.result;
            salvarJustificativa(dataAusencia, justificativaTexto, arquivo.name, arquivoBase64);
        };
        reader.readAsDataURL(arquivo);
    } else {
        salvarJustificativa(dataAusencia, justificativaTexto, null, null);
    }
}

// Função para adicionar observação a um registro existente
function adicionarObservacao(event) {
    event.preventDefault();
    const dataObservacao = document.getElementById("data-observacao").value;
    const horaObservacao = document.getElementById("hora-observacao").value;
    const observacaoTexto = document.getElementById("observacao-texto").value;

    if (!dataObservacao || !horaObservacao || !observacaoTexto) {
        showNotification("Por favor, preencha todos os campos.");
        return;
    }

    const dataFormatada = dataObservacao.split('-').reverse().join('/');
    const horaFormatada = horaObservacao;

    const registers = getRegisterLocalStorage();
    const registroEncontrado = registers.find(registro => registro.data === dataFormatada && registro.hora === horaFormatada);

    if (registroEncontrado) {
        registroEncontrado.observacao = observacaoTexto;
        saveRegisterLocalStorage(registers);
        showNotification("Observação adicionada com sucesso!");
        document.getElementById("form-observacao").reset();
    } else {
        showNotification("Registro não encontrado.");
    }
}

// Função de inicialização
function inicializarApp() {
    // Atualizar data e hora a cada segundo
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Eventos dos botões principais
    document.getElementById("entrada").addEventListener("click", () => registrarPonto("Entrada"));
    document.getElementById("saida").addEventListener("click", () => registrarPonto("Saída"));
    document.getElementById("intervalo").addEventListener("click", () => registrarPonto("Intervalo"));
    document.getElementById("volta-intervalo").addEventListener("click", () => registrarPonto("Volta do Intervalo"));

    // Evento para o formulário de ponto no passado
    document.getElementById("form-ponto-passado").addEventListener("submit", registrarPontoPassado);

    // Evento para o envio da justificativa
    document.getElementById("form-justificativa").addEventListener("submit", function(event) {
        event.preventDefault();
        registrarJustificativa();
    });

    // Evento para o formulário de observação
    document.getElementById("form-observacao").addEventListener("submit", adicionarObservacao);

    // Evento para o botão "Ver Relatório"
    document.getElementById("ver-relatorio").addEventListener("click", () => {
        window.location.href = "relatorio.html";
    });
}

inicializarApp();
