import { BOARD_LENGTH, type Gameboard } from "../domain/gameboard";
import type { PlayerSpecificData } from "../game-service";

export function loadPlayerScreen(playerData: PlayerSpecificData) {}

function displayOwnBoard(board: Gameboard) {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  for (let i = 0; i < BOARD_LENGTH; i++) {
    const rowEl = document.createElement("div");
    for (let j = 0; j < BOARD_LENGTH; j++) {
      const cellEl = document.createElement("div");
    }
  }

  document.getElementById("content");
}
