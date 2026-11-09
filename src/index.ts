import { createMockPlayerData } from "./game-service";
import "./styles.css";
import { loadPlayerScreen } from "./ui/loadPlayerScreen";

const mockData = createMockPlayerData();

loadPlayerScreen(mockData);
