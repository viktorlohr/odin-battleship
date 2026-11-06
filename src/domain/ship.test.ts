import { Ship } from "./ship";

const testShip: Ship = { shipLength: 5, hitCount: 4 };

test("Should sink ship", () => {
  expect(Ship.isSunk(Ship.hit(testShip))).toBe(true);
});
