import { attack, placeShip, type GameState } from "./game-state";
import { createPlacementRequest } from "./gameboard";

test("should switch to battle phase", () => {
  const state: GameState = {
    gamePhase: "place ships",
    currentPlayer: "B",
    boards: {
      A: {
        attackedCoords: [],
        placedShips: [
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
        ],
      },
      B: {
        attackedCoords: [],
        placedShips: [
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
        ],
      },
    },
  };

  const newStateResult = placeShip(
    state,
    createPlacementRequest(2, 3, 3, "down"),
  );

  if (!newStateResult.ok) {
    throw new Error(newStateResult.err);
  }
  const newState = newStateResult.val;

  expect(newState.gamePhase).toBe("battle");
});

test("should declare game over", () => {
  const state: GameState = {
    gamePhase: "battle",
    currentPlayer: "B",
    boards: {
      A: {
        attackedCoords: [],
        placedShips: [
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
        ],
      },
      B: {
        attackedCoords: [{ x: 0, y: 0 }],
        placedShips: [
          {
            shipCoords: [{ x: 0, y: 0 }],
          },
        ],
      },
    },
  };

  const newStateResult = attack(state, { x: 0, y: 0 });

  if (!newStateResult.ok) {
    throw new Error(newStateResult.err);
  }
  const newState = newStateResult.val;

  expect(newState.gamePhase).toBe("game over");
});

test("should leave own board untouched after attack", () => {
  const state: GameState = {
    gamePhase: "battle",
    currentPlayer: "A",
    boards: {
      A: {
        attackedCoords: [],
        placedShips: [],
      },
      B: {
        attackedCoords: [],
        placedShips: [],
      },
    },
  };

  const newStateResult = attack(state, { x: 0, y: 0 });

  if (!newStateResult.ok) {
    throw new Error(newStateResult.err);
  }
  const newState = newStateResult.val;

  expect(newState.boards.A).toEqual(state.boards.A);
});

test.only("should leave enemy board untouched after ship placement", () => {
  const state: GameState = {
    gamePhase: "place ships",
    currentPlayer: "A",
    boards: {
      A: {
        attackedCoords: [],
        placedShips: [],
      },
      B: {
        attackedCoords: [],
        placedShips: [],
      },
    },
  };

  const newStateResult = placeShip(state, {
    headCoords: { x: 0, y: 0 },
    direction: "down",
    ship: { shipLength: 2 },
  });

  if (!newStateResult.ok) {
    throw new Error(newStateResult.err);
  }
  const newState = newStateResult.val;

  expect(newState.boards.B).toEqual(state.boards.B);
});
