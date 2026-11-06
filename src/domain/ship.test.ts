import { Ship } from "./ship";

test("Should throw", () => {
  expect(() => Ship.create(6)).toThrow();
});
