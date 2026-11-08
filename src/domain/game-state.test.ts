import type { GameState } from "./game-state";

test("should switch to attack phase", () => {
  const initGameState: GameState = {
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
});
