import { Navigable } from "../../../services/mixins/navigable";
import {AbstractConstructor, EmptyClass} from "../../../helpers/mixins";
import { makeObservable, observable } from "mobx";
import AppStore from "../../../store/App.store";

export enum BurnPixelsModalView {
  Select = "select"
}

class BurnPixelsModalStore extends Navigable<AbstractConstructor, BurnPixelsModalView>(EmptyClass){

  @observable
  selectedPixels: number[] = []

  constructor(defaultPixel: number | null) {
    super();
    makeObservable(this)
    this.pushNavigation(BurnPixelsModalView.Select)
    if (defaultPixel !== null) {
      this.selectedPixels.push(defaultPixel)
    }
  }

  get stepperItems() {
    return []
  }

  handlePixelSelect(tokenId: number) {
    console.log("debug:: handle pixel select")
    if (!this.selectedPixels.includes(tokenId)) {
      this.selectedPixels.push(tokenId)
    } else {
      const index = this.selectedPixels.indexOf(tokenId)
      this.selectedPixels.splice(index, 1)
    }
  }

  handleSubmit() {
    return new Promise((resolve, reject) => {
      try {
        this.selectedPixels.forEach(async (tokenId) => {
          const tx = await AppStore.web3.burnPupper(tokenId)
          await tx.wait()
          AppStore.web3.refreshDogBalance()
          AppStore.web3.refreshPupperBalance()
        })
        resolve(this.selectedPixels)
      } catch (e) {
        return reject()
      }
    })
  }

}

export default BurnPixelsModalStore
