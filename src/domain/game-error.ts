export type Result<T, E> = { ok: true; val: T } | { ok: false; err: E };

export function ok<T>(val: T): Result<T, never> {
  return { ok: true, val };
}

export function err<E>(err: E): Result<never, E> {
  return { ok: false, err };
}
