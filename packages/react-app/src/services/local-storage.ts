class LocalStorageClass {
  PARSE_JSON = "parse-json";
  PARSE_STRING = "parse-string";

  private get ls() {
    return window.localStorage;
  }

  public setItem(key: string, value: any) {
    if (value === undefined || value === null) {
      return this.removeItem(key);
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    return this.ls.setItem(key, value);
  }

  public removeItem(key: string) {
    return this.ls.removeItem(key);
  }

  public getItem(key: string, parse: string, defaultValue: any): any {
    const item = this.ls.getItem(key);
    if (item === undefined || item === null) {
      return defaultValue;
    }
    try {
      switch (parse) {
        case LocalStorage.PARSE_JSON:
          return JSON.parse(item);
        case LocalStorage.PARSE_STRING:
          return item;
        default:
          break;
      }
    } catch (e) {
      console.error("LS ERROR:", e);
      return defaultValue;
    }
    return item;
  }

  public clearAll() {
    window.localStorage.clear();
  }
}
const LocalStorage = new LocalStorageClass();
export default LocalStorage;
