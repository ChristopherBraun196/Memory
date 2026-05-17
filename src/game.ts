/// <reference types="vite/client" />
import { state } from "./state";

export const currentPlayerImg = document.querySelector(
  "#current-player-img",
) as HTMLImageElement;
export const scoreBlue = document.querySelector(
  "#score-blue",
) as HTMLSpanElement;
export const scoreOrange = document.querySelector(
  "#score-orange",
) as HTMLSpanElement;
export const gameScreen = document.querySelector(".game") as HTMLElement;
export const gameBoard = document.querySelector(".game__board") as HTMLElement;
export const gameOverScreen = document.querySelector(
  ".game-over",
) as HTMLElement;
export const gameOverName = document.querySelector(
  "#game-over-name",
) as HTMLHeadingElement;
export const winnerScreen = document.querySelector(".winner") as HTMLElement;

export const playerImages: Record<string, string> = {
  blue: `${import.meta.env.BASE_URL}images/basic/label_blue.svg`,
  orange: `${import.meta.env.BASE_URL}images/basic/label_orange.svg`,
};

/** Attaches the flip click handler to a card element. */
function addCardClickHandler(el: HTMLButtonElement): void {
  el.addEventListener("click", () => {
    if (state.isLocked || el === state.firstCard) return;
    if (!state.firstCard) {
      state.firstCard = el;
      el.classList.remove("is-flipped");
    } else if (!state.secondCard) {
      state.secondCard = el;
      el.classList.remove("is-flipped");
      state.isLocked = true;
      checkMatch(state.firstCard, state.secondCard);
    }
  });
}

/** Creates a single card button element with flip click handler. */
export function createCardElement(card: {
  id: number;
  image: string;
}): HTMLButtonElement {
  const el = document.createElement("button");
  el.classList.add("card", "is-flipped");
  el.dataset.id = String(card.id);
  el.innerHTML = `<div class="card__inner"><div class="card__front"><img src="${card.image}"></div><div class="card__back"></div></div>`;
  addCardClickHandler(el);
  return el;
}

/** Shuffles cards, sets board grid class and renders all card elements. */
export function createGame(
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
export function switchPlayer(): void {
  state.currentPlayer = state.currentPlayer === "blue" ? "orange" : "blue";
  currentPlayerImg.parentElement?.classList.remove(
    "player--blue",
    "player--orange",
  );
  currentPlayerImg.parentElement?.classList.add(
    `player--${state.currentPlayer}`,
  );
  currentPlayerImg.src = gameScreen.classList.contains("theme--game-theme")
    ? `${import.meta.env.BASE_URL}images/basic/chess_pawn.svg`
    : playerImages[state.currentPlayer];
}

/** Increments and displays the current player's score. */
function updateScore(): void {
  if (state.currentPlayer === "blue") {
    state.scoreBlueCount++;
    scoreBlue.textContent = String(state.scoreBlueCount);
  } else {
    state.scoreOrangeCount++;
    scoreOrange.textContent = String(state.scoreOrangeCount);
  }
}

/** Handles a successful card match — disables cards, updates score. */
function handleMatch(first: HTMLElement, second: HTMLElement): void {
  first.setAttribute("disabled", "true");
  second.setAttribute("disabled", "true");
  updateScore();
  first.classList.add(`card--matched-${state.currentPlayer}`);
  second.classList.add(`card--matched-${state.currentPlayer}`);
  checkGameOver();
  state.firstCard = null;
  state.secondCard = null;
  setTimeout(() => {
    state.isLocked = false;
  }, 1000);
}

/** Flips unmatched cards back and switches to next player. */
function handleNoMatch(first: HTMLElement, second: HTMLElement): void {
  setTimeout(() => {
    first.classList.add("is-flipped");
    second.classList.add("is-flipped");
    state.firstCard = null;
    state.secondCard = null;
    state.isLocked = false;
    switchPlayer();
  }, 500);
}

/** Checks if two flipped cards match and delegates to handler. */
function checkMatch(first: HTMLElement, second: HTMLElement): void {
  if (first.dataset.id === second.dataset.id) handleMatch(first, second);
  else handleNoMatch(first, second);
}

/** Returns the game-over icon and confetti image elements. */
function getGameOverElements(): {
  icon: HTMLImageElement;
  confetti: HTMLImageElement;
} {
  return {
    icon: document.querySelector("#game-over-icon") as HTMLImageElement,
    confetti: document.querySelector("#game-over-confetti") as HTMLImageElement,
  };
}

/** Sets winner display with label, name, icon and confetti. */
function showWinner(
  player: string,
  winnerImages: Record<string, string>,
): void {
  const { icon, confetti } = getGameOverElements();
  gameOverName.textContent =
    player === "blue" ? "Blue Player" : "Orange Player";
  gameOverName.classList.add(`game-over__name--${player}`);
  document.querySelector("#game-over-label")!.textContent = "The winner is";
  confetti.style.display = "block";
  icon.src = winnerImages[player];
  icon.style.filter = "none";
}

/** Sets draw display with label, draw icon and pink filter. */
function showDraw(): void {
  const { icon, confetti } = getGameOverElements();
  gameOverName.textContent = "DRAW";
  document.querySelector("#game-over-label")!.textContent = "It's a";
  confetti.style.display = "none";
  icon.src = `${import.meta.env.BASE_URL}images/vibes_theme/draw_icon.png`;
  icon.style.filter = gameScreen.classList.contains("theme--game-theme")
    ? "brightness(0) saturate(100%) invert(22%) sepia(60%) saturate(5323%) hue-rotate(322deg) brightness(95%) contrast(96%)"
    : "brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(537%) hue-rotate(106deg) brightness(86%) contrast(94%)";
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

/** Builds the winner image map based on current theme. */
function buildWinnerImages(): Record<string, string> {
  const base = import.meta.env.BASE_URL;
  const isGameTheme = gameScreen.classList.contains("theme--game-theme");
  return {
    blue: isGameTheme
      ? `${base}images/basic/pockal.png`
      : `${base}images/vibes_theme/chess_blue.png`,
    orange: isGameTheme
      ? `${base}images/basic/pockal.png`
      : `${base}images/vibes_theme/chess_orange.png`,
  };
}

/** Displays final scores on the game-over screen. */
function setFinalScores(): void {
  (document.querySelector("#final-score-blue") as HTMLSpanElement).textContent =
    String(state.scoreBlueCount);
  (
    document.querySelector("#final-score-orange") as HTMLSpanElement
  ).textContent = String(state.scoreOrangeCount);
}

/** Checks if all cards are matched and triggers end-game sequence. */
export function checkGameOver(): void {
  const allCards = document.querySelectorAll(".card");
  const matched = document.querySelectorAll(".card[disabled]");
  if (allCards.length !== matched.length) return;
  setFinalScores();
  const winnerImages = buildWinnerImages();
  if (state.scoreBlueCount > state.scoreOrangeCount)
    showWinner("blue", winnerImages);
  else if (state.scoreOrangeCount > state.scoreBlueCount)
    showWinner("orange", winnerImages);
  else showDraw();
  transitionToWinnerScreen();
}
