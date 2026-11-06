import {
  createGameboard,
  placeShip,
  type PlacedShip,
  type ShipPlacementRequest,
} from "./gameboard";
import { createShip } from "./ship";

const requests: ShipPlacementRequest[] = [
  {
    ship: createShip(2),
    headCoords: { x: 0, y: 0 },
    direction: "right",
  },
  {
    ship: createShip(3),
    headCoords: { x: 7, y: 0 },
    direction: "down",
  },
];

test("Should place ship at [0,0], [1,0]", () => {
  let board = createGameboard();

  requests.forEach((r) => {
    const newBoard = placeShip(board, r);

    if (newBoard === "ship is too long") {
      throw new Error("ship asserted as too long even though it isn't");
    }
    if (newBoard === "too close to other ship") {
      throw new Error(
        "ship asserted to be too close to other ship even though it isn't",
      );
    }

    board = newBoard;
  });

  const expectedShips: PlacedShip[] = [
    {
      shipCoords: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
    },
    {
      shipCoords: [
        { x: 7, y: 0 },
        { x: 8, y: 0 },
        { x: 9, y: 0 },
      ],
    },
  ];

  expect(board.placedShips).toEqual(expectedShips);
});
