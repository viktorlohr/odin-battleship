import { createShip } from "./ship";

test("Should throw", () => {
  expect(() => createShip(6)).toThrow();
});
