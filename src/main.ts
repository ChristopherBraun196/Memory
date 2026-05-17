/// <reference types="vite/client" />
import "./styles/style.scss";
import { vibeTheme, gamingTheme } from "./data";

const currentPlayerImg = document.querySelector(
  "#current-player-img",
) as HTMLImageElement;

const playerImages: Record<string, string> = {
  blue: `${import.meta.env.BASE_URL}images/basic/label_blue.svg`,
  orange: `${import.meta.env.BASE_URL}images/basic/label_orange.svg`,
};

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
};

const gameScreen = document.querySelector(".game") as HTMLElement;
const gameBoard = document.querySelector(".game__board") as HTMLElement;

const homeScreen = document.querySelector(".home") as HTMLElement;
const settingsScreen = document.querySelector(".settings") as HTMLElement;

const scoreBlue = document.querySelector("#score-blue") as HTMLSpanElement;
const scoreOrange = document.querySelector("#score-orange") as HTMLSpanElement;

const gameOverScreen = document.querySelector(".game-over") as HTMLElement;

const gameOverName = document.querySelector(
  "#game-over-name",
) as HTMLHeadingElement;

const winnerScreen = document.querySelector(".winner") as HTMLElement;

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let isLocked = false;

let currentPlayer = "blue";
let scoreBlueCount = 0;
let scoreOrangeCount = 0;

/** Initializes all event listeners on page load. */
function init(): void {
  const btnPlay = document.querySelector(".btn-play") as HTMLButtonElement;
  btnPlay?.addEventListener("click", goToSettings);
  getSettings();
  previewTheme();
  startBtn.addEventListener("click", startGame);
  exitBtnDialog();
  backToStartBtn();
}

/** Switches from home screen to settings screen. */
function goToSettings(): void {
  homeScreen?.classList.remove("screen--active");
  settingsScreen?.classList.add("screen--active");
}

/** Listens to radio changes and updates settings preview bar. */
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

/** Enables start button when all three settings are selected. */
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

/** Shows theme preview image on label hover. */
function previewTheme(): void {
  const themeRadios = document.querySelectorAll(
    'input[name="theme"]',
  ) as NodeListOf<HTMLInputElement>;

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

/** Transitions to game screen and initializes game with selected settings. */
function startGame(): void {
  settingsScreen.classList.remove("screen--active");
  gameScreen.classList.add("screen--active");
  currentPlayerImg.src = playerImages[currentPlayer];
  currentPlayerImg.parentElement?.classList.remove(
    "player--blue",
    "player--orange",
  );
  currentPlayerImg.parentElement?.classList.add("player--blue");
  const selectedSize = (
    document.querySelector(
      'input[name="board-size"]:checked',
    ) as HTMLInputElement
  ).value;
  const cards = gameStartTheme();

  createGame(cards, selectedSize);
}

/** Adds theme CSS class to game, game-over and winner screens. */
function applyThemeClasses(theme: string): void {
  const className = `theme--${theme.toLowerCase().replace(" ", "-")}`;
  gameScreen.classList.add(className);
  gameOverScreen.classList.add(className);
  winnerScreen.classList.add(className);
}

/** Updates player images in score bar and game-over screen based on theme. */
function updatePlayerImages(theme: string): void {
  const isGame = theme === "Game theme";
  const blue = isGame
    ? "images/vibes_theme/chess_blue.png"
    : "images/basic/label_blue.svg";
  const orange = isGame
    ? "images/vibes_theme/chess_orange.png"
    : "images/basic/label_orange.svg";
  const base = import.meta.env.BASE_URL;
  (document.querySelector(".game__player--blue img") as HTMLImageElement).src =
    base + blue;
  (
    document.querySelector(".game__player--orange img") as HTMLImageElement
  ).src = base + orange;
  (
    document.querySelector(
      ".game-over .game__player--blue img",
    ) as HTMLImageElement
  ).src = base + blue;
  (
    document.querySelector(
      ".game-over .game__player--orange img",
    ) as HTMLImageElement
  ).src = base + orange;
  if (isGame) currentPlayerImg.src = `${base}images/basic/chess_pawn.svg`;
}

/** Returns the card dataset for the selected theme. */
function getThemeCards(theme: string) {
  return theme === "Code theme" ? vibeTheme : gamingTheme;
}

/** Applies theme classes, updates images and returns matching card set. */
function gameStartTheme() {
  const selectedTheme = (
    document.querySelector('input[name="theme"]:checked') as HTMLInputElement
  ).value;
  applyThemeClasses(selectedTheme);
  updatePlayerImages(selectedTheme);
  checkTheme(selectedTheme);
  return getThemeCards(selectedTheme);
}

/** Creates a single card button element with flip click handler. */
function createCardElement(card: {
  id: number;
  image: string;
}): HTMLButtonElement {
  const el = document.createElement("button");
  el.classList.add("card", "is-flipped");
  el.dataset.id = String(card.id);
  el.innerHTML = `<div class="card__inner"><div class="card__front"><img src="${card.image}"></div><div class="card__back"></div></div>`;
  el.addEventListener("click", () => {
    if (isLocked || el === firstCard) return;
    if (!firstCard) {
      firstCard = el;
      el.classList.remove("is-flipped");
    } else if (!secondCard) {
      secondCard = el;
      el.classList.remove("is-flipped");
      isLocked = true;
      checkMatch(firstCard, secondCard);
    }
  });
  return el;
}

/** Shuffles cards, sets board grid class and renders all card elements. */
function createGame(
  cards: { id: number; image: string }[],
  selectedSize: string,
): void {
  const count = parseInt(selectedSize) / 2;
  const doubled = [...cards.slice(0, count), ...cards.slice(0, count)].sort(
    () => Math.random() - 0.5,
  );
  gameBoard.classList.add(`game__board--${parseInt(selectedSize)}`);
  doubled.forEach((card) => gameBoard.appendChild(createCardElement(card)));
}

/** Switches current player and updates badge color and image. */
function switchPlayer(): void {
  currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
  currentPlayerImg.parentElement?.classList.remove(
    "player--blue",
    "player--orange",
  );
  currentPlayerImg.parentElement?.classList.add(`player--${currentPlayer}`);
  currentPlayerImg.src = gameScreen.classList.contains("theme--game-theme")
    ? `${import.meta.env.BASE_URL}images/basic/chess_pawn.svg`
    : playerImages[currentPlayer];
}

/** Handles a successful card match — disables cards, updates score. */
function handleMatch(first: HTMLElement, second: HTMLElement): void {
  first.setAttribute("disabled", "true");
  second.setAttribute("disabled", "true");
  if (currentPlayer === "blue") {
    scoreBlueCount++;
    scoreBlue.textContent = String(scoreBlueCount);
  } else {
    scoreOrangeCount++;
    scoreOrange.textContent = String(scoreOrangeCount);
  }
  first.classList.add(`card--matched-${currentPlayer}`);
  second.classList.add(`card--matched-${currentPlayer}`);
  checkGameOver();
  firstCard = null;
  secondCard = null;
  setTimeout(() => {
    isLocked = false;
  }, 1000);
}

/** Flips unmatched cards back and switches to next player. */
function handleNoMatch(first: HTMLElement, second: HTMLElement): void {
  setTimeout(() => {
    first.classList.add("is-flipped");
    second.classList.add("is-flipped");
    firstCard = null;
    secondCard = null;
    isLocked = false;
    switchPlayer();
  }, 500);
}

/** Checks if two flipped cards match and delegates to handler. */
function checkMatch(first: HTMLElement, second: HTMLElement): void {
  if (first.dataset.id === second.dataset.id) handleMatch(first, second);
  else handleNoMatch(first, second);
}

/** Sets up exit button and dialog confirm/cancel listeners. */
function exitBtnDialog() {
  const exitDialog = document.querySelector("#exit-dialog") as HTMLElement;
  const exitBtn = document.querySelector(
    ".game__exit-btn",
  ) as HTMLButtonElement;
  exitBtn.addEventListener("click", () => {
    exitDialog.classList.add("dialog--active");
  });

  document
    .querySelector(".dialog__btn--cancel")
    ?.addEventListener("click", () => {
      exitDialog.classList.remove("dialog--active");
    });
  document
    .querySelector(".dialog__btn--confirm")
    ?.addEventListener("click", () => {
      resetGame();
      exitDialog.classList.remove("dialog--active");
      gameScreen.classList.remove("screen--active");
      settingsScreen.classList.add("screen--active");
    });
}

/** Updates dialog and game-over button texts based on selected theme. */
function checkTheme(selectedTheme: string): void {
  const dialogText = document.querySelector(
    ".dialog__text",
  ) as HTMLParagraphElement;

  const confirmBtn = document.querySelector(
    ".dialog__btn--confirm",
  ) as HTMLButtonElement;
  const cancelBtn = document.querySelector(
    ".dialog__btn--cancel",
  ) as HTMLButtonElement;
  const gameOverBtn = document.querySelector(
    ".game-over__btn",
  ) as HTMLButtonElement;

  if (selectedTheme === "Code theme") {
    dialogText.textContent = "Are you sure you want to quit?"; // so muss es sein!
    confirmBtn.textContent = "Exit game";
    cancelBtn.textContent = "Back to game";
    gameOverBtn.textContent = "Back to start";
  } else {
    dialogText.textContent = "Are you sure you want to quit the game?";
    confirmBtn.textContent = "Yes, quit game";
    cancelBtn.textContent = "No, back to game";
    gameOverBtn.textContent = "Home";
  }
}

/** Sets winner display with label, name, icon and confetti. */
function showWinner(
  player: string,
  winnerImages: Record<string, string>,
): void {
  const gameOverIcon = document.querySelector(
    "#game-over-icon",
  ) as HTMLImageElement;
  const gameOverConfetti = document.querySelector(
    "#game-over-confetti",
  ) as HTMLImageElement;
  gameOverName.textContent =
    player === "blue" ? "Blue Player" : "Orange Player";
  gameOverName.classList.add(`game-over__name--${player}`);
  document.querySelector("#game-over-label")!.textContent = "The winner is";
  gameOverConfetti.style.display = "block";
  gameOverIcon.src = winnerImages[player];
  gameOverIcon.style.filter = "";
}

/** Sets draw display with label, draw icon and pink filter. */
function showDraw(): void {
  const gameOverIcon = document.querySelector(
    "#game-over-icon",
  ) as HTMLImageElement;
  gameOverName.textContent = "DRAW";
  document.querySelector("#game-over-label")!.textContent = "It's a";
  (
    document.querySelector("#game-over-confetti") as HTMLImageElement
  ).style.display = "none";
  gameOverIcon.src = `${import.meta.env.BASE_URL}images/vibes_theme/draw_icon.png`;
  gameOverIcon.style.filter =
    "brightness(0) invert(1) sepia(1) hue-rotate(296deg) saturate(4) brightness(1.1)";
}

/** Transitions from game-over screen to winner screen after 3 seconds. */
function transitionToWinnerScreen(): void {
  gameScreen.classList.remove("screen--active");
  gameOverScreen.classList.add("screen--active");
  setTimeout(() => {
    gameOverScreen.classList.remove("screen--active");
    winnerScreen.classList.add("screen--active");
  }, 3000);
}

/** Checks if all cards are matched and triggers end-game sequence. */
function checkGameOver(): void {
  const allCards = document.querySelectorAll(".card");
  const matched = document.querySelectorAll(".card[disabled]");
  if (allCards.length !== matched.length) return;
  const isGameTheme = gameScreen.classList.contains("theme--game-theme");
  const base = import.meta.env.BASE_URL;
  const winnerImages = {
    blue: isGameTheme
      ? `${base}images/basic/pockal.png`
      : `${base}images/vibes_theme/chess_blue.png`,
    orange: isGameTheme
      ? `${base}images/basic/pockal.png`
      : `${base}images/vibes_theme/chess_orange.png`,
  };
  (document.querySelector("#final-score-blue") as HTMLSpanElement).textContent =
    String(scoreBlueCount);
  (
    document.querySelector("#final-score-orange") as HTMLSpanElement
  ).textContent = String(scoreOrangeCount);
  if (scoreBlueCount > scoreOrangeCount) showWinner("blue", winnerImages);
  else if (scoreOrangeCount > scoreBlueCount)
    showWinner("orange", winnerImages);
  else showDraw();
  transitionToWinnerScreen();
}

/** Binds back-to-start button to reset game and show home screen. */
function backToStartBtn(): void {
  const gameOverBtn = document.querySelector(
    ".game-over__btn",
  ) as HTMLButtonElement;

  gameOverBtn.addEventListener("click", () => {
    resetGame();
    winnerScreen.classList.remove("screen--active");
    homeScreen.classList.add("screen--active");
  });
}

/** Resets all game state, scores, board and UI to initial values. */
function resetGame(): void {
  scoreBlueCount = 0;
  scoreOrangeCount = 0;
  scoreBlue.textContent = "0";
  scoreOrange.textContent = "0";
  currentPlayer = "blue";
  gameBoard.innerHTML = "";
  gameBoard.className = "game__board";
  gameScreen.className = "game screen";
  gameOverScreen.className = "game-over screen";
  winnerScreen.className = "winner screen";
  gameOverName.className = "winner__name";
  startBtn.setAttribute("disabled", "true");
  document
    .querySelectorAll<HTMLInputElement>('input[type="radio"]')
    .forEach((radio) => (radio.checked = false));
  selectedThemeSpan.textContent = "Game theme";
  selectedPlayerSpan.textContent = "Player";
  selectedSizeSpan.textContent = "Board size";
  themeImg.src = `${import.meta.env.BASE_URL}images/vibes_theme/vibe_theme.png`;
}

init();
