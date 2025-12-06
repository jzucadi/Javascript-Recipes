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
 * Returns the first element of an array, or undefined if the array is empty
 */
export const head = <T>(xs: T[]): T | undefined => xs[0];

/**
 * Returns all elements except the first (returns empty array if input is empty)
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
  xs.length > 0 ? foldl(f)(f(y)(head(xs) as A))(tail(xs)) : y;

/**
 * Right fold - reduces an array from right to left
 */
export const foldr = <A, B>(f: (acc: B) => (x: A) => B) => (y: B) => (xs: A[]): B =>
  xs.length > 0 ? f(foldr(f)(y)(tail(xs)))(head(xs) as A) : y;

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
 * Composes two functions (right to left): compose(f)(g)(x) = f(g(x))
 */
export const compose = <A, B, C>(f: (b: B) => C) => (g: (a: A) => B) => (x: A): C =>
  f(g(x));

/**
 * Type for functions that transform arrays of the same type
 */
type ArrayTransform<T> = (xs: T[]) => T[];

/**
 * Pipes an array of functions together, executing from left to right.
 * 
 * This TypeScript version is constrained to functions with matching input/output types
 * (ArrayTransform<T>) to maintain type safety. The original JavaScript version
 * `pipe = foldr(compose)(I)` is more general but lacks static type checking.
 * 
 * @example
 * pipe<number>([map(add(1)), map(mult(2)), filter(gt(10))])([1, 2, 3, 4, 5])
 * // Returns [12, 14] - numbers that are > 10 after (x+1)*2 transformation
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
