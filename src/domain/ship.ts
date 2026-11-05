export const Ship = {
  create,
  hit,
  isSunk,
};

export interface Ship {
  readonly length: number;
  readonly hitCount: number;
}

function create(length: number): Ship {
  if (length < 1 || 5 < length) {
    throw new Error("ship length must be between 1 and 5");
  }

  return { length, hitCount: 0 };
}

function isSunk(ship: Ship): boolean {
  return ship.hitCount === ship.length;
}

function hit(ship: Ship): Ship {
  if (isSunk(ship)) {
    throw Error(
      "Should not be possible to hit ship again. There is something wrong in your gameboard logic.",
    );
  }

  return { ...ship, hitCount: ship.hitCount + 1 };
}
