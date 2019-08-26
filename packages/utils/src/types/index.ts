/**
 * Selects a subset of keys on T that are typed as V.
 *
 * @author jcalz
 * @see https://stackoverflow.com/a/54520829
 */
export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
