import { err, ok, type Result } from "./game-error";
import { createShip, type Ship } from "./ship";

export const BOARD_LENGTH = 10;

export interface Gameboard {
  readonly attackedCoords: CoordPair[];
  readonly placedShips: PlacedShip[];
}

export type GameboardError = PlacementError | AttackError;

export type GameboardResult = Result<Gameboard, GameboardError>;

export type AttackError = "already attacked these coords";

export type PlacementError =
  "ship is too long" | "too close to other ship" | "already placed this ship";

export interface CoordPair {
  readonly x: number;
  readonly y: number;
}

export function createCoordPair(x: number, y: number): CoordPair {
  const result = { x, y };
  if (!isCoordInRange(result)) {
    throw new Error("invalid coords");
  }

  return result;
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

export function receiveShipPlacement(
  board: Gameboard,
  request: ShipPlacementRequest,
): GameboardResult {
  if (
    board.placedShips.some(
      (placedShip) => placedShip.shipCoords.length === request.ship.shipLength,
    )
  ) {
    return err("already placed this ship");
  }
  const shipCoords = convertRequestToCoords(request);

  const occupiedCoords = getOccupiedCoords(board);
  // @ts-expect-error only returns on error
  shipCoords.forEach((coordPair) => {
    if (!isCoordInRange(coordPair)) {
      return err("ship is too long");
    }
    if (
      occupiedCoords.some((o) => o.x === coordPair.x && o.y === coordPair.y)
    ) {
      return err("too close to other ship");
    }
  });

  const placedShip = { shipCoords };

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

export function receiveAttack(
  board: Gameboard,
  coordPair: CoordPair,
): GameboardResult {
  if (board.attackedCoords.some((cp) => areCoordsEqual(cp, coordPair))) {
    return err("already attacked these coords");
  }

  return ok({ ...board, attackedCoords: [...board.attackedCoords, coordPair] });
}

export function getAlreadyPlacedShips(board: Gameboard): Ship[] {
  return board.placedShips.map((ps) => createShip(ps.shipCoords.length));
}

export function getNotYetPlacedShips(board: Gameboard): Ship[] {
  const placedShipLengths = board.placedShips.map((s) => s.shipCoords.length);

  const unplacedLengths = [1, 2, 3, 4, 5].filter(
    (n) => !placedShipLengths.some((m) => n === m),
  );

  return unplacedLengths.map((n) => createShip(n));
}

export function hasAllShipsPlaced(board: Gameboard): boolean {
  return board.placedShips.length === 4;
}

export function createPlacementRequest(
  length: number,
  head_x: number,
  head_y: number,
  direction: Direction,
) {
  return {
    ship: createShip(length),
    headCoords: createCoordPair(head_x, head_y),
    direction,
  };
}

export function createMockPlacedShip(
  length: number,
  head_x: number,
  head_y: number,
  direction: "d" | "r" = "r",
): PlacedShip {
  return {
    shipCoords: convertRequestToCoords({
      ship: createShip(length),
      headCoords: { x: head_x, y: head_y },
      direction: direction === "d" ? "down" : "right",
    }),
  };
}

export function createMockBoard() {
  return {
    attackedCoords: [
      createCoordPair(0, 0),
      createCoordPair(2, 2),
      createCoordPair(2, 3),
    ],
    placedShips: [
      createMockPlacedShip(2, 0, 0),
      createMockPlacedShip(3, 0, 2),
      createMockPlacedShip(4, 0, 4),
      createMockPlacedShip(5, 0, 6),
    ],
  };
}

export function prettyPrintBoard(board: Gameboard) {
  const shipCoords = getAllShipCoords(board);
  const attackedCoords = board.attackedCoords;
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
  console.log("Explanation: 0 = nothing, 1 = ship, 2 = attacked");
}

function convertRequestToCoords(request: ShipPlacementRequest) {
  const shipCoords: CoordPair[] = [];
  const direction = request.direction;

  const x = request.headCoords.x;
  const y = request.headCoords.y;

  for (let i = 0; i < request.ship.shipLength; i++) {
    const coordPair = direction === "right" ? { x: x + i, y } : { x, y: y + i };

    shipCoords.push(coordPair);
  }

  return shipCoords;
}

prettyPrintBoard(createMockBoard());
