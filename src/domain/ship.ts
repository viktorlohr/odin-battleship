export interface Ship {
  readonly shipLength: number;
}

export function createShip(length: number): Ship {
  if (length < 2 || 5 < length) {
    throw new Error("ship length must be between 2 and 5");
  }

  return { shipLength: length };
}
