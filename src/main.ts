import "./styles/style.scss";

const btnPlay = document.querySelector(".btn-play");

const homeScreen = document.querySelector(".home");
const settingsScreen = document.querySelector(".settings");


function init(){
    btnPlay?.addEventListener('click', goToSettings);
}

function goToSettings(){
    homeScreen?.classList.remove("screen--active");
    settingsScreen?.classList.add("screen--active")
}


init()