import type { Direction } from "./domain/gameboard";
import { createShip } from "./domain/ship";
import { createGame } from "./game-service";
import "./styles.css";

const Game = createGame();

export function pl(
  head_x: number,
  head_y: number,
  length: number,
  direction: Direction,
) {
  Game.executeCommand({
    kind: "place ship",
    request: {
      ship: createShip(length),
      headCoords: { x: head_x, y: head_y },
      direction,
    },
  });
}

export function att(x: number, y: number) {
  Game.executeCommand({
    kind: "attack",
    coordPair: { x, y },
  });
}
