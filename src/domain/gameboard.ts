import { Ship } from "./ship";

export const Gameboard = {
  placeShip,
};

export interface Gameboard {
  readonly boardLength: number;
  readonly boardWidth: number;
  readonly attackedCoords: Coords[];
  readonly placedShips: PlacedShip[];
}

export interface Coords {
  readonly x: number;
  readonly y: number;
}

export type Direction = "horizontal" | "vertical";

export interface ShipPlacementRequest {
  readonly ship: Ship;
  readonly headCoords: Coords;
  readonly direction: Direction;
}

export interface PlacedShip {
  readonly ship: Ship;
  readonly shipCoords: Coords[];
}

function placeShip(ShipPlacementRequest: ShipPlacementRequest): {};
