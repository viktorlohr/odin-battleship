import type { Gameboard } from "./gameboard";

export type PlayerId = "A" | "B";

export interface GameState {
  currentPlayer: PlayerId;
  boards: Record<PlayerId, Gameboard>;
}
