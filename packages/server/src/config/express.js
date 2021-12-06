const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { logs } = require('./vars');
const routes = require('../api/routes/v1');
const logger = require("./config");
const Sentry = require("@sentry/node");
const tracing = require("@sentry/tracing");
const vars = require("./vars");

const app = express();

app.use(morgan(logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/v1', routes)

if (vars.env !== "test") {
  Sentry.init({
    dsn: vars.sentry_dns,
    tracesSampleRate: 1.0
  })
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}

app.use(errorLogger)
app.use(errorResponder)


function errorLogger(error, req, res, next) {
  logger.error(error)
  next(error)
}

function errorResponder(error, req, res, next) {
  const message = error.message ? error.message : "Error"
  res.status(400).send({message: message})
}

module.exports = app;
