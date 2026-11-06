import { err } from "./game-error";
import {
  createGameboard,
  isSunk,
  placeShip,
  type PlacedShip,
  type PlacementError,
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

  // @ts-expect-error lambda expression is expected to return nothing here if result is ok
  requests.forEach((r) => {
    const newBoardResult = placeShip(board, r);

    if (!newBoardResult.ok) {
      return newBoardResult.err;
    }

    board = newBoardResult.val;
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

const invalidreq1: ShipPlacementRequest = {
  ship: createShip(5),
  headCoords: { x: 6, y: 0 },
  direction: "right",
};

test("should complain about ship length", () => {
  const board = createGameboard();
  const complaint: PlacementError = "ship is too long";
  expect(placeShip(board, invalidreq1)).toEqual(err(complaint));
});

const invalidreq2: ShipPlacementRequest = {
  ship: createShip(2),
  headCoords: { x: 2, y: 1 },
  direction: "right",
};

test("should complain about other ships", () => {
  const boardResult = placeShip(createGameboard(), {
    ship: createShip(2),
    headCoords: { x: 0, y: 0 },
    direction: "right",
  });
  if (!boardResult.ok) {
    throw new Error("Should not throw. Check the previous tests in this file");
  }
  const complaint: PlacementError = "too close to other ship";
  expect(placeShip(boardResult.val, invalidreq2)).toEqual(err(complaint));
});

test("should assert that ship sunk", () => {
  const attackedCoords = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];
  const ship = {
    shipCoords: [...attackedCoords],
  };

  expect(isSunk(attackedCoords, ship)).toBe(true);
});
