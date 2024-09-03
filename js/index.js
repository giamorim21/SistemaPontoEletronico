// Declaração de funções
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

    const locale = navigator.language;

    let formattedDate;
    switch (locale) {
        case 'en-US':
            formattedDate = `${month}/${day}/${year}`;
            break;
        case 'ja-JP':
            formattedDate = `${year}.${month}.${day}`;
            break;
        default:
            formattedDate = `${day}/${month}/${year}`;
    }

    return formattedDate;
}

function getCurrentTime() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentTime();
}

// Referências de elementos DOM
const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano"); 
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
const dialogPonto = document.getElementById("dialog-ponto");

const btnDialogFechar = document.getElementById("btn-dialog-fechar");

const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

// Ouvintes de eventos
btnBaterPonto.addEventListener("click", function() {
    dialogPonto.showModal();
});

btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

// Configuração incial
dialogData.textContent = "Data: " + getCurrentDate();
dialogHora.textContent = "Hora: " + getCurrentTime();

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();
horaMinSeg.textContent = getCurrentTime();

// Inicia o intervalo para atualiza a hoa a cada segundo 
setInterval(printCurrentHour, 1000);