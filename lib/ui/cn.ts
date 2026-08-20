/**
 * Join class-name fragments into a single `className` string.
 * Falsy fragments (`false`, `null`, `undefined`, `""`) are dropped so
 * callers can write conditional variants inline without a third-party kit.
 *
 * @param fragments - Class names or falsy placeholders to omit.
 * @returns A space-separated class string, or an empty string when nothing remains.
 */
export function cn(...fragments: Array<string | false | null | undefined>): string {
  return fragments.filter((fragment): fragment is string => Boolean(fragment)).join(" ");
}
