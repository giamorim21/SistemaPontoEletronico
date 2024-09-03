const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano"); 
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
const dialogPonto = document.getElementById("dialog-ponto");

btnBaterPonto.addEventListener("click", function() {
    dialogPonto.showModal();
});


const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();
horaMinSeg.textContent = getCurrentTime();

function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentDate() {
    // Alterar a solução para considerar padStart ou slice
    // Considerar formatos diferentes da data, conforme localização
    // 
    const date = new Date();
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
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

setInterval(printCurrentHour, 1000);