import {
  BOARD_LENGTH,
  createCoordTupleString,
  createCoordTupleStrStatusMap,
  type CoordStatus,
} from "../domain/gameboard";
import type { PlayerSpecificData } from "../game-service";
import { contentEl } from "./common";

export function loadPlayerScreen(playerData: PlayerSpecificData) {
  const ownBoardStatusMap = createCoordTupleStrStatusMap(playerData.board);
  const ownBoardEl = createBoardEl(ownBoardStatusMap);

  contentEl.append(ownBoardEl);
}

function createBoardEl(statusMap: Record<string, CoordStatus>) {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  for (let i = 0; i < BOARD_LENGTH; i++) {
    const rowEl = document.createElement("div");
    for (let j = 0; j < BOARD_LENGTH; j++) {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");

      const key = createCoordTupleString(i, j);

      const lookupResult = statusMap[key];

      if (!lookupResult) {
        throw new Error("Status map does not get created correctly.");
      }

      const { isShip, isAttacked } = lookupResult;

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
