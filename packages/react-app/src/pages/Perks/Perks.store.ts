import { makeObservable } from "mobx"

export interface PerkItem {
  title: string;
  description: string;
}

class PerksStore {
  items: PerkItem[] = [
    {
      title: "In Doge We Trust",
      description: ""
    }
  ]

  // constructor() {
  //   makeObservable(this)
  // }
}

export default PerksStore
