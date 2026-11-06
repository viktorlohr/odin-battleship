import { type Ship } from "./ship";

const BOARD_LENGTH = 10;

export interface Gameboard {
  readonly boardLength: number;
  readonly attackedCoords: CoordPair[];
  readonly placedShips: PlacedShip[];
}

export interface CoordPair {
  readonly x: number;
  readonly y: number;
}

export type Direction = "right" | "down";

export interface ShipPlacementRequest {
  readonly ship: Ship;
  readonly headCoords: CoordPair;
  readonly direction: Direction;
}

export type PlacementError = "ship is too long" | "too close to other ship";

export interface PlacedShip {
  readonly shipCoords: CoordPair[];
}

export function createGameboard(): Gameboard {
  return { boardLength: BOARD_LENGTH, attackedCoords: [], placedShips: [] };
}

export function placeShip(
  board: Gameboard,
  request: ShipPlacementRequest,
): Gameboard | PlacementError {
  const shipCoords: CoordPair[] = [];
  const direction = request.direction;

  const x = request.headCoords.x;
  const y = request.headCoords.y;

  const occupiedCoords = getOccupiedCoords(board);

  for (let i = 0; i < request.ship.shipLength; i++) {
    const coord = direction === "right" ? { x: x + i, y } : { x, y: y + i };

    if (!isCoordInRange(coord)) {
      return "ship is too long";
    }

    if (occupiedCoords.some((o) => o.x === coord.x && o.y === coord.y)) {
      return "too close to other ship";
    }

    shipCoords.push(coord);
  }
  const placedShip = { shipCoords };

  return { ...board, placedShips: [...board.placedShips, placedShip] };

  function isCoordInRange(coord: CoordPair): boolean {
    return Object.values(coord).every((coord) => 0 <= coord && coord < 10);
  }
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

    console.log("occupiedCoords: ");
    console.log(result);

    return result;
  }

  function isInRange(x: number) {
    return 0 <= x && x < 10;
  }
}
