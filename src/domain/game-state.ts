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

// function placeShip(
//   state: GameState,
//   headCoords: CoordPair,
//   ship: Ship
// ) {
//   const board = state.boards[state.currentPlayer]
//   if
// }
