import { getAllShipCoords, type Direction } from "./domain/gameboard";
import { createShip } from "./domain/ship";
import { createGame, type PlayerSpecificData } from "./game-service";

// const c = await import("./src/cli-controller.ts")

const Game = createGame();

export function printPlayerData(
  data: PlayerSpecificData = Game.getCurrentPlayerData(),
) {
  console.log("This is their board (0: nothing, 1: ship, 2: attacked):");

  const shipCoords = getAllShipCoords(data.board);
  const attackedCoords = data.board.attackedCoords;
  const boardDisplay = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      let symbol = "0";
      if (shipCoords.some((c) => c.x === i && c.y === j)) {
        symbol = "S";
      }
      if (attackedCoords.some((c) => c.x === i && c.y === j)) {
        symbol = "X";
      }
      row.push(symbol);
    }
    boardDisplay.push(row);
  }

  console.table(boardDisplay);
  return boardDisplay;
}

// @ts-expect-error only returns on
export function pl(
  head_x: number,
  head_y: number,
  length: number,
  direction: Direction,
) {
  const err = Game.executeCommand({
    kind: "place ship",
    request: {
      ship: createShip(length),
      headCoords: { x: head_x, y: head_y },
      direction,
    },
  });

  if (err) {
    return err;
  }

  printPlayerData();
}

// @ts-expect-error only returns error
export function att(x: number, y: number) {
  const err = Game.executeCommand({
    kind: "attack",
    coordPair: { x, y },
  });

  if (err) {
    return err;
  }

  printPlayerData();
}
