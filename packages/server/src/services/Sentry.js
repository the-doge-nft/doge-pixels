const Sentry = require("@sentry/node");
const {sentry_dns, env} = require("../config/vars");
// const app = require("../config/express");/


class _Sentry {
  isActive = false
  constructor() {
    if (env !== "test") {
      this.isActive = true
      this.init()
    }
  }

  init() {
    Sentry.init({
      dsn: sentry_dns,
      tracesSampleRate: 1.0
    })
    this.isActive = true
  }

  captureMessage(message) {
    if (this.isActive) {
      Sentry.captureMessage(message);
    }
  }
}

const sentryClient = new _Sentry()

module.exports = {sentryClient}

