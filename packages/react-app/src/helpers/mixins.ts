// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

// export type Constructor = new (...args: any[]) => {};

// Now we use a generic version which can apply a constraint on
// the class which this mixin is applied to
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;
export type Constructor<T = {}> = new (...args: any[]) => T;

export class EmptyClass {}

export class MixinException extends Error {}

/**
 *
 * guardMixinMethodInheritance
 *
 * Description:
 * Mixins add some properties and methods to base class, without knowledge if some methods have not been already present
 * on the 'Base' so they dont place super.method() call in their own implementations.
 * This can lead to errors, when some may suspect calling different parent method than actually predicted.
 * IDE should properly point you to method actually being used, but there is no actual guard for Mixin to 'hide' parent implementation.
 *
 * This guard makes sure, `Base` doesn't already have func `funcName`.
 *
 * Example:
 * ```
 *  function mixinA(Base: any){
 *      return class A extends Base {
 *          jump(){
 *              // super.jump() <-- cannot call jump on super, as we dont have knowledge about Base class, would throw Typescript error
 *              guardMixinMethodInheritance(A, Base, 'jump');
 *              console.log("jump from A");
 *          }
 *      }
 *  }
 *  class B {
 *      jump(){ console.log("jump from B"); }
 *  }
 *  class C extends mixinA(B) { // error! B's 'jump' will be overshadowed by A's jump. there is no way to call B's jump
 *  }
 *  const c = new C();
 *  c.jump();
 *
 *  Without guard output of this would be:
 *  > 'jump from A'
 *
 *  The other way of inheriting IS possible:
 *
 *  class B extends mixinA(EmptyClass) {
 *      jump(){
 *          super.jump();
 *          console.log("jump from B");
 *      }
 *  }
 *  class C extends B{
 *  }
 *  const c = new C();
 *  c.jump();
 *  Output from this call:
 *  > jump from A
 *  > jump from B
 *  Although technically not placing guard on jump call is not an error, but may lead to hard to debug bugs ie in case of multiple inheritance using classes having
 *  same names of methods, thats why it is expected to guard all method calls in mixin classes.
 *
 * @fixme this guard should be implemented as Typescript Lint Rule or some other static-type checking instead of runtime
 *
 * @param MixinClass
 * @param BaseClass
 * @param funcName
 */
export function guardMixinMethodInheritance(MixinClass: any, BaseClass: any, funcName: string) {
  if (BaseClass.prototype[funcName]) {
    const tree: any[] = [];
    tree.push(MixinClass.name);
    let curBase = MixinClass; //BaseClass;
    while (curBase.__proto__ && curBase.__proto__.name) {
      tree.push(curBase.__proto__.name);
      curBase = curBase.__proto__;
    }
    const hint =
      "Make sure no base class in the tree has method names overlapping with mixin class, and there are no duplicate classes in the inheritance tree";
    throw new MixinException(
      "Mixing Guard: found inherited func: " + funcName + " on class " + tree.join(" -> ") + ". " + hint,
    ); //+ ", while trying to create " + MixinClass.name + " mixin");
  }
}

/**
 *
 * guardMixinClassInheritance
 *
 * Description:
 * guardMixinMethodInheritance but for testing all MixinClass methods automatically, instead of testing one-by-one
 * @param MixinClass
 * @param BaseClass
 */
export function guardMixinClassInheritance(MixinClass: any, BaseClass: any) {
  const ignore = ["constructor", "__reactstandin__regenerateByEval"];
  const MixinMethods = Object.getOwnPropertyNames(MixinClass.prototype);
  for (let i = 0; i < MixinMethods.length; ++i) {
    if (ignore.indexOf(MixinMethods[i]) >= 0) {
      continue;
    }
    guardMixinMethodInheritance(MixinClass, BaseClass, MixinMethods[i]);
  }
}
