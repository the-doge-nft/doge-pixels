import { Constructor } from "../../helpers/mixins";
import { action, computed, makeObservable, observable } from "mobx";
import { arrayPushImmutable } from "../../helpers/arrays";

export interface StepperItems<T> {
  title: string;
  key: T;
}

export interface NavigableInterface<T> {
  stepperItems: StepperItems<T>[];
  showGoBack: boolean;
  activeStepperIndex: number;
  popNavigation: () => void;
}

export function Navigable<K, T extends Constructor>(Base1: T) {
  abstract class Navigable extends Base1 implements NavigableInterface<K> {
    @observable
    navigationStack: K[] = [];

    protected constructor(...rest: any[]) {
      super();
      makeObservable(this);
    }

    @computed
    get currentView() {
      return this.navigationStack[this.navigationStack.length - 1];
    }

    @action
    pushNavigation(view: K) {
      this.navigationStack = arrayPushImmutable(this.navigationStack, view);
    }

    @computed
    get canPopNavigation() {
      return this.navigationStack.length !== 1;
    }

    @action
    popNavigation() {
      this.navigationStack.pop();
    }

    @computed
    get showGoBack() {
      return this.canPopNavigation;
    }

    abstract get stepperItems(): StepperItems<K>[];

    @computed
    get activeStepperIndex() {
      return this.stepperItems.findIndex(item => item.key === this.currentView);
    }

    @action
    destroyNavigation() {
      this.navigationStack = [];
    }
  }
  return Navigable;
}
