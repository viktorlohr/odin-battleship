import { placeShip, type GameState } from "./game-state";
import { createPlacementRequest } from "./gameboard";

test("should switch to attack phase", () => {
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
