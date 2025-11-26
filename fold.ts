/**
 * Functional programming utilities in TypeScript
 *
 * This module provides a collection of functional programming primitives:
 * - Combinators (identity)
 * - List manipulation (head, tail, append)
 * - Iteration (foldl, foldr, map, filter)
 * - Function composition (compose, pipe)
 * - Math utilities (add, mult, gt)
 */

// Combinators
/**
 * Identity combinator - returns its argument unchanged
 */
export const I = <T>(x: T): T => x;

// List manipulation
/**
 * Returns the first element of an array
 */
export const head = <T>(xs: T[]): T => xs[0];

/**
 * Returns all elements except the first
 */
export const tail = <T>(xs: T[]): T[] => xs.slice(1);

/**
 * Appends an element to the end of an array (curried)
 */
export const append = <T>(x: T) => (xs: T[]): T[] => [...xs, x];

// Iteration
/**
 * Left fold - reduces an array from left to right
 */
export const foldl = <A, B>(f: (acc: B) => (x: A) => B) => (y: B) => (xs: A[]): B =>
  xs.length > 0 ? foldl(f)(f(y)(head(xs)))(tail(xs)) : y;

/**
 * Right fold - reduces an array from right to left
 */
export const foldr = <A, B>(f: (acc: B) => (x: A) => B) => (y: B) => (xs: A[]): B =>
  xs.length > 0 ? f(foldr(f)(y)(tail(xs)))(head(xs)) : y;

/**
 * Maps a function over an array
 */
export const map = <A, B>(f: (x: A) => B): (xs: A[]) => B[] =>
  foldl<A, B[]>((y: B[]) => (x: A) => append(f(x))(y))([]);

/**
 * Filters an array based on a predicate
 */
export const filter = <T>(f: (x: T) => boolean): (xs: T[]) => T[] =>
  foldl<T, T[]>((y: T[]) => (x: T) => (f(x) ? append(x)(y) : y))([]);

// Function composition
/**
 * Composes two functions (right to left)
 */
export const compose = <A, B, C>(f: (b: B) => C) => (g: (a: A) => B) => (x: A): C =>
  f(g(x));

/**
 * Type for array transformations used in pipe
 */
type ArrayTransform<T> = (xs: T[]) => T[];

/**
 * Pipes an array of functions together (left to right execution)
 * Note: For simplicity, this version works with functions that have matching input/output types
 */
export const pipe = <T>(fns: ArrayTransform<T>[]): ArrayTransform<T> =>
  foldr<ArrayTransform<T>, ArrayTransform<T>>(
    (acc: ArrayTransform<T>) => (fn: ArrayTransform<T>) => compose<T[], T[], T[]>(acc)(fn)
  )(I)(fns);

// Math
/**
 * Adds two numbers (curried)
 */
export const add = (a: number) => (b: number): number => a + b;

/**
 * Multiplies two numbers (curried)
 */
export const mult = (a: number) => (b: number): number => a * b;

/**
 * Checks if the second argument is greater than the first (curried)
 */
export const gt = (a: number) => (b: number): boolean => b > a;

// Program - Example usage demonstrating pipe composition
const result = pipe<number>([
  map(add(1)),
  map(mult(2)),
  filter(gt(10))
])([1, 2, 3, 4, 5, 6, 7, 8]);

// Export the result for verification
export { result };
