import { createGame } from "./game-service";
import "./styles.css";
import { loadPlayerScreen } from "./ui/loadPlayerScreen";

const Game = createGame();

Game.subscribe(() => {
  loadPlayerScreen(Game.getCurrentPlayerData());
});

loadPlayerScreen(Game.getCurrentPlayerData());
