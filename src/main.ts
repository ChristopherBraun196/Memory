/// <reference types="vite/client" />
import "./styles/style.scss";
import {
  vibeTheme,
  gamingTheme,
  daTheme,
  foodTheme,
  vibeBackground,
  gameBackground,
  daBackground,
  foodBackground,
} from "./data";

const selectedThemeSpan = document.querySelector(
  "#selected-theme",
) as HTMLSpanElement;
const selectedPlayerSpan = document.querySelector(
  "#selected-player",
) as HTMLSpanElement;
const selectedSizeSpan = document.querySelector(
  "#selected-size",
) as HTMLSpanElement;

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

const gameScreen = document.querySelector(".game") as HTMLElement;
const gameBoard = document.querySelector(".game__board") as HTMLElement;

const homeScreen = document.querySelector(".home") as HTMLElement;
const settingsScreen = document.querySelector(".settings") as HTMLElement;

const scoreBlue = document.querySelector("#score-blue") as HTMLSpanElement;
const scoreOrange = document.querySelector("#score-orange") as HTMLSpanElement;

const currentPlayerSpan = document.querySelector(
  "#current-player",
) as HTMLSpanElement;

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let isLocked = false;

let currentPlayer = "blue";
let scoreBlueCount = 0;
let scoreOrangeCount = 0;

function init(): void {
  const btnPlay = document.querySelector(".btn-play") as HTMLButtonElement;
  btnPlay?.addEventListener("click", goToSettings);
  getSettings();
  previewTheme();
  startBtn.addEventListener("click", startGame);
}

function goToSettings(): void {
  homeScreen?.classList.remove("screen--active");
  settingsScreen?.classList.add("screen--active");
}

function getSettings(): void {
  const radios = document.querySelectorAll(
    'input[type="radio"]',
  ) as NodeListOf<HTMLInputElement>;
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

function startGame(): void {
  settingsScreen.classList.remove("screen--active");
  gameScreen.classList.add("screen--active");
  currentPlayerSpan.textContent = currentPlayer;

  const selectedSize = (
    document.querySelector(
      'input[name="board-size"]:checked',
    ) as HTMLInputElement
  ).value;
  const cards = gameStartTheme();

  createGame(cards, selectedSize);
}

function gameStartTheme() {
  const selectedTheme = (
    document.querySelector('input[name="theme"]:checked') as HTMLInputElement
  ).value;
  gameScreen.classList.add(
    `theme--${selectedTheme.toLowerCase().replace(" ", "-")}`,
  );

  let cards;

  if (selectedTheme === "Code theme") {
    cards = vibeTheme;
  } else if (selectedTheme === "Game theme") {
    cards = gamingTheme;
  } else if (selectedTheme === "DA theme") {
    cards = daTheme;
  } else {
    cards = foodTheme;
  }
  return cards;
}

function createGame(
  cards: { id: number; image: string }[],
  selectedSize: string,
): void {
  /*html*/
  const count = parseInt(selectedSize) / 2;
  const selectedCards = cards.slice(0, count);
  const doubledCards = [...selectedCards, ...selectedCards];

  doubledCards.sort(() => Math.random() - 0.5);
  gameBoard.classList.add(`game__board--${parseInt(selectedSize)}`);

  doubledCards.forEach((card) => {
    const cardElement = document.createElement("button");

    cardElement.classList.add("card", "is-flipped");

    cardElement.dataset.id = String(card.id);
    cardElement.addEventListener("click", () => {
      if (isLocked) return;
      if (cardElement === firstCard) return;
      if (!firstCard) {
        firstCard = cardElement;
        cardElement.classList.remove("is-flipped");
      } else if (!secondCard) {
        secondCard = cardElement;
        cardElement.classList.remove("is-flipped");
        isLocked = true;
        checkMatch(firstCard, secondCard);
      }
    });
    cardElement.innerHTML = `
    <div class="card__inner">
      <div class="card__front"><img src="${card.image}"></div>
      <div class="card__back"></div>
    </div>
`;

    gameBoard.appendChild(cardElement);
  });
}
function checkMatch(first: HTMLElement, second: HTMLElement): void {
  if (first.dataset.id === second.dataset.id) {
    first.setAttribute("disabled", "true");
    second.setAttribute("disabled", "true");
    if (currentPlayer === "blue") {
      scoreBlueCount++;
      scoreBlue.textContent = String(scoreBlueCount);
    } else {
      scoreOrangeCount++;
      scoreOrange.textContent = String(scoreOrangeCount);
    }
    firstCard = null;
    secondCard = null;
    setTimeout(() => {
      isLocked = false;
    }, 1000);
  } else {
    setTimeout(() => {
      first.classList.add("is-flipped");
      second.classList.add("is-flipped");
      firstCard = null;
      secondCard = null;
      isLocked = false;
      currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
      currentPlayerSpan.textContent = currentPlayer;
    }, 500);
  }
}

init();
