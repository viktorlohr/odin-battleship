import { type Ship } from "./ship";

export interface Gameboard {
  readonly boardLength: number;
  readonly attackedCoords: CoordPair[];
  readonly placedShips: PlacedShip[];
}

export interface CoordPair {
  readonly x: number;
  readonly y: number;
}

export type Direction = "x" | "y";

export interface ShipPlacementRequest {
  readonly ship: Ship;
  readonly headCoords: CoordPair;
  readonly direction: Direction;
}

export type PlacementError = "ship is too long";

export interface PlacedShip {
  readonly shipCoords: CoordPair[];
}

export function createGameboard() {
  return { boardLength: 10, attackedCoords: [], placedShips: [] };
}

export function placeShip(
  board: Gameboard,
  request: ShipPlacementRequest,
): Gameboard | PlacementError {
  const shipCoords: CoordPair[] = [];
  const direction = request.direction;

  if (
    request.headCoords[direction] + request.ship.shipLength >
    board.boardLength
  ) {
    return "ship is too long";
  }

  const x = request.headCoords.x;
  const y = request.headCoords.y;
  for (let i = 0; i < request.ship.shipLength; i++) {
    const coord = direction === "x" ? { x: x + i, y } : { x, y: y + i };
    shipCoords.push(coord);
  }
  const placedShip = { shipCoords };

  return { ...board, placedShips: [...board.placedShips, placedShip] };
}

export function getAllShipCoords(board: Gameboard): CoordPair[] {
  return board.placedShips.flatMap((s) => s.shipCoords);
}
