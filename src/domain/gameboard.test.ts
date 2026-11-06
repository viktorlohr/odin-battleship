import {
  createGameboard,
  placeShip,
  type ShipPlacementRequest,
} from "./gameboard";
import { createShip } from "./ship";

test("Should place ship at [0,0], [1,0]", () => {
  const request: ShipPlacementRequest = {
    ship: createShip(2),
    headCoords: { x: 0, y: 0 },
    direction: "x",
  };
  const board = createGameboard();

  const newBoard = placeShip(board, request);
  if (newBoard === "ship is too long") {
    throw new Error("ship asserted as too long even though it isn't");
  }

  const expectedShips = [
    {
      shipCoords: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      // shipCoords: [
      //   {x: }
      // ]
    },
  ];

  expect(newBoard.placedShips).toEqual(expectedShips);
});
