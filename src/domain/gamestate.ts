import type { Gameboard } from "./gameboard";

export type PlayerId = "A" | "B";

export interface GameState {
  currentPlayer: PlayerId;
  boards: Record<PlayerId, Gameboard>;
}

function modifyCurrentGameboard(
  state: GameState,
  f: (s: Gameboard) => Gameboard,
) {
  const boards = state.boards;
  const currPlayer = state.currentPlayer;
  const modifiedBoard = f(boards[currPlayer]);

  return { ...state, boards: { ...boards, currPlayer: modifiedBoard } };
}
