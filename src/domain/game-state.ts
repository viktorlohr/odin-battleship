import { ok, type Result } from "./game-error";
import {
  createGameboard,
  receiveAttack,
  type CoordPair,
  type Gameboard,
  type GameboardError,
} from "./gameboard";

export type PlayerId = "A" | "B";

export interface GameState {
  readonly currentPlayer: PlayerId;
  readonly boards: Record<PlayerId, Gameboard>;
}

export type GameError = GameboardError;

export type GameStateResult = Result<GameState, GameError>;

export function initGameState(): GameState {
  return {
    currentPlayer: "A",
    boards: { A: createGameboard(), B: createGameboard() },
  };
}

export function playTurn(
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
