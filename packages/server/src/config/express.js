const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { logs } = require('./vars');
const routes = require('../api/routes/v1');
const logger = require("./config");
const Sentry = require("@sentry/node");
const {sentryClient} = require("../services/Sentry");
const tweet = require('../services/twitterBot');

const app = express();

app.use(morgan(logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/v1', routes)

app.use(errorLogger)
app.use(errorResponder)

tweet();
if (sentryClient.isActive) {
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.errorHandler())
}

function errorLogger(error, req, res, next) {
  logger.error(error)
  next(error)
}

function errorResponder(error, req, res, next) {
  const message = error.message ? error.message : "Error"
  res.status(400).send({message: message})
}

module.exports = app;
