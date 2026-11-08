import { err } from "./game-error";
import {
  createCoordPair,
  createGameboard,
  createMockBoard,
  createMockPlacedShip,
  hasAllShipsPlaced,
  isSunk,
  receiveAttack,
  receiveShipPlacement,
  type Gameboard,
  type GameboardError,
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
    const newBoardResult = receiveShipPlacement(board, r);

    if (!newBoardResult.ok) {
      return newBoardResult;
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

test("should complain about ship length", () => {
  const invalidreq: ShipPlacementRequest = {
    ship: createShip(5),
    headCoords: { x: 6, y: 0 },
    direction: "right",
  };
  const board = createGameboard();
  const complaint: PlacementError = "ship is too long";
  expect(receiveShipPlacement(board, invalidreq)).toEqual(err(complaint));
});

test("should complain about other ships", () => {
  const invalidreq: ShipPlacementRequest = {
    ship: createShip(5),
    headCoords: { x: 2, y: 1 },
    direction: "right",
  };

  const boardResult = receiveShipPlacement(createGameboard(), {
    ship: createShip(2),
    headCoords: { x: 0, y: 0 },
    direction: "right",
  });
  if (!boardResult.ok) {
    throw new Error("Should be ok. Check the previous tests in this file");
  }
  const complaint: PlacementError = "too close to other ship";
  expect(receiveShipPlacement(boardResult.val, invalidreq)).toEqual(
    err(complaint),
  );
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

test("should assert that all ships have been placed", () => {
  const board: Gameboard = {
    attackedCoords: [],
    placedShips: [
      { shipCoords: [{ x: 0, y: 0 }] },
      { shipCoords: [{ x: 0, y: 0 }] },
      { shipCoords: [{ x: 0, y: 0 }] },
      { shipCoords: [{ x: 0, y: 0 }] },
    ],
  };
  expect(hasAllShipsPlaced(board)).toBe(true);
});

test.("should attack 0,0", () => {
  const board = {
    attackedCoords: [],
    placedShips: [],
  };

  const newBoardResult = receiveAttack(board, createCoordPair(0, 0));

  if (!newBoardResult.ok) {
    throw new Error(newBoardResult.err);
  }
  const newBoard = newBoardResult.val;

  expect(newBoard.attackedCoords).toEqual([{ x: 0, y: 0 }]);
});


test.only("should complain about coords", () => {
  const board = {
    attackedCoords: [],
    placedShips: [],
  }

  const newBoardResult = receiveAttack(board, createCoordPair(10,0)); 

  if (newBoardResult.ok) {
    throw new Error ("should not be ok")
  }
  const err = newBoardResult.err;
  const complaint: GameboardError = "coords out of range"

  expect(err).toEqual(complaint);
})