/** Joins truthy class names. Tiny on purpose: variants are designed not to conflict. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
