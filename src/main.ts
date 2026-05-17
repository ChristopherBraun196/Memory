/// <reference types="vite/client" />
import "./styles/style.scss";
import { vibeTheme, gamingTheme } from "./data";
import { state } from "./state";
import {
  currentPlayerImg,
  playerImages,
  gameScreen,
  gameBoard,
  gameOverScreen,
  gameOverName,
  winnerScreen,
  scoreBlue,
  scoreOrange,
  createGame,
} from "./game";

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

/** Updates preview bar when a single radio input changes. */
function handleRadioChange(radio: HTMLInputElement): void {
  if (radio.name === "theme") {
    selectedThemeSpan.textContent = radio.value;
    themeImg.src = themeImages[radio.value];
  }
  if (radio.name === "player") selectedPlayerSpan.textContent = radio.value;
  if (radio.name === "board-size") selectedSizeSpan.textContent = radio.value;
  checkSettings();
}

/** Listens to radio changes and updates settings preview bar. */
function getSettings(): void {
  const radios = document.querySelectorAll(
    'input[type="radio"]',
  ) as NodeListOf<HTMLInputElement>;
  radios.forEach((radio) => {
    radio.addEventListener("change", () => handleRadioChange(radio));
  });
}

/** Returns true when all three settings have a selection. */
function allSettingsSelected(): boolean {
  return !!(
    document.querySelector('input[name="theme"]:checked') &&
    document.querySelector('input[name="player"]:checked') &&
    document.querySelector('input[name="board-size"]:checked')
  );
}

/** Enables start button when all three settings are selected. */
function checkSettings(): void {
  if (allSettingsSelected()) startBtn.removeAttribute("disabled");
}

/** Attaches hover listeners to a single theme radio label. */
function addThemePreviewListeners(radio: HTMLInputElement): void {
  const label = radio.closest("label");
  label?.addEventListener("mouseenter", () => {
    themeImg.src = themeImages[radio.value];
  });
  label?.addEventListener("mouseleave", () => {
    const checked = document.querySelector(
      'input[name="theme"]:checked',
    ) as HTMLInputElement;
    if (checked) themeImg.src = themeImages[checked.value];
  });
}

/** Shows theme preview image on label hover. */
function previewTheme(): void {
  const themeRadios = document.querySelectorAll(
    'input[name="theme"]',
  ) as NodeListOf<HTMLInputElement>;
  themeRadios.forEach((radio) => addThemePreviewListeners(radio));
}

/** Resets current-player badge to blue at game start. */
function initCurrentPlayerDisplay(): void {
  currentPlayerImg.src = playerImages[state.currentPlayer];
  currentPlayerImg.parentElement?.classList.remove("player--blue", "player--orange");
  currentPlayerImg.parentElement?.classList.add("player--blue");
}

/** Adds theme CSS class to game, game-over and winner screens. */
function applyThemeClasses(theme: string): void {
  const className = `theme--${theme.toLowerCase().replace(" ", "-")}`;
  gameScreen.classList.add(className);
  gameOverScreen.classList.add(className);
  winnerScreen.classList.add(className);
}

/** Sets player icon srcs in score bar and game-over screen. */
function setPlayerImgSrcs(blue: string, orange: string): void {
  const base = import.meta.env.BASE_URL;
  (document.querySelector(".game__player--blue img") as HTMLImageElement).src = base + blue;
  (document.querySelector(".game__player--orange img") as HTMLImageElement).src = base + orange;
  (document.querySelector(".game-over .game__player--blue img") as HTMLImageElement).src = base + blue;
  (document.querySelector(".game-over .game__player--orange img") as HTMLImageElement).src = base + orange;
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
  setPlayerImgSrcs(blue, orange);
  if (isGame)
    currentPlayerImg.src = `${import.meta.env.BASE_URL}images/basic/chess_pawn.svg`;
}

/** Returns the card dataset for the selected theme. */
function getThemeCards(theme: string) {
  return theme === "Code theme" ? vibeTheme : gamingTheme;
}

/** Sets dialog and button texts for Code theme. */
function applyCodeThemeTexts(
  dialogText: HTMLParagraphElement,
  confirmBtn: HTMLButtonElement,
  cancelBtn: HTMLButtonElement,
  gameOverBtn: HTMLButtonElement,
): void {
  dialogText.textContent = "Are you sure you want to quit?";
  confirmBtn.textContent = "Exit game";
  cancelBtn.textContent = "Back to game";
  gameOverBtn.textContent = "Back to start";
}

/** Sets dialog and button texts for Game theme. */
function applyGameThemeTexts(
  dialogText: HTMLParagraphElement,
  confirmBtn: HTMLButtonElement,
  cancelBtn: HTMLButtonElement,
  gameOverBtn: HTMLButtonElement,
): void {
  dialogText.textContent = "Are you sure you want to quit the game?";
  confirmBtn.textContent = "Yes, quit game";
  cancelBtn.textContent = "No, back to game";
  gameOverBtn.textContent = "Home";
}

/** Updates dialog and game-over button texts based on selected theme. */
function checkTheme(selectedTheme: string): void {
  const dialogText = document.querySelector(".dialog__text") as HTMLParagraphElement;
  const confirmBtn = document.querySelector(".dialog__btn--confirm") as HTMLButtonElement;
  const cancelBtn = document.querySelector(".dialog__btn--cancel") as HTMLButtonElement;
  const gameOverBtn = document.querySelector(".game-over__btn") as HTMLButtonElement;
  if (selectedTheme === "Code theme") {
    applyCodeThemeTexts(dialogText, confirmBtn, cancelBtn, gameOverBtn);
  } else {
    applyGameThemeTexts(dialogText, confirmBtn, cancelBtn, gameOverBtn);
  }
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

/** Transitions to game screen and initializes game with selected settings. */
function startGame(): void {
  settingsScreen.classList.remove("screen--active");
  gameScreen.classList.add("screen--active");
  initCurrentPlayerDisplay();
  const selectedSize = (
    document.querySelector(
      'input[name="board-size"]:checked',
    ) as HTMLInputElement
  ).value;
  const cards = gameStartTheme();
  createGame(cards, selectedSize);
}

/** Binds cancel and confirm button listeners for the exit dialog. */
function bindDialogButtons(exitDialog: HTMLElement): void {
  document.querySelector(".dialog__btn--cancel")?.addEventListener("click", () => {
    exitDialog.classList.remove("dialog--active");
  });
  document.querySelector(".dialog__btn--confirm")?.addEventListener("click", () => {
    resetGame();
    exitDialog.classList.remove("dialog--active");
    gameScreen.classList.remove("screen--active");
    settingsScreen.classList.add("screen--active");
  });
}

/** Sets up exit button and dialog confirm/cancel listeners. */
function exitBtnDialog(): void {
  const exitDialog = document.querySelector("#exit-dialog") as HTMLElement;
  const exitBtn = document.querySelector(".game__exit-btn") as HTMLButtonElement;
  exitBtn.addEventListener("click", () => {
    exitDialog.classList.add("dialog--active");
  });
  bindDialogButtons(exitDialog);
}

/** Resets score counters and display to zero. */
function resetScores(): void {
  state.scoreBlueCount = 0;
  state.scoreOrangeCount = 0;
  scoreBlue.textContent = "0";
  scoreOrange.textContent = "0";
}

/** Resets UI elements and radio inputs to initial state. */
function resetUI(): void {
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

/** Resets all game state, scores, board and UI to initial values. */
function resetGame(): void {
  resetScores();
  state.currentPlayer = "blue";
  gameBoard.innerHTML = "";
  resetUI();
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

document.addEventListener("DOMContentLoaded", init);
