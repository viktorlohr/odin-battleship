import {
  attack,
  getEnemy,
  initGameState,
  placeShip,
  type GamePhase,
  type PlayerId,
} from "./domain/game-state";
import {
  createCoordStatusMap,
  createMockBoard,
  getNotYetPlacedShips,
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
  readonly gamePhase: GamePhase;
  readonly board: Gameboard;
  readonly enemyCoordStatusMap: CoordStatusMap;
  readonly remainingShipLengths: number[];
  readonly executeCommand: (cmd: Command) => undefined | string;
}

export function createGame() {
  let state = initGameState();

  function getCurrentPlayerData(): PlayerSpecificData {
    return {
      playerId: state.currentPlayer,
      gamePhase: state.gamePhase,
      board: state.boards[state.currentPlayer],
      enemyCoordStatusMap: createCoordStatusMap(
        state.boards[getEnemy(state)],
        true,
      ),
      remainingShipLengths: getNotYetPlacedShips(
        state.boards[state.currentPlayer],
      ).map((s) => s.shipLength),
      executeCommand,
    };
  }

  // @ts-expect-error only returns if error
  function executeCommand(cmd: Command): undefined | string {
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
      return "Game over! Player " + state.currentPlayer + "won!";
    }
  }

  const subscribers: (() => void)[] = [];
  subscribers.map((s) => {
    s();
  });

  function subscribe(f: () => void) {
    subscribers.push(f);
  }

  return {
    getCurrentPlayerData,
    executeCommand,
    subscribe,
  };
}

export function createMockPlayerData(): PlayerSpecificData {
  return {
    playerId: "A",
    gamePhase: "place ships",
    board: createMockBoard(),
    enemyCoordStatusMap: createCoordStatusMap(createMockBoard(), true),
  };
}
