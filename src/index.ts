import { createMockPlayerData } from "./game-service";
// import type { PlayerSpecificData } from "./game-service";
import "./styles.css";
import { loadPlayerScreen } from "./ui/loadPlayerScreen";

// const mockData: PlayerSpecificData = {
//   playerId: "A",
//   board: {
//     attackedCoords: [{ x: 0, y: 0 }],
//     placedShips: [
//       {
//         shipCoords: [
//           { x: 0, y: 0 },
//           { x: 1, y: 0 },c
//         ],
//       },
//     ],
//   },
//   attacksOnEnemy: [],
// };
const mockData = createMockPlayerData();

loadPlayerScreen(mockData);
