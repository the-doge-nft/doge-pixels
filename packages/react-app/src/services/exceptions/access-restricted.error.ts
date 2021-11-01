import BaseError from "./base.error";

export default class AccessRestrictedError extends BaseError {
  public readonly redirectUrl?: string;

  constructor(message: string, redirectUrl?: string) {
    super(message);
    this.redirectUrl = redirectUrl;
  }
}
