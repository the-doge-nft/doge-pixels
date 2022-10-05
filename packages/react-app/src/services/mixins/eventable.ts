import { Constructor, guardMixinClassInheritance } from "../../helpers/mixins";
import { ObjectKeys } from "../../helpers/objects";

export const SELECT_PIXEL = "SELECT_PIXEL";

interface ListenerType<T extends Object> {
  obj: T;
  fnName: keyof T;
}

type EventType = { [k: string]: ListenerType<any>[] };

export function Eventable<T extends Constructor>(Base1: T) {
  const Eventable = class extends Base1 {
    private listeners: EventType = {};

    publish(eventName: string, data?: any) {
      try {
        if (!this.listeners[eventName]) {
          return;
        }
        this.listeners[eventName].forEach(item => {
          item.obj[item.fnName](data);
        });
      } catch (e) {
        console.error(`error calling listener on event: ${eventName}`, e);
      }
    }

    subscribe<T extends Object>(eventName: string, obj: T, fnName: keyof T) {
      if (this.listeners[eventName] === undefined) {
        this.listeners[eventName] = [{ obj: obj, fnName: fnName } as ListenerType<any>];
      } else if (Array.isArray(this.listeners[eventName])) {
        this.listeners[eventName].push({ obj: obj, fnName: fnName } as ListenerType<any>);
      } else {
        throw Error("Event listener is not an array. This should not happen");
      }
    }

    unsubscribeAllFrom<T extends Object>(obj: T) {
      ObjectKeys(this.listeners).forEach(eventName => {
        for (let i = 0; i < this.listeners[eventName].length; ++i) {
          const config = this.listeners[eventName][i];
          if (config.obj === obj) {
            this.removeListener(eventName, i);
            //after removing listener we have one object less in array
            --i;
          }
        }
      });
    }

    private removeListener(eventName: string, index: number) {
      if (index !== -1) {
        this.listeners[eventName].splice(index, 1);
      } else {
        console.debug("unsubscribe called but listener was not removed.");
      }
    }

    unsubscribe<T extends Object>(eventName: string, obj: T, fnName: keyof T) {
      try {
        const item = this.listeners[eventName].filter(item => item.obj === obj && item.fnName === fnName);
        const index = this.listeners[eventName].indexOf(item[0]);
        this.removeListener(eventName, index);
      } catch (e) {
        console.debug(`error un-subscribing from event: ${eventName}`, e);
      }
    }
  };
  guardMixinClassInheritance(Eventable, Base1);
  return Eventable;
}
