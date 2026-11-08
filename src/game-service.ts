import {
  attack,
  getEnemy,
  initGameState,
  placeShip,
} from "./domain/game-state";
import type {
  CoordPair,
  Gameboard,
  ShipPlacementRequest,
} from "./domain/gameboard";

export type Command =
  | { kind: "place ship"; request: ShipPlacementRequest }
  | { kind: "attack"; coordPair: CoordPair };

export interface PlayerSpecificData {
  readonly board: Gameboard;
  readonly attacksOnEnemy: CoordPair[];
}

export function createGame() {
  let state = initGameState();

  function getCurrentPlayerData() {
    return {
      board: state.boards[state.currentPlayer],
      attacksOnEmeny: state.boards[getEnemy(state)].attackedCoords,
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
  function getCurrentPlayer() {
    return state.currentPlayer;
  }

  return {
    getCurrentPlayerData,
    getCurrentPlayer,
    executeCommand,
  };
}
