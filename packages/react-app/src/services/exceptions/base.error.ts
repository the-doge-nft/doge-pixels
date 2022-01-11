export default abstract class BaseError extends Error {
  constructor(...args: any) {
    super(...args);
    try {
      //@ts-ignore
      if (Error.captureStackTrace) {
        //@ts-ignore
        Error.captureStackTrace(this, BaseError);
      }
    } catch (e) {
      console.error("couldn't capture stack trace", e);
    }
  }
}
