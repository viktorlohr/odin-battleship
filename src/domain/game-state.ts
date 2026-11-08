import { err, ok, type Result } from "./game-error";
import {
  createGameboard,
  hasLost,
  placedAllShips,
  receiveAttack,
  recieveShipPlacement,
  type CoordPair,
  type Gameboard,
  type GameboardError,
  type ShipPlacementRequest,
} from "./gameboard";

const PLAYER_IDS = ["A", "B"] as const;
type PlayerId = (typeof PLAYER_IDS)[number];

export interface GameState {
  readonly currentPlayer: PlayerId;
  readonly gamePhase: GamePhase;
  readonly boards: Record<PlayerId, Gameboard>;
}

export type GamePhase = "place ships" | "battle" | "game over";

export type GameStateResult = Result<GameState, GameError>;
export type GameError = GameboardError | GamePhaseError;
export type GamePhaseError =
  | "Cannot place any more ships. Battle has already begun"
  | "Battle has not begun yet. Someone still needs to place their ships";

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
  if (state.gamePhase === "place ships") {
    return err(
      "Battle has not begun yet. Someone still needs to place their ships",
    );
  }

  const enemy = getEnemy(state);

  const newBoardResult = receiveAttack(state.boards[enemy], coordPair);
  if (!newBoardResult.ok) {
    return newBoardResult;
  }
  const newBoard = newBoardResult.val;

  const gamePhase = hasLost(newBoard) ? "game over" : "battle";

  return ok({
    ...state,
    gamePhase,
    currentPlayer: enemy,
    boards: { ...state.boards, [enemy]: newBoard },
  });
}

export function placeShip(
  state: GameState,
  request: ShipPlacementRequest,
): GameStateResult {
  if (state.gamePhase === "battle") {
    return err("Cannot place any more ships. Battle has already begun");
  }

  const board = state.boards[state.currentPlayer];
  const newBoardResult = recieveShipPlacement(board, request);

  if (!newBoardResult.ok) {
    return newBoardResult;
  }
  const newBoard = newBoardResult.val;

  const gamePhase = PLAYER_IDS.every((p) => placedAllShips(state.boards[p]))
    ? "battle"
    : "place ships";

  return ok({
    ...state,
    gamePhase,
    currentPlayer: getEnemy(state),
    boards: { ...state.boards, [state.currentPlayer]: newBoard },
  });
}

function getEnemy(state: GameState): PlayerId {
  return state.currentPlayer === "A" ? "B" : "A";
}
