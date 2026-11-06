export const Ship = {
  create,
};

export interface Ship {
  readonly shipLength: number;
}

function create(length: number): Ship {
  if (length < 1 || 5 < length) {
    throw new Error("ship length must be between 1 and 5");
  }

  return { shipLength: length };
}
