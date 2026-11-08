import { prettyPrintBoard, type Direction } from "./domain/gameboard";
import { createShip } from "./domain/ship";
import { createGame, type PlayerSpecificData } from "./game-service";

// const c = await import("./src/cli-controller.ts")

const Game = createGame();

export function printPlayerData(
  data: PlayerSpecificData = Game.getCurrentPlayerData(),
) {
  console.log(`It is player ${data.playerId}'s turn.`);
  console.log("This is their board: ");
  prettyPrintBoard(data.board);
}

// @ts-expect-error only returns on error
export function pl(
  head_x: number,
  head_y: number,
  length: number,
  direction: Direction = "right",
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
