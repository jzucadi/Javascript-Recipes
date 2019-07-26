//Combinators
const I = x => x;

//List manipulation
const head = xs => xs[0];
const tail = xs => xs.slice(1);
const append = x => xs => [...xs, x];

//Iteration
const foldl = f => y => xs => xs.length > 0 ? foldl(f)(f(y)(head(xs)))(tail(xs)) : y;
const foldr = f => y => xs => xs.length > 0 ? f(foldr(f)(y)(tail(xs)))(head(xs)) : y;
const map = f => foldl(y => x => append(f(x))(y))([]);
const filter = f => foldl(y => x => f(x) ? append(x)(y) : y)([]);

//Function composition
const compose = f => g => x => f(g(x));
const pipe = foldr(compose)(I);

//Math
const add = a => b => a + b;
const mult = a => b => a * b;
const gt = a => b => b > a;

//Program
pipe([
  map(add(1)),
  map(mult(2)),
  filter(gt(10))
])
([1, 2, 3, 4, 5, 6, 7, 8]);
