const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const diaMesAnoUS = document.getElementById("dia-mes-ano-us"); 
const horaMinSeg = document.getElementById("hora-min-seg");

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();
diaMesAnoUS.textContent = getCurrentDateUS(); 
horaMinSeg.textContent = getCurrentTime();

function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentDate() {
    const date = new Date();
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

function getCurrentDateUS() {
    const date = new Date();
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

function getCurrentTime() {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

setInterval(getCurrentTime, 1000);