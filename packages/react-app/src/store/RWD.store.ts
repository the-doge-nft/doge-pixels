import {makeObservable, observable} from "mobx";
import theme from "../DSL/Theme";

class RWDStore {

  // mobile fold is a pain in the ass
  // https://bugs.webkit.org/show_bug.cgi?id=141832#c5
  // https://github.com/w3c/csswg-drafts/issues/4329

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
    return window.innerWidth < mdBreakPoint
  }

}


export default RWDStore
