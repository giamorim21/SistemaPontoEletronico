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
