import {
  attack,
  getEnemy,
  initGameState,
  placeShip,
  type PlayerId,
} from "./domain/game-state";
import {
  createCoordStatusMap,
  createMockBoard,
  type CoordStatusMap,
  type CoordTupleStr,
  type Gameboard,
  type ShipPlacementRequest,
} from "./domain/gameboard";

export type Command =
  | { kind: "place ship"; request: ShipPlacementRequest }
  | { kind: "attack"; coordPair: CoordTupleStr };

export interface PlayerSpecificData {
  readonly playerId: PlayerId;
  readonly board: Gameboard;
  readonly enemyCoordStatusMap: CoordStatusMap;
}

export function createGame() {
  let state = initGameState();

  function getCurrentPlayerData(): PlayerSpecificData {
    return {
      playerId: state.currentPlayer,
      board: state.boards[state.currentPlayer],
      enemyCoordStatusMap: createCoordStatusMap(
        state.boards[getEnemy(state)],
        true,
      ),
    };
  }

  // @ts-expect-error only returns if error
  function executeCommand(cmd: Command) {
    let stateResult;
    switch (cmd.kind) {
      case "place ship":
        stateResult = placeShip(state, cmd.request);
        break;
      case "attack":
        stateResult = attack(state, cmd.coordPair);
        break;
    }

    if (!stateResult.ok) {
      return stateResult.err;
    }

    state = stateResult.val;

    if (state.gamePhase === "game over") {
      return "game over";
    }
  }

  return {
    getCurrentPlayerData,
    executeCommand,
  };
}

export function createMockPlayerData(): PlayerSpecificData {
  return {
    playerId: "A",
    board: createMockBoard(),
    enemyCoordStatusMap: createCoordStatusMap(createMockBoard(), true),
  };
}
