import { printPlayerData } from "./cli-controller";
import type { PlayerSpecificData } from "./game-service";

const mockData: PlayerSpecificData = {
  playerId: "A",
  attacksOnEnemy: [],
  board: {
    attackedCoords: [],
    placedShips: [
      {
        shipCoords: [
          {
            x: 0,
            y: 0,
          },
        ],
      },
      {
        shipCoords: [
          {
            x: 1,
            y: 0,
          },
        ],
      },
      {
        shipCoords: [
          {
            x: 2,
            y: 0,
          },
        ],
      },
    ],
  },
};

const boardDisplay = printPlayerData(mockData);
