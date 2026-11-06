import {
  recieveAttack,
  type CoordPair,
  type Gameboard,
  type GameboardError,
  type GameboardResult,
} from "./gameboard";

export type PlayerId = "A" | "B";

export interface GameState {
  readonly currentPlayer: PlayerId;
  readonly boards: Record<PlayerId, Gameboard>;
}

export type GameError = GameboardError;

export type GameStateResult = GameState | GameError;

export function attack(
  state: GameState,
  coordPair: CoordPair,
): GameStateResult {
  const enemy = state.currentPlayer === "A" ? "B" : "A";

  return modifyBoard(state, enemy, (b) => recieveAttack(b, coordPair));
}

function modifyBoard(
  state: GameState,
  player: PlayerId,
  f: (b: Gameboard) => GameboardResult,
): GameStateResult {
  const boards = state.boards;

  const newBoardResult = f(boards[player]);

  if (!newBoardResult.ok) {
    return newBoardResult.err;
  }

  return { ...state, boards: { ...boards, [player]: newBoardResult.val } };
}
