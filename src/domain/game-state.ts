import { ok, type Result } from "./game-error";
import {
  createGameboard,
  getNotYetPlacedShips,
  receiveAttack,
  type CoordPair,
  type Gameboard,
  type GameboardError,
} from "./gameboard";

export type PlayerId = "A" | "B";

export interface GameState {
  readonly currentPlayer: PlayerId;
  readonly gamePhase: GamePhase;
  readonly boards: Record<PlayerId, Gameboard>;
}

export type GamePhase = "place ships" | "battle";

export type GameError = GameboardError;
export type GameStateResult = Result<GameState, GameError>;

export function initGameState(): GameState {
  return {
    currentPlayer: "A",
    gamePhase: "place ships",
    boards: { A: createGameboard(), B: createGameboard() },
  };
}

export function attack(
  state: GameState,
  coordPair: CoordPair,
): GameStateResult {
  const enemy = state.currentPlayer === "A" ? "B" : "A";

  const newBoardResult = receiveAttack(state.boards[enemy], coordPair);
  if (!newBoardResult.ok) {
    return newBoardResult;
  }
  const newBoard = newBoardResult.val;

  return ok({
    ...state,
    currentPlayer: enemy,
    boards: { ...state.boards, [enemy]: newBoard },
  });
}

// function modifyBoard(
//   state: GameState,
//   player: PlayerId,
//   f: (b: Gameboard) => GameboardResult,
// ): GameStateResult {
//   const boards = state.boards;

//   const newBoardResult = f(boards[player]);

//   if (!newBoardResult.ok) {
//     return newBoardResult.err;
//   }
//   const newBoard = newBoardResult.val;

//   return { ...state, boards: { ...boards, [player]: newBoard } };
// }

// switch (state.gamePhase.desc) {
//     case "place ships": {
//       const shipsToPlace = getNotYetPlacedShips(
//         state.boards[state.currentPlayer],
//       );

//       if (shipsToPlace.length === 0) {
//         return ok({
//           ...state,
//           gamePhase: {
//             desc: "place ships",
//             isDone: { ...state.gamePhase.isDone, [state.currentPlayer]: true },
//           },
//         });
//       }

//     }

//   }
