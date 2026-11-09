import {
  BOARD_LENGTH,
  createCoordKey,
  createCoordStatusMap,
  type CoordStatusMap,
} from "../domain/gameboard";
import type { PlayerSpecificData } from "../game-service";
import { contentEl } from "./common";
import {
  openPrompt,
  type CellData as CellData,
  type PromptPayload,
} from "./prompts";

export function loadPlayerScreen(playerData: PlayerSpecificData) {
  contentEl.replaceChildren();
  displayBoards(playerData);
}

function displayBoards(
  playerData: PlayerSpecificData,
  attackPromptPayload: PromptPayload,
  placePromptPayload: PromptPayload,
) {
  const ownBoardHeader = document.createElement("h2");
  ownBoardHeader.textContent = `This is ${playerData.playerId}'s board:`;

  const ownCoordStatusMap = createCoordStatusMap(playerData.board);
  const ownBoardEl = createBoardEl(ownCoordStatusMap, placePromptPayload);

  const enemyBoardHeader = document.createElement("h2");
  enemyBoardHeader.textContent = "This is their enemy's board:";

  const enemyCoordStatusMap = playerData.enemyCoordStatusMap;
  console.log(enemyCoordStatusMap);

  const enemyBoardEl = createBoardEl(enemyCoordStatusMap, attackPromptPayload);

  contentEl.append(ownBoardHeader, ownBoardEl, enemyBoardHeader, enemyBoardEl);
}

function createBoardEl(
  statusMap: CoordStatusMap,
  promptPayload: PromptPayload,
) {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  for (let j = 0; j < BOARD_LENGTH; j++) {
    const rowEl = document.createElement("div");
    for (let i = 0; i < BOARD_LENGTH; i++) {
      const cellEl = document.createElement("div");

      const cellData: CellData = {
        x_coord: i,
        y_coord: j,
        cellEl,
      };

      cellEl.addEventListener("click", (e) => {
        e.preventDefault();
        openPrompt({ ...cellData, ...promptPayload });
      });

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
      cellEl.classList.add("cell", key, cssClass);

      rowEl.appendChild(cellEl);
    }
    boardEl.appendChild(rowEl);
  }

  return boardEl;
}
