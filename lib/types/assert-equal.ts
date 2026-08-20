/**
 * Compile-time equality of two types.
 * Resolves to `true` only when `A` and `B` are mutually assignable
 * (including optional / readonly differences via the `T extends` trick).
 */
export type AssertEqual<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends <T>() => T extends Right ? 1 : 2
    ? true
    : false;

/**
 * Fail the build when `Check` is not `true`.
 *
 * @param _never - Must be the literal `true` produced by `AssertEqual`.
 * @returns Nothing. Exists only for the type checker.
 */
export function assertEqualTypes<Check extends true>(_never: Check): void {
  return undefined;
}

/**
 * Fail the build when `T` has keys that are not on `Row`.
 * Used so Insert/Update shapes cannot invent columns.
 */
export type AssertKeysSubset<Subset, Row> =
  Exclude<keyof Subset, keyof Row> extends never ? true : false;
