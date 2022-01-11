import { Constructor } from "../../helpers/mixins";
import { IReactionDisposer, IReactionOptions, IReactionPublic, reaction } from "mobx";

export function Reactionable<T extends Constructor>(Base1: T) {
  class Reactionable extends Base1 {
    private autoDispose: IReactionDisposer[] = [];

    react<T>(
      expression: (r: IReactionDisposer) => T,
      effect: (arg: T, r: IReactionPublic) => void,
      opts?: IReactionOptions<any, any>,
    ) {
      //@ts-ignore
      this.autoDispose.push(reaction(expression, effect, opts));
    }

    disposeReactions() {
      if (this.autoDispose && this.autoDispose.length) {
        this.autoDispose.map((reaction: any) => reaction());
        this.autoDispose = [];
      }
    }
  }
  return Reactionable;
}
