/// <reference types="vite/client" />
import "./styles/style.scss";

const btnPlay = document.querySelector(".btn-play") as HTMLButtonElement;

const homeScreen = document.querySelector(".home") as HTMLElement;
const settingsScreen = document.querySelector(".settings") as HTMLElement;

const selectedThemeSpan = document.querySelector(
  "#selected-theme",
) as HTMLSpanElement;
const selectedPlayerSpan = document.querySelector(
  "#selected-player",
) as HTMLSpanElement;
const selectedSizeSpan = document.querySelector(
  "#selected-size",
) as HTMLSpanElement;

const radios = document.querySelectorAll(
  'input[type="radio"]',
) as NodeListOf<HTMLInputElement>;

const startBtn = document.querySelector(
  ".settings__bar-btn",
) as HTMLButtonElement;

const themeImg = document.querySelector(
  ".settings__bar-img",
) as HTMLImageElement;

const themeImages: Record<string, string> = {
  "Code theme": `${import.meta.env.BASE_URL}images/vibes_theme/vibe_theme.png`,
  "Game theme": `${import.meta.env.BASE_URL}images/game_theme/game_theme.png`,
  "DA theme": `${import.meta.env.BASE_URL}images/da_theme/da_projects_theme.png`,
  "Food theme": `${import.meta.env.BASE_URL}images/food_theme/food_theme.png`,
};

const themeRadios = document.querySelectorAll(
  'input[name="theme"]',
) as NodeListOf<HTMLInputElement>;

function init(): void {
  btnPlay?.addEventListener("click", goToSettings);
  getSettings();
  previewTheme();
}

function goToSettings(): void {
  homeScreen?.classList.remove("screen--active");
  settingsScreen?.classList.add("screen--active");
}

function getSettings(): void {
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.name === "theme") {
        selectedThemeSpan.textContent = radio.value;
        themeImg.src = themeImages[radio.value];
      }
      if (radio.name === "player") {
        selectedPlayerSpan.textContent = radio.value;
      }
      if (radio.name === "board-size") {
        selectedSizeSpan.textContent = radio.value;
      }
      checkSettings();
    });
  });
}

function checkSettings(): void {
  const themeSelected = document.querySelector(
    'input[name="theme"]:checked',
  ) as HTMLInputElement;
  const playerSelected = document.querySelector(
    'input[name="player"]:checked',
  ) as HTMLInputElement;
  const sizeSelected = document.querySelector(
    'input[name="board-size"]:checked',
  ) as HTMLInputElement;

  if (themeSelected && playerSelected && sizeSelected) {
    startBtn.removeAttribute("disabled");
  }
}

function previewTheme(): void {
  themeRadios.forEach((radio) => {
    const label = radio.closest("label");

    label?.addEventListener("mouseenter", () => {
      themeImg.src = themeImages[radio.value];
    });
    label?.addEventListener("mouseleave", () => {
      const checked = document.querySelector(
        'input[name="theme"]:checked',
      ) as HTMLInputElement;
      if (checked) {
        themeImg.src = themeImages[checked.value];
      }
    });
  });
}

init();
