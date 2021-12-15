import {makeObservable, observable} from "mobx";
import theme from "../DSL/Theme";

class RWDStore {

  @observable
  isMobile = false

  constructor() {
    makeObservable(this)
  }

  init() {
    this.isMobile = this.getIsMobile()
    window.addEventListener('resize', () => {
      this.isMobile = this.getIsMobile()
    })
  }

  private getIsMobile() {
    const mdBreakPoint = Number(theme.breakpoints.md.split("px")[0])
    console.log("debug:: is mobile", this.isMobile, mdBreakPoint, window.innerWidth)
    return window.innerWidth < mdBreakPoint
  }

}


export default RWDStore
