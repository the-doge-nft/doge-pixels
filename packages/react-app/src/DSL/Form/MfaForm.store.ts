import { makeObservable, observable } from "mobx";

class MfaFormStore {
  baseData = null as any;
  resolveMainQuery = null as any;
  rejectMainQuery = null as any;
  props = null as any;

  @observable
  isMfaFormVisible = false;

  constructor() {
    makeObservable(this);
  }

  hideMfaForm() {
    this.props = null;
    this.rejectMainQuery = null;
    this.resolveMainQuery = null;
    this.baseData = null;
    this.isMfaFormVisible = false;
  }
}

export default MfaFormStore;
