import {
  areCoordsEqual,
  recieveAttack,
  type CoordPair,
  type Gameboard,
} from "./gameboard";

export type PlayerId = "A" | "B";

export interface GameState {
  readonly currentPlayer: PlayerId;
  readonly boards: Record<PlayerId, Gameboard>;
}

export function attack(
  state: GameState,
  coordPair: CoordPair,
): GameState | AttackError {
  const enemy = state.currentPlayer === "A" ? "B" : "A";

  return modifyBoard(state, enemy, (b) => {});
}

function modifyBoard(
  state: GameState,
  player: PlayerId,
  f: (b: Gameboard) => Gameboard,
): GameState {
  const boards = state.boards;
  const modifiedBoard = f(boards[player]);

  return { ...state, boards: { ...boards, [player]: modifiedBoard } };
}
