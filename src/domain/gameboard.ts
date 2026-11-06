import { Ship } from "./ship";

export const Gameboard = {
  placeShip,
};

export interface Gameboard {
  readonly attackedCoords: Coords[];
  readonly placedShips: PlacedShip[];
}

export interface Coords {
  readonly x: number;
  readonly y: number;
}

export type Direction = "horizontal" | "vertical";

export interface PlacementRequest {
  readonly ship: Ship;
  readonly headCoords: Coords;
  readonly direction: Direction;
}

export interface PlacedShip {
  readonly shipId: ShipId;
  readonly shipCoords: Coord[];
}

function placeShip(shipP: PlacementRequest): {};
