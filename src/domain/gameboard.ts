import { err, ok, type Result } from "./game-error";
import { type Ship } from "./ship";

export const BOARD_LENGTH = 10;

export interface Gameboard {
  readonly attackedCoords: CoordPair[];
  readonly placedShips: PlacedShip[];
}

export type GameboardError = PlacementError | AttackError;

export type GameboardResult = Result<Gameboard, GameboardError>;

export type AttackError = "already attacked these coords";

export type PlacementError = "ship is too long" | "too close to other ship";

export interface CoordPair {
  readonly x: number;
  readonly y: number;
}

export function createCoordPair(x: number, y: number) {
  const result = { x, y };
  if (!isCoordInRange(result)) {
    throw new Error("invalid coords");
  }
}

function isCoordInRange(coord: CoordPair): boolean {
  return Object.values(coord).every(
    (coord) => 0 <= coord && coord < BOARD_LENGTH,
  );
}

export type Direction = "right" | "down";

export interface ShipPlacementRequest {
  readonly ship: Ship;
  readonly headCoords: CoordPair;
  readonly direction: Direction;
}

export interface PlacedShip {
  readonly shipCoords: CoordPair[];
}

export function createGameboard(): Gameboard {
  return { attackedCoords: [], placedShips: [] };
}

export function placeShip(
  board: Gameboard,
  request: ShipPlacementRequest,
): GameboardResult {
  const shipCoords: CoordPair[] = [];
  const direction = request.direction;

  const x = request.headCoords.x;
  const y = request.headCoords.y;

  const occupiedCoords = getOccupiedCoords(board);

  for (let i = 0; i < request.ship.shipLength; i++) {
    const coord = direction === "right" ? { x: x + i, y } : { x, y: y + i };

    if (!isCoordInRange(coord)) {
      return err("ship is too long");
    }

    if (occupiedCoords.some((o) => o.x === coord.x && o.y === coord.y)) {
      return err("too close to other ship");
    }

    shipCoords.push(coord);
  }
  const placedShip = { shipCoords };
  console.log("placedShip Coords: ");
  console.log(placedShip);

  const result = { ...board, placedShips: [...board.placedShips, placedShip] };
  return ok(result);
}

export function getAllShipCoords(board: Gameboard): CoordPair[] {
  return board.placedShips.flatMap((s) => s.shipCoords);
}

function getOccupiedCoords(board: Gameboard): CoordPair[] {
  return getAllShipCoords(board).flatMap((coordPair) =>
    getSurroundingCoordPairs(coordPair),
  );

  function getSurroundingCoordPairs({ x, y }: CoordPair): CoordPair[] {
    const offsets = [-1, 0, 1];

    const result = offsets
      .flatMap((off1) => offsets.map((off2) => ({ x: x + off1, y: y + off2 })))
      .filter((coordPair) =>
        Object.values(coordPair).every((coord) => isInRange(coord)),
      );

    return result;
  }

  function isInRange(x: number) {
    return 0 <= x && x < BOARD_LENGTH;
  }
}

export function isSunk(attackedCoords: CoordPair[], ship: PlacedShip): boolean {
  return ship.shipCoords.every((sc) =>
    attackedCoords.some((ac) => areCoordsEqual(sc, ac)),
  );
}

export function hasLost(board: Gameboard): boolean {
  return board.placedShips.every((s) => isSunk(board.attackedCoords, s));
}

export function areCoordsEqual(p1: CoordPair, p2: CoordPair): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function recieveAttack(
  board: Gameboard,
  coordPair: CoordPair,
): GameboardResult {
  if (board.attackedCoords.some((cp) => areCoordsEqual(cp, coordPair))) {
    return err("already attacked these coords");
  }

  return ok({ ...board, attackedCoords: [...board.attackedCoords, coordPair] });
}
