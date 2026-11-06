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
    headCoords: { x: 0, y: 7 },
    direction: "down",
  },
  {
    ship: createShip(4),
    headCoords: { x: 2, y: 7 },
    direction: "right",
  },
];

test("Should place ships accordingly", () => {
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
        { x: 0, y: 7 },
        { x: 0, y: 8 },
        { x: 0, y: 9 },
      ],
    },
    {
      shipCoords: [
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 4, y: 7 },
        { x: 5, y: 7 },
      ],
    },
  ];

  expect(board.placedShips).toEqual(expectedShips);
});
