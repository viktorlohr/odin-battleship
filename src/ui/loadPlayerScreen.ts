import {
  BOARD_LENGTH,
  createCoordKey,
  createCoordStatusMap,
  type CoordStatusMap,
} from "../domain/gameboard";
import type { PlayerSpecificData } from "../game-service";
import { contentEl } from "./common";

export function loadPlayerScreen(playerData: PlayerSpecificData) {
  const ownBoardHeader = document.createElement("h2");
  ownBoardHeader.textContent = "This is your own board:";

  const ownCoordStatusMap = createCoordStatusMap(playerData.board);
  const ownBoardEl = createBoardEl(ownCoordStatusMap);

  const enemyBoardHeader = document.createElement("h2");
  enemyBoardHeader.textContent = "This is your enemies board:";

  const enemyCoordStatusMap = playerData.enemyCoordStatusMap;
  console.log(enemyCoordStatusMap);
  const enemyBoardEl = createBoardEl(enemyCoordStatusMap);

  contentEl.append(ownBoardHeader, ownBoardEl, enemyBoardHeader, enemyBoardEl);
}

function createBoardEl(statusMap: CoordStatusMap) {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  for (let j = 0; j < BOARD_LENGTH; j++) {
    const rowEl = document.createElement("div");
    for (let i = 0; i < BOARD_LENGTH; i++) {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");

      const key = createCoordKey(i, j);

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
