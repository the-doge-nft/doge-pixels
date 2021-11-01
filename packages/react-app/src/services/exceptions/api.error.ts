import BaseError from "./base.error";

export default class ApiError extends BaseError {
  constructor(public error: any, ...args: any) {
    super(...args);
    this.message = error;
  }
}
