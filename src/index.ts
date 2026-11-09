import { createGame } from "./game-service";
import "./styles.css";
import { contentEl } from "./ui/common";
import { loadPlayerScreen } from "./ui/loadPlayerScreen";

const Game = createGame();

Game.subscribe(render);

loadPlayerScreen(Game.getCurrentPlayerData());

export function render() {
  contentEl.replaceChildren();
  const phaseEl = document.createElement("h2");
  const phase = Game.getCurrentPlayerData().gamePhase;

  if (phase === "game over") {
    const winnerId = Game.getCurrentPlayerData().playerId;
    phaseEl.textContent =
      "Game over! " + "Player " + winnerId + " won the game!";
    return;
  }

  if (phase === "battle") {
    phaseEl.textContent = "Attack an enemy coordinate!";
  } else {
    phaseEl.textContent = "Place your next ship!";
  }
  contentEl.appendChild(phaseEl);

  loadWaitingScreen();
}
