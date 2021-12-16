import {makeObservable, observable} from "mobx";
import { matchPath } from "react-router-dom";
import theme from "../DSL/Theme";
import {NamedRoutes, route} from "../App.routes";

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
    return window.innerWidth < mdBreakPoint
  }

}


export default RWDStore
