import type { Direction } from "./domain/gameboard";
import { createShip } from "./domain/ship";
import { createGame } from "./game-service";

// const c = await import("./src/cli-controller.ts")

const Game = createGame();

export function get() {
  console.log(`It is ${Game.getCurrentPlayer()}'s turn.`);
  console.log("These are their placed ships:");
  console.table(
    Game.getCurrentPlayerData().board.placedShips.map((ps) => ps.shipCoords),
  );
  console.log("These spots have been attacked already:");
  console.log(Game.getCurrentPlayerData().board.attackedCoords);
}

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

  get();
}

export function att(x: number, y: number) {
  const err = Game.executeCommand({
    kind: "attack",
    coordPair: { x, y },
  });

  if (err) {
    return err;
  }

  get();
}
