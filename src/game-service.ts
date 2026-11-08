import {
  attack,
  getEnemy,
  initGameState,
  placeShip,
  type PlayerId,
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

  function getPlayerSpecificData(p: PlayerId) {
    return {
      board: state.boards[p],
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
  }

  return {
    getPlayerSpecificData,
    executeCommand,
  };
}
