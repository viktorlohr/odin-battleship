import {
  BOARD_LENGTH,
  createCoordPair,
  getCoordStatus,
  type Gameboard,
} from "../domain/gameboard";
import type { PlayerSpecificData } from "../game-service";
import { contentEl } from "./common";

export function loadPlayerScreen(playerData: PlayerSpecificData) {
  const boardEl = getBoardEl(playerData.board);

  contentEl.append(boardEl);
}

function getBoardEl(board: Gameboard) {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  for (let i = 0; i < BOARD_LENGTH; i++) {
    const rowEl = document.createElement("div");
    for (let j = 0; j < BOARD_LENGTH; j++) {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");

      const { isShip, isAttacked } = getCoordStatus(
        createCoordPair(i, j),
        board,
      );

      let cssClass = "neutral";
      if (isShip && !isAttacked) {
        cssClass = "ship";
      } else if (!isShip && isAttacked) {
        cssClass = "miss";
      } else if (isShip && isAttacked) {
        cssClass = "hit";
      }
      cellEl.classList.add(cssClass);

      rowEl.appendChild(cellEl);
    }
    boardEl.appendChild(rowEl);
  }

  return boardEl;
}
