import { createGame } from "./game-service";

const Game = createGame();

console.log(Game.getCurrentPlayerData());
