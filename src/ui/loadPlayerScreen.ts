import {
  BOARD_LENGTH,
  createCoordPair,
  getCoordStatus,
  type Gameboard,
} from "../domain/gameboard";
import type { PlayerSpecificData } from "../game-service";

export function loadPlayerScreen(playerData: PlayerSpecificData) {
  document.getElementById("content")?.append(document);
}

function displayOwnBoard(board: Gameboard) {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  for (let i = 0; i < BOARD_LENGTH; i++) {
    const rowEl = document.createElement("div");
    for (let j = 0; j < BOARD_LENGTH; j++) {
      const cellEl = document.createElement("div");

      const coordStatus = getCoordStatus(createCoordPair(i, j), board);

      switch (coordStatus) {
        case { isShip: false, isAttacked: false }:
          cellEl.classList.add("neutral");
          break;
        case { isShip: true, isAttacked: false }:
          cellEl.classList.add("ship");
          break;
        case { isShip: false, isAttacked: true }:
          cellEl.classList.add("miss");
          break;
        case { isShip: true, isAttacked: true }:
          cellEl.classList.add("hit");
          break;
      }
      rowEl.appendChild(cellEl);
    }
    boardEl.appendChild(rowEl);
  }

  document.getElementById("content");
}
