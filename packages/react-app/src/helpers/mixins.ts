// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

// export type Constructor = new (...args: any[]) => {};

// Now we use a generic version which can apply a constraint on
// the class which this mixin is applied to
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;
export type Constructor<T = {}> = new (...args: any[]) => T;

export class EmptyClass {}
